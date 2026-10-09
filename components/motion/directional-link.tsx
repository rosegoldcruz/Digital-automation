"use client"

import { useRef } from "react"

// Secondary CTA whose white fill sweeps in from whichever side the cursor entered.
export function DirectionalLink({ href, children }: { href: string; children: React.ReactNode }) {
  const fillRef = useRef<HTMLSpanElement>(null)

  const setOrigin = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    if (fillRef.current) fillRef.current.style.transformOrigin = e.clientX - rect.left < rect.width / 2 ? "left" : "right"
  }

  return (
    <a
      href={href}
      onPointerEnter={setOrigin}
      onPointerLeave={setOrigin}
      className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border border-white/20 px-7 text-sm font-medium text-neutral-200 transition-colors duration-300 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
    >
      <span
        ref={fillRef}
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <span className="relative">{children}</span>
    </a>
  )
}
