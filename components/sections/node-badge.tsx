"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NodeBadgeProps {
  icon: LucideIcon
  label: string
  sublabel?: string
  color: string
  state: "idle" | "active" | "done"
  size?: number
  dimmed?: boolean
}

// Circular icon node used by the SVG-based fulfillment diagrams. `color` is a hex value so it can drive glow styles.
export function NodeBadge({ icon: Icon, label, sublabel, color, state, size = 56, dimmed }: NodeBadgeProps) {
  const lit = state !== "idle"
  return (
    <span className={cn("flex flex-col items-center gap-2 transition-opacity duration-300", dimmed && "opacity-45")}>
      <span
        className="relative flex items-center justify-center rounded-full border bg-neutral-950 transition-[box-shadow,border-color,transform] duration-300"
        style={{
          width: `${size / 16}rem`,
          height: `${size / 16}rem`,
          borderColor: lit ? color : "rgba(255,255,255,0.14)",
          boxShadow: state === "active" ? `0 0 28px -2px ${color}` : lit ? `0 0 12px -4px ${color}` : "none",
          transform: state === "active" ? "scale(1.12)" : "scale(1)",
        }}
      >
        {state === "active" && (
          <span className="da-pulse-ring absolute inset-0 rounded-full border" style={{ borderColor: color }} />
        )}
        <Icon
          className="transition-colors duration-300"
          style={{ color: lit ? color : "rgba(255,255,255,0.5)", width: `${(size * 0.42) / 16}rem`, height: `${(size * 0.42) / 16}rem` }}
        />
      </span>
      <span className="flex max-w-[8.5rem] flex-col items-center rounded-md bg-black/70 px-1.5 text-center backdrop-blur-sm">
        <span className={cn("text-xs font-medium leading-tight sm:text-sm", lit ? "text-white" : "text-neutral-400")}>
          {label}
        </span>
        {sublabel && <span className="mt-0.5 text-[0.625rem] leading-tight text-neutral-500">{sublabel}</span>}
      </span>
    </span>
  )
}
