"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  eyebrow: string
  title: string
  description?: string
  className?: string
}

// Title is revealed through a rising mask rather than a generic fade.
export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("mx-auto mb-14 max-w-3xl text-center", className)}>
      <motion.p
        initial={{ letterSpacing: "0.5em", opacity: 0 }}
        whileInView={{ letterSpacing: "0.22em", opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="mb-4 font-mono text-xs uppercase text-cyan-300"
      >
        {eyebrow}
      </motion.p>
      <h2 className="-mb-[0.1em] overflow-hidden pb-[0.1em] text-3xl font-semibold tracking-tight text-white md:text-5xl">
        <motion.span
          initial={{ y: "110%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="block text-balance"
        >
          {title}
        </motion.span>
      </h2>
      {description && <p className="mx-auto mt-5 max-w-2xl text-base text-neutral-400 md:text-lg">{description}</p>}
    </div>
  )
}
