"use client"

import { useEffect } from "react"
import { animate, useMotionValue, type AnimationPlaybackControls, type MotionValue } from "framer-motion"

// Looping 0 -> 1 progress. Only runs while `running` is true so offscreen or paused demos cost nothing.
export function useLoopProgress(duration: number, running: boolean): MotionValue<number> {
  const progress = useMotionValue(0)

  useEffect(() => {
    if (!running) return
    let cancelled = false
    let current: AnimationPlaybackControls | undefined

    const run = (from: number) => {
      current = animate(progress, [from, 1], {
        duration: duration * (1 - from),
        ease: "linear",
        onComplete: () => {
          if (!cancelled) run(0)
        },
      })
    }

    const start = progress.get()
    run(start >= 0.999 ? 0 : start)

    return () => {
      cancelled = true
      current?.stop()
    }
  }, [duration, running, progress])

  return progress
}
