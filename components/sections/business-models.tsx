"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import {
  Boxes,
  Factory,
  Home,
  Lightbulb,
  Pause,
  Play,
  ShoppingCart,
  Warehouse,
  PackageCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { FlowDiagram, type FlowLayout, type FlowStep } from "./flow-diagram"
import { SectionHeading } from "./section-heading"

interface Model {
  id: "fbm" | "fba" | "pl"
  name: string
  tag: string
  summary: string
  color: string
  variant: "orb" | "batch" | "morph"
  steps: FlowStep[]
  wide: FlowLayout
  tall: FlowLayout
}

const FBA_RECT = (x: number, y: number, w: number, h: number) => (
  <rect x={x} y={y} width={w} height={h} rx={22} fill="#fbbf24" fillOpacity={0.04} stroke="#fbbf24" strokeOpacity={0.35} strokeDasharray="6 6" />
)

const models: Model[] = [
  {
    id: "fbm",
    name: "FBM",
    tag: "Our Specialty",
    summary:
      "Fulfilled by Merchant. Orders from your Amazon store are routed to a supplier, who ships directly to the customer. This is the model we build and automate.",
    color: "#22d3ee",
    variant: "orb",
    steps: [
      { label: "Customer Order", caption: "A customer places an order for a product in your Amazon store.", icon: ShoppingCart, at: 0 },
      { label: "Supplier", caption: "The order is routed to a supplier that holds the inventory.", icon: Warehouse, at: 0.5 },
      { label: "Customer", caption: "The supplier ships the product directly to the customer.", icon: Home, at: 1 },
    ],
    wide: {
      w: 800,
      h: 360,
      d: "M90 270 C200 270 250 90 400 90 C550 90 600 270 710 270",
      points: [
        { x: 90, y: 270 },
        { x: 400, y: 90 },
        { x: 710, y: 270 },
      ],
    },
    tall: {
      w: 360,
      h: 520,
      d: "M90 70 C90 160 270 160 270 260 C270 360 90 360 90 450",
      points: [
        { x: 90, y: 70 },
        { x: 270, y: 260 },
        { x: 90, y: 450 },
      ],
    },
  },
  {
    id: "fba",
    name: "FBA",
    tag: "Amazon Fulfillment",
    summary:
      "Fulfilled by Amazon. You purchase inventory in advance and send it to Amazon, which stores, packs, and ships orders to customers.",
    color: "#fbbf24",
    variant: "batch",
    steps: [
      { label: "Purchased Inventory", caption: "You purchase inventory in advance and send it to Amazon.", icon: Boxes, at: 0 },
      { label: "Amazon Fulfillment Center", caption: "Amazon stores the inventory and handles picking and packing.", icon: Warehouse, at: 0.5 },
      { label: "Customer", caption: "Amazon ships the order to the customer.", icon: Home, at: 1 },
    ],
    wide: {
      w: 800,
      h: 300,
      d: "M90 160 L710 160",
      points: [
        { x: 90, y: 160 },
        { x: 400, y: 160 },
        { x: 710, y: 160 },
      ],
      decor: FBA_RECT(290, 55, 220, 200),
    },
    tall: {
      w: 360,
      h: 520,
      d: "M180 70 L180 450",
      points: [
        { x: 180, y: 70 },
        { x: 180, y: 260 },
        { x: 180, y: 450 },
      ],
      decor: FBA_RECT(80, 170, 200, 180),
    },
  },
  {
    id: "pl",
    name: "Private Label",
    tag: "Your Brand",
    summary:
      "You develop your own brand and product, have it manufactured, and fulfill it to customers under your name.",
    color: "#a78bfa",
    variant: "morph",
    steps: [
      { label: "Brand Development", caption: "You create the brand, product concept, and listing identity.", icon: Lightbulb, at: 0 },
      { label: "Manufacturing", caption: "A manufacturer produces your branded product.", icon: Factory, at: 1 / 3 },
      { label: "Fulfillment", caption: "Finished goods move into your chosen fulfillment channel.", icon: PackageCheck, at: 2 / 3 },
      { label: "Customer", caption: "The customer receives your branded product.", icon: Home, at: 1 },
    ],
    wide: {
      w: 800,
      h: 340,
      d: "M80 250 C186 250 187 100 293 100 C399 100 401 250 507 250 C613 250 614 100 720 100",
      points: [
        { x: 80, y: 250 },
        { x: 293, y: 100 },
        { x: 507, y: 250 },
        { x: 720, y: 100 },
      ],
    },
    tall: {
      w: 360,
      h: 560,
      d: "M90 60 C90 125 270 125 270 190 C270 255 90 255 90 320 C90 385 270 385 270 450",
      points: [
        { x: 90, y: 60 },
        { x: 270, y: 190 },
        { x: 90, y: 320 },
        { x: 270, y: 450 },
      ],
    },
  },
]

export function BusinessModels() {
  const [index, setIndex] = useState(0)
  const [dir, setDir] = useState(1)
  const [paused, setPaused] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const model = models[index]

  const select = (next: number) => {
    setDir(next >= index ? 1 : -1)
    setIndex(next)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    const delta = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0
    if (!delta) return
    e.preventDefault()
    const next = (index + delta + models.length) % models.length
    select(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <section id="how-it-works" className="relative bg-black py-24">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="Three ways to sell on Amazon"
          title="See how each fulfillment model actually moves"
          description="Choose a model to watch its order flow. We specialize in FBM."
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)]">
          <div role="tablist" aria-label="Business models" aria-orientation="vertical" onKeyDown={onKeyDown} className="flex flex-col gap-3">
            {models.map((m, i) => {
              const selected = i === index
              const flagship = m.id === "fbm"
              return (
                <button
                  key={m.id}
                  ref={(el) => {
                    tabRefs.current[i] = el
                  }}
                  role="tab"
                  id={`model-tab-${m.id}`}
                  aria-selected={selected}
                  aria-controls="model-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  className={cn(
                    "group relative overflow-hidden rounded-2xl border text-left outline-none transition-all duration-300 focus-visible:ring-2 focus-visible:ring-white/70",
                    flagship ? "p-6 lg:py-9" : "p-4",
                    selected ? "border-white/30 bg-white/[0.07]" : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]",
                  )}
                  style={selected ? { boxShadow: `0 0 ${flagship ? 60 : 30}px -14px ${m.color}` } : undefined}
                >
                  {selected && (
                    <motion.span
                      layoutId="model-accent"
                      className="absolute inset-y-0 left-0 w-1"
                      style={{ background: m.color }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="flex items-center justify-between gap-3">
                    <span className={cn("font-semibold text-white", flagship ? "text-3xl" : "text-xl")}>{m.name}</span>
                    <span
                      className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                      style={{ borderColor: `${m.color}66`, color: m.color, background: `${m.color}14` }}
                    >
                      {m.tag}
                    </span>
                  </span>
                  <span className={cn("mt-2 block text-sm text-neutral-400", !flagship && !selected && "line-clamp-1")}>
                    {m.id === "fbm"
                      ? "Customer Order → Supplier → Customer"
                      : m.id === "fba"
                        ? "Purchased Inventory → Amazon Fulfillment Center → Customer"
                        : "Brand Development → Manufacturing → Fulfillment → Customer"}
                  </span>
                </button>
              )
            })}
          </div>

          <div
            role="tabpanel"
            id="model-panel"
            aria-labelledby={`model-tab-${model.id}`}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-neutral-950/80 p-5 sm:p-8"
          >
            <motion.div
              aria-hidden
              key={model.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: model.id === "fbm" ? 0.35 : 0.16, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              style={{ background: `radial-gradient(circle, ${model.color}, transparent 65%)` }}
            />
            <div className="relative">
              <div className="mb-6 flex items-start justify-between gap-4">
                <p className="max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base">{model.summary}</p>
                <button
                  type="button"
                  onClick={() => setPaused((v) => !v)}
                  aria-pressed={paused}
                  aria-label={paused ? "Play demonstration" : "Pause demonstration"}
                  className="shrink-0 rounded-full border border-white/15 p-2 text-neutral-300 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                >
                  {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                </button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, x: 60 * dir, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -60 * dir, filter: "blur(6px)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 30 }}
                >
                  <FlowDiagram
                    steps={model.steps}
                    wide={model.wide}
                    tall={model.tall}
                    color={model.color}
                    variant={model.variant}
                    duration={model.id === "fbm" ? 6 : 7.5}
                    paused={paused}
                    dominant={model.id === "fbm"}
                  />
                </motion.div>
              </AnimatePresence>
              <p className="mt-4 text-xs text-neutral-500">Illustrative diagram of the order flow. Not a live system.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
