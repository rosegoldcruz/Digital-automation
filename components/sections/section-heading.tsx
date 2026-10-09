"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

const word = {
  hidden: { y: "115%", rotate: 4, opacity: 0 },
  show: { y: 0, rotate: 0, opacity: 1 },
}

// Each word rises through its own mask in sequence. The viewport trigger sits on the unclipped parent so it always fires.
export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.07 }}
      className={cn("mx-auto mb-14 max-w-3xl text-center", className)}
    >
      <motion.p
        variants={{
          hidden: { letterSpacing: "0.55em", opacity: 0 },
          show: { letterSpacing: "0.22em", opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } },
        }}
        className="mb-4 font-mono text-xs uppercase text-cyan-300"
      >
        {eyebrow}
      </motion.p>
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
        {title.split(" ").map((w, i) => (
          <span key={i} className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              variants={word}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block origin-left"
            >
              {w}
              {i < title.split(" ").length - 1 ? "\u00A0" : ""}
            </motion.span>
          </span>
        ))}
      </h2>
      {description && (
        <motion.p
          variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.3 } } }}
          className="mx-auto mt-5 max-w-2xl text-base text-neutral-400 md:text-lg"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  )
}
