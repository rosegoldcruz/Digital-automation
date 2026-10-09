"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { motion, useInView, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion"
import { Cpu, Factory, Home, Info, PackageCheck, Pause, Play, Store, type LucideIcon } from "lucide-react"
import { useLoopProgress } from "@/hooks/use-loop-progress"
import { useMediaQuery } from "@/hooks/use-media-query"
import { clamp01, pointAlong } from "@/lib/svg-path"
import { cn } from "@/lib/utils"
import { NodeBadge } from "./node-badge"
import { SectionHeading } from "./section-heading"

type SupplierId = "a" | "b" | "c"
type NodeId = "store" | "process" | "a" | "b" | "c" | "fulfillment" | "customer"
type State = "idle" | "active" | "done"

interface NodeDef {
  id: NodeId
  label: string
  icon: LucideIcon
  description: string
  active: string
  done: string
  facts?: [string, string][]
}

const COLOR = "#22d3ee"
const TRAVEL = 0.85
const TRAIL = 4
// Index of each fixed node along the 5-node route (supplier nodes all sit at index 2).
const ROUTE_INDEX: Record<NodeId, number> = { store: 0, process: 1, a: 2, b: 2, c: 2, fulfillment: 3, customer: 4 }

const NODES: Record<NodeId, NodeDef> = {
  store: {
    id: "store",
    label: "Amazon Store",
    icon: Store,
    description: "Where the customer places an order for a listed product.",
    active: "Order received",
    done: "Order placed",
  },
  process: {
    id: "process",
    label: "Order Processing",
    icon: Cpu,
    description: "Order details are checked and matched to the supplier that holds the product.",
    active: "Routing order",
    done: "Order routed",
  },
  a: {
    id: "a",
    label: "Supplier A",
    icon: Factory,
    description: "A sample supplier in the network. Select it to route the simulated order through it.",
    active: "Preparing item",
    done: "Handed off",
    facts: [
      ["Category", "Home & Kitchen"],
      ["Stock check", "In stock"],
      ["Handling", "1 business day"],
    ],
  },
  b: {
    id: "b",
    label: "Supplier B",
    icon: Factory,
    description: "A sample supplier in the network. Select it to route the simulated order through it.",
    active: "Preparing item",
    done: "Handed off",
    facts: [
      ["Category", "Electronics accessories"],
      ["Stock check", "In stock"],
      ["Handling", "2 business days"],
    ],
  },
  c: {
    id: "c",
    label: "Supplier C",
    icon: Factory,
    description: "A sample supplier in the network. Select it to route the simulated order through it.",
    active: "Preparing item",
    done: "Handed off",
    facts: [
      ["Category", "Outdoor & Garden"],
      ["Stock check", "In stock"],
      ["Handling", "1 business day"],
    ],
  },
  fulfillment: {
    id: "fulfillment",
    label: "Fulfillment",
    icon: PackageCheck,
    description: "The supplier packs the item and hands it to the carrier.",
    active: "Shipping",
    done: "Shipped",
  },
  customer: {
    id: "customer",
    label: "Customer",
    icon: Home,
    description: "The customer receives the order.",
    active: "Delivered (simulated)",
    done: "Delivered (simulated)",
  },
}

interface Layout {
  w: number
  h: number
  pos: Record<NodeId, { x: number; y: number }>
  edges: Record<string, string>
}

const WIDE: Layout = {
  w: 1000,
  h: 420,
  pos: {
    store: { x: 80, y: 210 },
    process: { x: 290, y: 210 },
    a: { x: 540, y: 70 },
    b: { x: 540, y: 210 },
    c: { x: 540, y: 350 },
    fulfillment: { x: 770, y: 210 },
    customer: { x: 930, y: 210 },
  },
  edges: {
    sp: "M80 210 L290 210",
    pa: "M290 210 C400 210 420 70 540 70",
    pb: "M290 210 L540 210",
    pc: "M290 210 C400 210 420 350 540 350",
    af: "M540 70 C660 70 660 210 770 210",
    bf: "M540 210 L770 210",
    cf: "M540 350 C660 350 660 210 770 210",
    fc: "M770 210 L930 210",
  },
}

const TALL: Layout = {
  w: 400,
  h: 760,
  pos: {
    store: { x: 200, y: 50 },
    process: { x: 200, y: 190 },
    a: { x: 70, y: 350 },
    b: { x: 200, y: 350 },
    c: { x: 330, y: 350 },
    fulfillment: { x: 200, y: 510 },
    customer: { x: 200, y: 670 },
  },
  edges: {
    sp: "M200 50 L200 190",
    pa: "M200 190 C200 270 70 270 70 350",
    pb: "M200 190 L200 350",
    pc: "M200 190 C200 270 330 270 330 350",
    af: "M70 350 C70 430 200 430 200 510",
    bf: "M200 350 L200 510",
    cf: "M330 350 C330 430 200 430 200 510",
    fc: "M200 510 L200 670",
  },
}

const SUPPLIERS: SupplierId[] = ["a", "b", "c"]
const routeEdges = (s: SupplierId) => ["sp", `p${s}`, `${s}f`, "fc"]

function LitEdge({ d, progress, index, color }: { d: string; progress: MotionValue<number>; index: number; color: string }) {
  const length = useTransform(progress, (p) => clamp01((Math.min(p / TRAVEL, 1)) * 4 - index))
  return (
    <motion.path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={3.5}
      strokeLinecap="round"
      style={{ pathLength: length, filter: `drop-shadow(0 0 6px ${color})` }}
    />
  )
}

export function SupplierNetwork() {
  const isWide = useMediaQuery("(min-width: 768px)")
  const layout = isWide ? WIDE : TALL
  const reduce = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)
  const edgeRefs = useRef<Record<string, SVGPathElement | null>>({})
  const headRef = useRef<SVGGElement>(null)
  const trailRefs = useRef<(SVGCircleElement | null)[]>([])
  const stepRef = useRef(0)
  const lastP = useRef(0)

  const [supplier, setSupplier] = useState<SupplierId>("a")
  const [paused, setPaused] = useState(false)
  const [hover, setHover] = useState<NodeId | null>(null)
  const [step, setStep] = useState(0)
  const [order, setOrder] = useState(1)

  const inView = useInView(containerRef, { margin: "-10% 0px" })
  const progress = useLoopProgress(9, inView && !paused && !reduce)

  const update = useCallback(
    (p: number) => {
      if (p < lastP.current - 0.5) setOrder((o) => o + 1)
      lastP.current = p
      const f = Math.min(p / TRAVEL, 1)
      const route = routeEdges(supplier).map((id) => edgeRefs.current[id])
      if (route.some((r) => !r)) return

      const head = pointAlong(route, f)
      if (head && headRef.current) {
        headRef.current.setAttribute("transform", `translate(${head.x} ${head.y})`)
        headRef.current.setAttribute("opacity", p > 0.93 ? "0" : "1")
      }
      trailRefs.current.forEach((el, k) => {
        if (!el) return
        const tf = f - (k + 1) * 0.02
        const pt = tf > 0 ? pointAlong(route, tf) : null
        if (!pt || p > 0.93) return el.setAttribute("opacity", "0")
        el.setAttribute("cx", String(pt.x))
        el.setAttribute("cy", String(pt.y))
        el.setAttribute("opacity", String(0.55 - k * 0.12))
      })

      const s = f >= 0.9999 ? 4 : Math.max(0, Math.min(4, Math.floor(f * 4 + 0.06)))
      if (s !== stepRef.current) {
        stepRef.current = s
        setStep(s)
      }
    },
    [supplier],
  )

  useMotionValueEvent(progress, "change", update)

  useEffect(() => {
    if (reduce) progress.set(0.95)
    update(progress.get())
  }, [layout, supplier, reduce, progress, update])

  const nodeState = (id: NodeId): State => {
    if (SUPPLIERS.includes(id as SupplierId) && id !== supplier) return "idle"
    const idx = ROUTE_INDEX[id]
    return idx < step ? "done" : idx === step ? "active" : "idle"
  }

  const statusText = (id: NodeId, state: State) => {
    const def = NODES[id]
    if (SUPPLIERS.includes(id as SupplierId) && id !== supplier) return "Standby"
    if (state === "active") return def.active
    if (state === "done") return def.done
    return "Waiting"
  }

  const detailId: NodeId = hover ?? (["store", "process", supplier, "fulfillment", "customer"] as NodeId[])[step]
  const detail = NODES[detailId]
  const detailState = nodeState(detailId)

  return (
    <section id="supplier-network" className="relative overflow-hidden bg-black py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Supplier fulfillment network"
          title="From Amazon order to customer doorstep"
          description="Follow a simulated order through the network. Select a supplier to change its route."
        />

        <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-4 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
              <Info className="h-3.5 w-3.5 shrink-0" />
              Illustrative data. Simulated orders only, not real transactions.
            </p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-neutral-400">Simulated order SIM-{String(order).padStart(4, "0")}</span>
              <button
                type="button"
                onClick={() => setPaused((v) => !v)}
                aria-pressed={paused}
                aria-label={paused ? "Play simulation" : "Pause simulation"}
                className="rounded-full border border-white/15 p-2 text-neutral-300 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
              >
                {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_16.25rem]">
            <div ref={containerRef} className="relative mx-auto w-full max-w-[62.5rem]" style={{ aspectRatio: `${layout.w} / ${layout.h}` }}>
              <svg
                key={isWide ? "wide" : "tall"}
                viewBox={`0 0 ${layout.w} ${layout.h}`}
                className="absolute inset-0 h-full w-full overflow-visible"
                aria-hidden
              >
                {Object.entries(layout.edges).map(([id, d]) => {
                  const inRoute = routeEdges(supplier).includes(id)
                  return (
                    <path
                      key={id}
                      ref={(el) => {
                        edgeRefs.current[id] = el
                      }}
                      d={d}
                      fill="none"
                      stroke={inRoute ? "rgba(34,211,238,0.28)" : "rgba(255,255,255,0.1)"}
                      strokeWidth={2}
                      strokeDasharray={inRoute ? undefined : "3 9"}
                      strokeLinecap="round"
                      style={{ transition: "stroke 0.4s" }}
                    />
                  )
                })}
                {routeEdges(supplier).map((id, i) => (
                  <LitEdge key={`${supplier}-${id}`} d={layout.edges[id]} progress={progress} index={i} color={COLOR} />
                ))}
                {Array.from({ length: TRAIL }, (_, k) => (
                  <circle
                    key={k}
                    ref={(el) => {
                      trailRefs.current[k] = el
                    }}
                    r={Math.max(2, 6 - k)}
                    fill={COLOR}
                    opacity={0}
                  />
                ))}
                <g ref={headRef}>
                  <circle r={16} fill={COLOR} opacity={0.22} />
                  <circle r={7} fill="#fff" />
                  <circle r={4.5} fill={COLOR} />
                </g>
              </svg>

              {(Object.keys(NODES) as NodeId[]).map((id) => {
                const def = NODES[id]
                const pt = layout.pos[id]
                const isSupplier = SUPPLIERS.includes(id as SupplierId)
                const state = nodeState(id)
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={isSupplier ? () => setSupplier(id as SupplierId) : undefined}
                    onPointerEnter={() => setHover(id)}
                    onPointerLeave={() => setHover(null)}
                    onFocus={() => setHover(id)}
                    onBlur={() => setHover(null)}
                    aria-pressed={isSupplier ? id === supplier : undefined}
                    aria-label={`${def.label}. Status: ${statusText(id, state)}.${isSupplier ? " Select to route the simulated order here." : ""}`}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 rounded-xl outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/70",
                      !isSupplier && "cursor-default",
                    )}
                    style={{ left: `${(pt.x / layout.w) * 100}%`, top: `${(pt.y / layout.h) * 100}%` }}
                  >
                    <NodeBadge
                      icon={def.icon}
                      label={def.label}
                      sublabel={statusText(id, state)}
                      color={COLOR}
                      state={state}
                      size={isWide ? 56 : 50}
                      dimmed={isSupplier && id !== supplier}
                    />
                  </button>
                )
              })}
            </div>

            <aside aria-label="Node details" className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[0.6875rem] uppercase tracking-widest text-cyan-300">
                {hover ? "Inspecting" : "Current stage"}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-white">{detail.label}</h3>
              <p className="mt-1 text-sm text-neutral-400">{detail.description}</p>
              <p className="mt-4 flex items-center gap-2 text-sm text-white">
                <span
                  className={cn(
                    "h-2 w-2 rounded-full",
                    detailState === "active" ? "bg-cyan-300" : detailState === "done" ? "bg-emerald-400" : "bg-neutral-600",
                  )}
                />
                {statusText(detailId, detailState)}
              </p>
              {detail.facts && (
                <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
                  {detail.facts.map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-3">
                      <dt className="text-neutral-500">{k}</dt>
                      <dd className="text-right text-neutral-200">{v}</dd>
                    </div>
                  ))}
                  <p className="pt-1 text-[0.6875rem] text-amber-200/80">Sample values for illustration.</p>
                </dl>
              )}
            </aside>
          </div>
        </div>
      </div>
    </section>
  )
}
