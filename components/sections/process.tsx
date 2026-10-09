"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { SectionHeading } from "./section-heading"

const STEPS = [
  {
    title: "Book a Call",
    body: "Schedule a free consultation to discuss your business needs and identify automation opportunities",
  },
  {
    title: "Choose Your Package",
    body: "Select the Starter, Growth, or Complete Automation package based on your goals and level of support",
  },
  {
    title: "Implementation",
    body: "We build your store systems, connect suppliers, organize products, and set up your operational workflows",
  },
]

export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="process" className="bg-black py-28">
      <div className="container mx-auto px-4">
        <SectionHeading
          eyebrow="The path"
          title="A clear path to your Amazon business"
          description="From the first conversation to launch, we build the systems your Amazon operation needs"
        />

        <div ref={ref} className="relative mx-auto grid max-w-5xl gap-12 md:grid-cols-3 md:gap-8">
          <div aria-hidden className="absolute left-[16.6%] right-[16.6%] top-10 hidden h-px bg-white/10 md:block">
            <motion.div style={{ scaleX: line }} className="h-full origin-left bg-gradient-to-r from-cyan-300 to-violet-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
          </div>
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 90, damping: 18, delay: i * 0.12 }}
              className="relative text-center"
            >
              <motion.div
                whileHover={{ scale: 1.08, rotate: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/40 bg-black text-2xl font-semibold text-white shadow-[0_0_40px_-8px_rgba(34,211,238,0.6)]"
              >
                {i + 1}
              </motion.div>
              <h3 className="mt-6 text-xl font-semibold text-white">{s.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-neutral-400">{s.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
