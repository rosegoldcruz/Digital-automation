"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { motion, useInView, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { useLoopProgress } from "@/hooks/use-loop-progress"
import { useMediaQuery } from "@/hooks/use-media-query"
import { pointAlong } from "@/lib/svg-path"
import { NodeBadge } from "./node-badge"

export interface FlowStep {
  label: string
  caption: string
  icon: LucideIcon
  // Fraction (0..1) of the route at which this step becomes active.
  at: number
}

export interface FlowLayout {
  w: number
  h: number
  d: string
  points: { x: number; y: number }[]
  decor?: ReactNode
}

type Variant = "orb" | "batch" | "morph"

interface FlowDiagramProps {
  steps: FlowStep[]
  wide: FlowLayout
  tall: FlowLayout
  color: string
  variant: Variant
  duration?: number
  paused?: boolean
  dominant?: boolean
}

// The route is travelled during the first 85% of each loop; the rest is a hold so the final step reads clearly.
const TRAVEL = 0.85
const TRAIL = 4

const MORPH_SHAPES = [
  "M0 -11 L3 -3 L11 0 L3 3 L0 11 L-3 3 L-11 0 L-3 -3 Z",
  "M-4 -9 L4 -9 L9 -4 L9 4 L4 9 L-4 9 L-9 4 L-9 -4 Z",
  "M-10 -8 L10 -8 L10 8 L-10 8 Z",
  "M-10 -8 L10 -8 L10 8 L-10 8 Z",
]

export function FlowDiagram({ steps, wide, tall, color, variant, duration = 7, paused, dominant }: FlowDiagramProps) {
  const isWide = useMediaQuery("(min-width: 640px)")
  const layout = isWide ? wide : tall
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const headRef = useRef<SVGGElement>(null)
  const extrasRef = useRef<SVGGElement>(null)
  const morphRef = useRef<SVGPathElement>(null)
  const trailRefs = useRef<(SVGCircleElement | null)[]>([])
  const stepRef = useRef(0)

  const reduce = useReducedMotion()
  const inView = useInView(containerRef, { margin: "-10% 0px" })
  const progress = useLoopProgress(duration, inView && !paused && !reduce)
  const drawn = useTransform(progress, (p) => Math.min(p / TRAVEL, 1))

  const [active, setActive] = useState(0)
  const [hover, setHover] = useState<number | null>(null)

  const update = useCallback(
    (p: number) => {
      const path = pathRef.current
      if (!path) return
      const f = Math.min(p / TRAVEL, 1)

      const head = pointAlong([path], f)
      if (head && headRef.current) {
        headRef.current.setAttribute("transform", `translate(${head.x} ${head.y})`)
        headRef.current.setAttribute("opacity", p > 0.93 ? "0" : "1")
      }
      trailRefs.current.forEach((el, k) => {
        if (!el) return
        const tf = f - (k + 1) * 0.02
        const pt = tf > 0 ? pointAlong([path], tf) : null
        if (!pt || p > 0.93) return el.setAttribute("opacity", "0")
        el.setAttribute("cx", String(pt.x))
        el.setAttribute("cy", String(pt.y))
        el.setAttribute("opacity", String(0.55 - k * 0.12))
      })

      let s = 0
      steps.forEach((step, i) => {
        if (f >= step.at - 0.015) s = i
      })
      if (s !== stepRef.current) {
        stepRef.current = s
        setActive(s)
      }
      extrasRef.current?.setAttribute("opacity", s >= 1 ? "0" : "1")
      morphRef.current?.setAttribute("d", MORPH_SHAPES[Math.min(s, MORPH_SHAPES.length - 1)])
    },
    [steps],
  )

  useMotionValueEvent(progress, "change", update)

  useEffect(() => {
    if (reduce) progress.set(0.95)
    update(progress.get())
  }, [layout, reduce, progress, update])

  const shown = hover ?? active
  const strokeWidth = dominant ? 4 : 3

  return (
    <div>
      <div ref={containerRef} className="relative w-full" style={{ aspectRatio: `${layout.w} / ${layout.h}` }}>
        <svg
          key={isWide ? "wide" : "tall"}
          viewBox={`0 0 ${layout.w} ${layout.h}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          {layout.decor}
          <path
            ref={pathRef}
            d={layout.d}
            fill="none"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={2}
            strokeDasharray="3 9"
            strokeLinecap="round"
          />
          <motion.path
            d={layout.d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ pathLength: drawn, filter: `drop-shadow(0 0 ${dominant ? 8 : 5}px ${color})` }}
          />
          {Array.from({ length: TRAIL }, (_, k) => (
            <circle
              key={k}
              ref={(el) => {
                trailRefs.current[k] = el
              }}
              r={Math.max(2, (dominant ? 6 : 5) - k)}
              fill={color}
              opacity={0}
            />
          ))}
          <g ref={headRef}>
            {variant === "orb" && (
              <>
                <circle r={dominant ? 20 : 15} fill={color} opacity={0.2} />
                <circle r={dominant ? 8 : 6} fill="#fff" />
                <circle r={dominant ? 5 : 4} fill={color} />
              </>
            )}
            {variant === "batch" && (
              <>
                <rect x={-5} y={-5} width={11} height={11} rx={2} fill={color} stroke="#fff" strokeWidth={1} />
                <g ref={extrasRef}>
                  <rect x={-14} y={-9} width={11} height={11} rx={2} fill={color} stroke="#fff" strokeWidth={1} />
                  <rect x={4} y={-12} width={11} height={11} rx={2} fill={color} stroke="#fff" strokeWidth={1} />
                </g>
              </>
            )}
            {variant === "morph" && (
              <>
                <circle r={18} fill={color} opacity={0.18} />
                <path ref={morphRef} d={MORPH_SHAPES[0]} fill={color} stroke="#fff" strokeWidth={1.2} strokeLinejoin="round" />
              </>
            )}
          </g>
        </svg>

        {steps.map((step, i) => {
          const pt = layout.points[i]
          return (
            <button
              key={step.label}
              type="button"
              onPointerEnter={() => setHover(i)}
              onPointerLeave={() => setHover(null)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(null)}
              aria-label={`${step.label}: ${step.caption}`}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl outline-none transition-transform duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-white/70"
              style={{ left: `${(pt.x / layout.w) * 100}%`, top: `${(pt.y / layout.h) * 100}%` }}
            >
              <NodeBadge
                icon={step.icon}
                label={step.label}
                color={color}
                size={dominant ? 64 : 52}
                state={i === active ? "active" : i < active ? "done" : "idle"}
              />
            </button>
          )
        })}
      </div>

      <div className="mt-6 flex min-h-[3.5rem] items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <span className="mt-0.5 font-mono text-xs" style={{ color }}>
          {String(shown + 1).padStart(2, "0")}/{String(steps.length).padStart(2, "0")}
        </span>
        <p className="text-sm text-neutral-300">
          <span className="font-medium text-white">{steps[shown].label}.</span> {steps[shown].caption}
        </p>
      </div>
    </div>
  )
}
