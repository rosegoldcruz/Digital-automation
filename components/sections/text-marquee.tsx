"use client"

import { useRef } from "react"
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion"

const ITEMS = [
  "Storefront development",
  "Qualified dropshipping suppliers",
  "Intelligent product management",
  "Streamlined fulfillment systems",
]

const wrap = (min: number, max: number, v: number) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// Decorative text band: drifts constantly, accelerates and skews with scroll velocity, and reverses when scrolling up.
export function TextMarquee() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref)
  const baseX = useMotionValue(0)
  const direction = useRef(1)

  const { scrollY } = useScroll()
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const boost = useTransform(velocity, [-1500, 0, 1500], [-6, 0, 6], { clamp: false })
  const skewX = useTransform(velocity, [-1500, 0, 1500], [8, 0, -8], { clamp: true })
  const x = useTransform(baseX, (v) => `${v}%`)

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return
    const b = boost.get()
    if (b < -0.2) direction.current = -1
    else if (b > 0.2) direction.current = 1
    const move = direction.current * (1.2 + Math.abs(b)) * (delta / 1000)
    baseX.set(wrap(-50, 0, baseX.get() - move))
  })

  const group = (
    <div className="flex shrink-0 items-center">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span key={i} className="flex items-center">
          <span
            className={
              i % 2 === 0
                ? "text-4xl font-semibold tracking-tight text-white md:text-6xl"
                : "text-4xl font-semibold tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)] md:text-6xl"
            }
          >
            {item}
          </span>
          <span className="mx-8 text-2xl text-cyan-300 md:mx-12">✦</span>
        </span>
      ))}
    </div>
  )

  return (
    <div ref={ref} aria-hidden className="relative overflow-hidden border-y border-white/10 bg-black py-8">
      <motion.div style={{ x, skewX }} className="flex w-max whitespace-nowrap will-change-transform">
        {group}
        {group}
      </motion.div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent" />
    </div>
  )
}
