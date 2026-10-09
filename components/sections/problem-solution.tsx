"use client"

import { motion, type Variants } from "framer-motion"
import { CheckCircle, X } from "lucide-react"

const PROBLEMS = [
  "Spending hours searching for products, suppliers, and orders",
  "Missing sales opportunities without consistent product monitoring",
  "Struggling to scale fulfillment without reliable workflows",
  "Losing time and margin to manual product decisions",
]

const SOLUTIONS = [
  "Supplier connections and product listings built for your store",
  "Automation for product monitoring, rotation, and fulfillment",
  "A practical Amazon FBM operation built around your goals",
  "Training and operational support to help you run confidently",
]

const list: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.14 } } }
const item: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 18 } },
}

export function ProblemSolution() {
  return (
    <section className="relative overflow-hidden bg-black py-28">
      <div aria-hidden className="pointer-events-none absolute left-0 top-1/2 h-[31.25rem] w-[31.25rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(244,63,94,0.08),transparent_65%)]" />
      <div aria-hidden className="pointer-events-none absolute right-0 top-1/2 h-[31.25rem] w-[31.25rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.1),transparent_65%)]" />
      <div className="container relative mx-auto grid gap-8 px-4 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={list}
          className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 sm:p-10"
        >
          <motion.h2 variants={item} className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            Ready to Build a Smarter Amazon Operation?
          </motion.h2>
          <ul className="mt-8 space-y-5">
            {PROBLEMS.map((p) => (
              <motion.li key={p} variants={item} className="flex items-start gap-3 text-neutral-400">
                <X className="mt-1 h-5 w-5 shrink-0 text-rose-400" />
                <span className="relative">
                  {p}
                  <motion.span
                    aria-hidden
                    variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, delay: 0.6 } } }}
                    className="absolute left-0 top-1/2 h-px w-full origin-left bg-rose-400/60"
                  />
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={list}
          className="relative rounded-3xl border border-cyan-300/25 bg-gradient-to-b from-cyan-300/[0.06] to-transparent p-8 shadow-[0_0_80px_-30px_rgba(34,211,238,0.5)] sm:p-10"
        >
          <motion.h3 variants={item} className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
            We Build Amazon Systems That Work
          </motion.h3>
          <ul className="mt-8 space-y-5">
            {SOLUTIONS.map((s) => (
              <motion.li key={s} variants={item} className="flex items-start gap-3 text-neutral-200">
                <CheckCircle className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
                {s}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
