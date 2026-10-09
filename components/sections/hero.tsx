"use client"

import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import { SplineScene } from "@/components/ui/spline-scene"
import { Magnetic } from "@/components/motion/magnetic"

const HEADLINE = ["Your Amazon Business.", "Built Smarter.", "Powered by Automation."]

// Deterministic so server and client markup match.
const PARTICLES = Array.from({ length: 26 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453
    return v - Math.floor(v)
  }
  return {
    left: `${Math.round(r(1) * 100)}%`,
    top: `${Math.round(30 + r(2) * 70)}%`,
    size: 1 + Math.round(r(3) * 2),
    dur: Math.round((10 + r(4) * 10) * 10) / 10,
    delay: -Math.round(r(5) * 14 * 10) / 10,
    dx: Math.round((r(6) - 0.5) * 80),
    o: Math.round((0.25 + r(7) * 0.5) * 100) / 100,
    mobile: i < 12,
  }
})

function DirectionalLink({ href, children }: { href: string; children: React.ReactNode }) {
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

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, { stiffness: 70, damping: 18, mass: 0.8 })
  const py = useSpring(rawY, { stiffness: 70, damping: 18, mass: 0.8 })

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] })
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 140])
  const robotY = useTransform(scrollYProgress, [0, 1], [0, -90])
  const robotScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  const textY = useTransform(scrollYProgress, [0, 1], [0, -50])
  const textOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15])

  const gridX = useTransform(px, (v) => v * -8)
  const haloX = useTransform(px, (v) => v * 18)
  const haloY = useTransform(py, (v) => v * 14)
  const robotX = useTransform(px, (v) => v * 10)
  const glowX = useTransform(px, (v) => 50 + v * 40)
  const glowY = useTransform(py, (v) => 50 + v * 40)
  const glow = useMotionTemplate`radial-gradient(520px circle at ${glowX}% ${glowY}%, rgba(34,211,238,0.16), rgba(99,102,241,0.07) 45%, transparent 70%)`

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    rawX.set(((e.clientX - rect.left) / rect.width) * 2 - 1)
    rawY.set(((e.clientY - rect.top) / rect.height) * 2 - 1)
  }

  const onPointerLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <section
      ref={sectionRef}
      id="top"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className="relative isolate overflow-hidden bg-black"
    >
      {/* Depth layer 1: perspective grid */}
      <motion.div
        aria-hidden
        style={{ y: gridY, x: gridX }}
        className="pointer-events-none absolute -inset-x-10 -top-10 bottom-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_60%_40%,black,transparent_70%)]"
      />
      {/* Depth layer 2: cursor-responsive lighting */}
      <motion.div aria-hidden style={{ background: glow }} className="pointer-events-none absolute inset-0 -z-10" />
      {/* Depth layer 3: atmospheric particles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className={`da-drift absolute rounded-full bg-cyan-200 ${p.mobile ? "" : "hidden md:block"}`}
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                "--da-dur": `${p.dur}s`,
                "--da-delay": `${p.delay}s`,
                "--da-dx": `${p.dx}px`,
                "--da-o": p.o,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      <div className="container mx-auto grid min-h-screen items-center gap-4 px-4 pb-16 pt-28 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-3 py-1 text-xs tracking-wide text-cyan-200"
          >
            <span className="relative flex h-2 w-2">
              <span className="da-pulse-ring absolute inline-flex h-full w-full rounded-full bg-cyan-300" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
            </span>
            Digital Automation LLC
          </motion.div>

          <h1 className="text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl xl:text-7xl">
            {HEADLINE.map((line, i) => (
              <span key={line} className="-mb-[0.12em] block overflow-hidden pb-[0.12em]">
                <motion.span
                  initial={{ y: "115%", rotate: 3 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                  className={`block origin-left ${
                    i === 2 ? "da-pan bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400 bg-clip-text text-transparent" : ""
                  }`}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-neutral-300 sm:text-lg"
          >
            Build your Amazon e-commerce business with professional storefront development, qualified dropshipping suppliers,
            intelligent product management, and streamlined fulfillment systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.85 }}
            className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <Magnetic strength={0.28}>
              <a
                href="#consultation"
                className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-300 to-sky-500 px-7 text-sm font-semibold text-black shadow-[0_0_40px_-6px_rgba(34,211,238,0.7)] transition-[transform,box-shadow] duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span
                  aria-hidden
                  className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/50 opacity-0 blur-md transition-all duration-700 group-hover:left-full group-hover:opacity-100"
                />
                <span className="relative">Build Your Amazon Business</span>
                <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <DirectionalLink href="#how-it-works">Explore How It Works</DirectionalLink>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-neutral-400"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Transparent package pricing
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              Clear package scope
            </span>
          </motion.div>
        </motion.div>

        {/* The robot: untouched Spline scene. Everything layered over it is pointer-events-none so its own cursor tracking keeps working. */}
        <div className="relative h-[420px] sm:h-[500px] lg:h-[560px]">
          <motion.div
            aria-hidden
            style={{ x: haloX, y: haloY }}
            className="pointer-events-none absolute inset-6 rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.22),rgba(99,102,241,0.1)_45%,transparent_70%)] blur-2xl"
          />
          <motion.div style={{ x: robotX, y: robotY, scale: robotScale }} className="absolute inset-0">
            <div className="da-float h-full w-full">
              <SplineScene
                scene="https://prod.spline.design/UbM7F-HZcyTbZ4y3/scene.splinecode"
                className="h-full w-full"
              />
            </div>
          </motion.div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent"
          />
        </div>
      </div>
    </section>
  )
}
