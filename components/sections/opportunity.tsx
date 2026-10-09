"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"

const HEADLINE = "Own the Business. Let Technology Handle More of the Complexity."

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <span className="relative mr-[0.25em] inline-block">
      <span className="absolute opacity-15">{children}</span>
      <motion.span style={{ opacity }}>{children}</motion.span>
    </span>
  )
}

// Headline words light up one by one as the section scrolls through the viewport.
export function Opportunity() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "start 25%"] })
  const words = HEADLINE.split(" ")

  return (
    <section id="opportunity" className="bg-black py-32">
      <div ref={ref} className="container mx-auto max-w-5xl px-4 text-center">
        <h2 className="text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-6xl" aria-label={HEADLINE}>
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, Math.min((i + 2) / words.length, 1)]}>
              {w}
            </Word>
          ))}
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9 }}
          className="mx-auto mt-12 max-w-3xl space-y-5"
        >
          <p className="text-xl text-neutral-300">Starting an Amazon business involves more than opening a seller account.</p>
          <p className="text-neutral-400">
            You need products, suppliers, competitive pricing, fulfillment processes, product listings, and systems to monitor
            performance. That&apos;s where Digital Automation comes in.
          </p>
          <p className="font-medium text-white">Our goal is to simplify the technical process of building and managing your business.</p>
        </motion.div>
      </div>
    </section>
  )
}
