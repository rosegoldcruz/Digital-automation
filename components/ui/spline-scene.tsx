"use client"

import { Suspense, lazy, useCallback, useEffect, useRef } from "react"
import type { Application } from "@splinetool/runtime"

const Spline = lazy(() => import("@splinetool/react-spline"))

interface SplineSceneProps {
  scene: string
  className?: string
}

function Placeholder() {
  return (
    <div aria-hidden className="flex h-full w-full items-center justify-center">
      <div className="h-1/2 w-1/2 animate-pulse rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.18),transparent_70%)]" />
    </div>
  )
}

// The scene keeps its own cursor tracking. The render loop is only paused while the robot is offscreen or the tab is hidden.
export function SplineScene({ scene, className }: SplineSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)
  const visibleRef = useRef(true)

  const sync = useCallback(() => {
    const app = appRef.current
    if (!app) return
    if (visibleRef.current && !document.hidden) app.play()
    else app.stop()
  }, [])

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      sync()
    })
    io.observe(el)
    document.addEventListener("visibilitychange", sync)
    return () => {
      io.disconnect()
      document.removeEventListener("visibilitychange", sync)
    }
  }, [sync])

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Suspense fallback={<Placeholder />}>
        <Spline
          scene={scene}
          className={className}
          onLoad={(app) => {
            appRef.current = app
            sync()
          }}
        />
      </Suspense>
    </div>
  )
}
