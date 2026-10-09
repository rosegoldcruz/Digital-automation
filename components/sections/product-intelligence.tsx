"use client"

import { useEffect, useRef, useState } from "react"
import { LayoutGroup, motion } from "framer-motion"
import NumberFlow from "@number-flow/react"
import {
  Archive,
  Check,
  Info,
  Loader2,
  Package,
  RotateCcw,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Utensils,
  Droplets,
  Cable,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { SectionHeading } from "./section-heading"

type Status = "healthy" | "underperforming" | "candidate" | "new" | "retired"

interface Product {
  id: string
  name: string
  category: string
  icon: LucideIcon
  trend: number[]
  // Sample sell-through %, null while a product has no sales history.
  sellThrough: number | null
  opportunity?: number
}

const LIFECYCLE = ["Research", "List", "Monitor", "Evaluate", "Optimize"] as const
const STAGE = { research: 0, list: 1, monitor: 2, evaluate: 3, optimize: 4 }

const CATALOG: Product[] = [
  { id: "p1", name: "Bamboo Desk Organizer", category: "Home Office", icon: Package, trend: [40, 48, 52, 58, 61, 66, 70, 72], sellThrough: 72 },
  { id: "p2", name: "Silicone Utensil Set", category: "Kitchen", icon: Utensils, trend: [52, 44, 40, 31, 28, 24, 21, 18], sellThrough: 18 },
  { id: "p3", name: "Adjustable Phone Stand", category: "Accessories", icon: Smartphone, trend: [50, 53, 49, 57, 60, 59, 64, 66], sellThrough: 66 },
  { id: "p4", name: "Reusable Produce Bags", category: "Home & Garden", icon: ShoppingBag, trend: [46, 42, 37, 35, 30, 27, 24, 22], sellThrough: 22 },
]

const QUEUE: Product[] = [
  { id: "c1", name: "Cable Management Kit", category: "Accessories", icon: Cable, trend: [30, 36, 41, 47, 55, 60, 66, 74], sellThrough: null, opportunity: 78 },
  { id: "c2", name: "Insulated Water Bottle", category: "Outdoor", icon: Droplets, trend: [28, 33, 39, 46, 52, 58, 63, 69], sellThrough: null, opportunity: 74 },
  { id: "c3", name: "Foldable Storage Bins", category: "Home & Garden", icon: Archive, trend: [32, 35, 40, 44, 50, 55, 59, 65], sellThrough: null, opportunity: 71 },
]

const CHECKS = [
  "Current product is below the sell-through threshold (sample rule)",
  "Replacement candidate has a supplier available",
  "Replacement meets the margin rule (sample rule)",
  "Approval rule satisfied (sample: auto-approve)",
]

const STATUS_STYLE: Record<Status, { label: string; text: string; stroke: string; chip: string }> = {
  healthy: { label: "Healthy", text: "text-emerald-300", stroke: "#34d399", chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300" },
  underperforming: { label: "Underperforming", text: "text-rose-300", stroke: "#fb7185", chip: "border-rose-400/40 bg-rose-400/10 text-rose-300" },
  candidate: { label: "Eligible", text: "text-cyan-300", stroke: "#67e8f9", chip: "border-cyan-300/30 bg-cyan-300/10 text-cyan-300" },
  new: { label: "Newly listed", text: "text-cyan-300", stroke: "#67e8f9", chip: "border-cyan-300/40 bg-cyan-300/10 text-cyan-300" },
  retired: { label: "Retired", text: "text-neutral-400", stroke: "#737373", chip: "border-white/15 bg-white/5 text-neutral-400" },
}

const SPRING = { type: "spring", stiffness: 260, damping: 28 } as const

function Sparkline({ values, stroke, dashed }: { values: number[]; stroke: string; dashed?: boolean }) {
  const w = 120
  const h = 34
  const d = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (values.length - 1)) * w} ${h - (v / 100) * h}`)
    .join(" ")
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-8 w-full overflow-visible" aria-hidden>
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={dashed ? "3 4" : undefined}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  )
}

interface CardProps {
  product: Product
  status: Status
  selected?: boolean
  onSelect?: () => void
  disabled?: boolean
}

function ProductCard({ product, status, selected, onSelect, disabled }: CardProps) {
  const style = STATUS_STYLE[status]
  const Icon = product.icon
  const interactive = !!onSelect && !disabled
  return (
    <motion.div
      layout
      layoutId={product.id}
      transition={SPRING}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-pressed={interactive ? selected : undefined}
      aria-label={interactive ? `Select ${product.name}, underperforming` : undefined}
      onClick={interactive ? onSelect : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onSelect?.()
              }
            }
          : undefined
      }
      whileHover={interactive ? { y: -3 } : undefined}
      className={cn(
        "relative rounded-2xl border bg-neutral-900/80 p-4 outline-none",
        interactive && "cursor-pointer focus-visible:ring-2 focus-visible:ring-white/70",
        selected ? "border-rose-300/70 shadow-[0_0_32px_-8px_rgba(251,113,133,0.7)]" : "border-white/10",
        status === "retired" && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <Icon className={cn("h-5 w-5", style.text)} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">{product.name}</p>
          <p className="text-xs text-neutral-500">{product.category}</p>
        </div>
        <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium", style.chip)}>{style.label}</span>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <div className="w-24 shrink-0">
          <Sparkline values={product.trend} stroke={style.stroke} dashed={status === "candidate" || status === "new"} />
        </div>
        <p className="ml-auto text-right text-xs text-neutral-400">
          {product.sellThrough !== null ? (
            <>
              <span className={cn("text-base font-semibold", style.text)}>{product.sellThrough}%</span>
              <br />
              sell-through
            </>
          ) : status === "new" ? (
            <>
              <span className="text-base font-semibold text-cyan-300">—</span>
              <br />
              monitoring
            </>
          ) : (
            <>
              <span className="text-base font-semibold text-cyan-300">{product.opportunity}</span>
              <br />
              opportunity
            </>
          )}
        </p>
      </div>
    </motion.div>
  )
}

const isUnder = (p: Product) => p.sellThrough !== null && p.sellThrough < 40

export function ProductIntelligence() {
  const [catalog, setCatalog] = useState(CATALOG)
  const [queue, setQueue] = useState(QUEUE)
  const [retired, setRetired] = useState<Product[]>([])
  const [stage, setStage] = useState(STAGE.monitor)
  const [selected, setSelected] = useState<string | null>(null)
  const [checks, setChecks] = useState(0)
  const [busy, setBusy] = useState(false)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms))
  }
  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

  const rated = catalog.filter((p) => p.sellThrough !== null)
  const health = rated.length ? Math.round(rated.reduce((s, p) => s + (p.sellThrough ?? 0), 0) / rated.length) : 0
  const selectedProduct = catalog.find((p) => p.id === selected) ?? null
  const hasUnder = catalog.some(isUnder)

  const statusOf = (p: Product): Status => (p.sellThrough === null ? "new" : isUnder(p) ? "underperforming" : "healthy")

  const optimize = () => {
    if (!selectedProduct || busy || queue.length === 0) return
    const outgoing = selectedProduct
    const incoming = queue[0]
    setBusy(true)
    setStage(STAGE.evaluate)
    setChecks(0)
    CHECKS.forEach((_, i) => later(() => setChecks(i + 1), 450 * (i + 1)))

    later(() => {
      setStage(STAGE.optimize)
      setCatalog((c) => c.map((p) => (p.id === outgoing.id ? incoming : p)))
      setQueue((q) => q.slice(1))
      setRetired((r) => [...r, outgoing])
      setSelected(null)
    }, 450 * CHECKS.length + 500)

    later(() => setStage(STAGE.list), 450 * CHECKS.length + 1500)

    later(() => {
      setStage(STAGE.monitor)
      setChecks(0)
      setBusy(false)
    }, 450 * CHECKS.length + 2600)
  }

  const reset = () => {
    clearTimers()
    setCatalog(CATALOG)
    setQueue(QUEUE)
    setRetired([])
    setSelected(null)
    setChecks(0)
    setStage(STAGE.monitor)
    setBusy(false)
  }

  const changed = retired.length > 0

  return (
    <section id="product-intelligence" className="relative bg-black py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="AI product intelligence"
          title="A catalog that doesn’t stand still"
          description="Select an underperforming product and watch the optimization cycle replace it."
        />

        <div className="rounded-3xl border border-white/10 bg-neutral-950/80 p-4 sm:p-8">
          <ol className="relative mb-8 grid grid-cols-5 gap-2" aria-label="Product lifecycle">
            {LIFECYCLE.map((label, i) => {
              const current = i === stage
              return (
                <li key={label} aria-current={current ? "step" : undefined} className="relative text-center">
                  <div className="relative mx-auto flex h-10 w-10 items-center justify-center">
                    {current && (
                      <motion.span
                        layoutId="lifecycle-active"
                        transition={SPRING}
                        className="absolute inset-0 rounded-full bg-cyan-300/20 ring-1 ring-cyan-300"
                      />
                    )}
                    <span className={cn("relative font-mono text-xs", current ? "text-cyan-200" : "text-neutral-500")}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <span className={cn("mt-1 block text-[11px] sm:text-sm", current ? "font-medium text-white" : "text-neutral-500")}>
                    {label}
                  </span>
                </li>
              )
            })}
            <span aria-hidden className="absolute left-[10%] right-[10%] top-5 -z-10 h-px bg-white/10" />
          </ol>

          <LayoutGroup>
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
              <div className="space-y-6">
                <div>
                  <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-400">Live catalog</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {catalog.map((p) => {
                      const status = statusOf(p)
                      return (
                        <ProductCard
                          key={p.id}
                          product={p}
                          status={status}
                          selected={p.id === selected}
                          disabled={busy || status !== "underperforming"}
                          onSelect={() => setSelected((s) => (s === p.id ? null : p.id))}
                        />
                      )
                    })}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-400">Research queue · eligible replacements</h3>
                    <div className="grid gap-3">
                      {queue.map((p) => (
                        <ProductCard key={p.id} product={p} status="candidate" />
                      ))}
                      {queue.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-neutral-500">Queue is empty.</p>}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-xs uppercase tracking-widest text-neutral-400">Retired from catalog</h3>
                    <div className="grid gap-3">
                      {retired.map((p) => (
                        <ProductCard key={p.id} product={p} status="retired" />
                      ))}
                      {retired.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-4 text-sm text-neutral-500">Nothing retired yet.</p>}
                    </div>
                  </div>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <p className="text-xs uppercase tracking-widest text-neutral-400">Catalog health (sample)</p>
                  <p className="mt-2 flex items-baseline gap-1 text-5xl font-semibold text-white">
                    <NumberFlow value={health} transformTiming={{ duration: 900, easing: "ease-out" }} />
                    <span className="text-2xl text-neutral-500">%</span>
                  </p>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-400"
                      animate={{ width: `${health}%` }}
                      transition={SPRING}
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">Average sell-through of products with sales history.</p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  {busy ? (
                    <>
                      <p className="flex items-center gap-2 text-sm font-medium text-white">
                        <Loader2 className="h-4 w-4 animate-spin text-cyan-300" /> Evaluating {selectedProduct?.name ?? "replacement"}
                      </p>
                      <ul className="mt-3 space-y-2">
                        {CHECKS.map((c, i) => (
                          <li key={c} className={cn("flex items-start gap-2 text-xs transition-colors", i < checks ? "text-neutral-200" : "text-neutral-600")}>
                            <Check className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", i < checks ? "text-emerald-400" : "text-neutral-700")} />
                            {c}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : selectedProduct ? (
                    <>
                      <p className="text-sm font-medium text-white">{selectedProduct.name}</p>
                      <p className="mt-1 text-xs text-neutral-400">
                        Sell-through of {selectedProduct.sellThrough}% is trending down. The cycle evaluates the next eligible product in the research queue and swaps it in.
                      </p>
                      <button
                        type="button"
                        onClick={optimize}
                        disabled={queue.length === 0}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-sky-500 px-4 py-2.5 text-sm font-semibold text-black transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <Sparkles className="h-4 w-4" /> Run optimization
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-neutral-400">
                      {hasUnder
                        ? "Select a product flagged Underperforming to evaluate it."
                        : changed
                          ? "No underperforming products remain in this sample catalog."
                          : "All sample products are healthy."}
                    </p>
                  )}
                </div>

                {changed && !busy && (
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-neutral-300 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                  >
                    <RotateCcw className="h-4 w-4" /> Reset demo
                  </button>
                )}
              </aside>
            </div>
          </LayoutGroup>

          <p className="mt-6 flex items-start gap-2 text-xs text-neutral-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Illustrative products and metrics for demonstration. Actual product automation depends on supported integrations and approval rules.
          </p>
        </div>
      </div>
    </section>
  )
}
