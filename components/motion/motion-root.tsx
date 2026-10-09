"use client"

import type { ReactNode } from "react"
import { MotionConfig } from "framer-motion"

// Makes every framer-motion transform animation respect prefers-reduced-motion.
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
