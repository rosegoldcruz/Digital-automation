"use client"

import { useRef, useState } from "react"
import { AnimatePresence, motion, useMotionTemplate, useReducedMotion, useSpring, useMotionValue, type Variants } from "framer-motion"
import { Check, ChevronDown, Info, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { SELECT_PACKAGE_EVENT, WORKING_CAPITAL_NOTE, formatUsd, packages, type BusinessPackage } from "@/lib/packages"
import { SectionHeading } from "./section-heading"

const cardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i === 0 ? -70 : i === 1 ? 0 : 70,
    y: i === 1 ? 50 : 0,
    rotateY: i === 0 ? 24 : i === 2 ? -24 : 0,
    scale: i === 2 ? 0.88 : 0.95,
  }),
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotateY: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 18, delay: i === 2 ? 0.45 : i * 0.12 },
  }),
}

function PackageCard({ pkg, index }: { pkg: BusinessPackage; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(!!pkg.flagship)
  const flagship = !!pkg.flagship
  const maxTilt = flagship ? 7 : 5

  const tx = useMotionValue(0)
  const ty = useMotionValue(0)
  const rotateY = useSpring(tx, { stiffness: 150, damping: 18 })
  const rotateX = useSpring(ty, { stiffness: 150, damping: 18 })
  const mx = useMotionValue(50)
  const my = useMotionValue(50)
  const light = useMotionValue(0)
  const lightSpring = useSpring(light, { stiffness: 120, damping: 20 })

  const border = useMotionTemplate`radial-gradient(260px circle at ${mx}% ${my}%, rgba(103,232,249,${flagship ? 1 : 0.9}), rgba(255,255,255,0.08) 60%)`
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mx}% ${my}%, rgba(103,232,249,0.14), transparent 70%)`

  const onPointerMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width
    const ny = (e.clientY - rect.top) / rect.height
    tx.set((nx - 0.5) * 2 * maxTilt)
    ty.set((0.5 - ny) * 2 * maxTilt)
    mx.set(nx * 100)
    my.set(ny * 100)
    light.set(1)
  }

  const onPointerLeave = () => {
    tx.set(0)
    ty.set(0)
    light.set(0)
  }

  const choose = () => {
    window.dispatchEvent(new CustomEvent(SELECT_PACKAGE_EVENT, { detail: pkg.id }))
  }

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className={cn("relative", flagship && "lg:-my-6 lg:z-10")}
      style={{ perspective: 1100 }}
    >
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative rounded-3xl p-px"
      >
        {/* Cursor-following border illumination */}
        <motion.div aria-hidden className="absolute inset-0 rounded-3xl opacity-80" style={{ background: border }} />
        {flagship && (
          <div aria-hidden className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="da-border-spin absolute -inset-[1px] opacity-90" />
          </div>
        )}
        <div
          className={cn(
            "relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-neutral-950 p-6 sm:p-8",
            flagship && "bg-gradient-to-b from-neutral-900 to-neutral-950",
          )}
        >
          <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: spotlight, opacity: lightSpring }} />
          {flagship && (
            <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-2.5 py-0.5 text-[11px] font-medium text-cyan-200">
              <Star className="h-3 w-3 fill-current" /> Flagship
            </span>
          )}
          <div style={{ transform: "translateZ(30px)" }} className="relative">
            <h3 className={cn("font-medium text-neutral-300", flagship ? "pr-24 text-lg" : "text-base")}>{pkg.name}</h3>
            <p
              className={cn(
                "mt-4 font-semibold tracking-tight",
                flagship
                  ? "bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-6xl text-transparent"
                  : "text-5xl text-white",
              )}
            >
              {formatUsd(pkg.price)}
            </p>
            <p className="mt-1 text-xs text-neutral-500">One-time package price</p>
            <p className="mt-0.5 text-xs text-neutral-500">+ $5,000–$10,000 working capital, separate</p>
            <p className="mt-5 text-sm text-neutral-300">{pkg.description}</p>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={`pkg-details-${pkg.id}`}
              className="mt-5 flex w-full items-center justify-between rounded-lg border border-white/10 px-3 py-2 text-sm text-neutral-200 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-white"
            >
              What’s included
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`pkg-details-${pkg.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 30 }}
                  className="overflow-hidden"
                >
                  <ul className="space-y-2.5 pb-1 pt-4">
                    {pkg.features.map((f, i) => (
                      <motion.li
                        key={f}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i, duration: 0.3 }}
                        className="flex items-start gap-2.5 text-sm text-neutral-200"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
                        {f}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.a
              href="#consultation"
              onClick={choose}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96, y: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 22 }}
              className={cn(
                "mt-7 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                flagship
                  ? "bg-gradient-to-r from-cyan-300 to-sky-500 text-black shadow-[0_8px_30px_-8px_rgba(34,211,238,0.8),inset_0_-3px_0_rgba(0,0,0,0.18)]"
                  : "border border-white/20 bg-white/5 text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.35)] hover:bg-white/10",
              )}
            >
              {pkg.cta}
            </motion.a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Packages() {
  return (
    <section id="packages" className="relative overflow-hidden bg-black py-28">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.1),transparent_65%)]" />
      <div className="container relative mx-auto px-4">
        <SectionHeading
          eyebrow="Packages"
          title="Choose your Amazon business package"
          description="One-time package pricing. Choose the level of support your Amazon FBM business needs."
        />

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid max-w-6xl items-stretch gap-6 lg:grid-cols-3 lg:gap-8"
        >
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </motion.div>

        <div className="mx-auto mt-16 flex max-w-3xl items-start gap-4 rounded-2xl border border-amber-300/25 bg-amber-300/[0.06] p-5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div>
            <p className="font-medium text-white">Working capital is separate from the package price</p>
            <p className="mt-1 text-sm text-neutral-300">{WORKING_CAPITAL_NOTE}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
