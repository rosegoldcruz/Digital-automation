"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Magnetic } from "@/components/motion/magnetic"
import { DirectionalLink } from "@/components/motion/directional-link"
import { SectionHeading } from "./section-heading"

const EXPLORE = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Supplier Network", href: "#supplier-network" },
  { label: "AI Product Intelligence", href: "#product-intelligence" },
  { label: "Packages", href: "#packages" },
  { label: "Process", href: "#process" },
]

const PACKAGES = [
  { label: "Starter", href: "#packages" },
  { label: "Growth", href: "#packages" },
  { label: "Complete Automation", href: "#packages" },
]

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 text-neutral-400 transition-colors duration-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
    >
      <ArrowRight className="-ml-5 h-3.5 w-3.5 text-cyan-300 opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100" />
      {children}
    </a>
  )
}

const column = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
}

// Closing call to action and footer, on the same grid-and-glow backdrop as the hero.
export function Closing() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] })
  const gridY = useTransform(scrollYProgress, [0, 1], [-60, 40])

  return (
    <div ref={ref} className="relative isolate overflow-hidden border-t border-white/10 bg-black">
      <motion.div
        aria-hidden
        style={{ y: gridY }}
        className="pointer-events-none absolute -inset-x-10 -top-20 bottom-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_50%_30%,black,transparent_75%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[18%] -z-10 h-[34rem] w-[56rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(34,211,238,0.16),rgba(99,102,241,0.07)_45%,transparent_70%)]"
      />

      <div className="container mx-auto px-4 pb-8 pt-28 text-center">
        <SectionHeading eyebrow="Next step" title="Ready to Build Your Amazon Business?" className="mb-10" />
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Magnetic strength={0.28}>
            <a
              href="#packages"
              className="group relative inline-flex h-12 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-300 to-sky-500 px-7 text-sm font-semibold text-black shadow-[0_0_40px_-6px_rgba(34,211,238,0.7)] transition-[transform,box-shadow] duration-200 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/50 opacity-0 blur-md transition-all duration-700 group-hover:left-full group-hover:opacity-100"
              />
              <span className="relative">Discuss Your Amazon Package</span>
              <ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <DirectionalLink href="#consultation">Schedule a Consultation</DirectionalLink>
          </Magnetic>
        </div>
      </div>

      <footer id="contact" className="relative mt-20">
        <div className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent" />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.1 }}
          className="container mx-auto grid gap-12 px-4 pb-6 pt-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]"
        >
          <motion.div variants={column} className="space-y-5">
            <p className="text-2xl font-semibold tracking-tight text-white">Digital Automation LLC</p>
            <p className="max-w-xs leading-relaxed text-neutral-400">
              Building Amazon FBM businesses with supplier connections, automation, product monitoring, and operational support.
            </p>
          </motion.div>

          <motion.nav variants={column} aria-label="Explore" className="space-y-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">Explore</h2>
            <ul className="space-y-3">
              {EXPLORE.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav variants={column} aria-label="Packages" className="space-y-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">Packages</h2>
            <ul className="space-y-3">
              {PACKAGES.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div variants={column} className="space-y-5">
            <h2 className="font-mono text-xs uppercase tracking-[0.22em] text-cyan-300">Get in Touch</h2>
            <p className="leading-relaxed text-neutral-400">
              Consultations are available by appointment. No business address, phone number, or email is published here.
            </p>
            <a
              href="#consultation"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-cyan-300/40 bg-cyan-300/10 px-5 text-sm font-medium text-cyan-100 transition-colors hover:bg-cyan-300/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Book a Consultation <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </motion.div>

        <div aria-hidden className="pointer-events-none select-none overflow-hidden px-4 text-center leading-none">
          <span className="block whitespace-nowrap bg-gradient-to-b from-white/20 to-transparent bg-clip-text text-[8.4vw] font-semibold uppercase tracking-tighter text-transparent">
            Digital Automation
          </span>
        </div>

        <div className="container mx-auto flex flex-col items-center justify-between gap-4 border-t border-white/10 px-4 py-8 text-sm text-neutral-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Digital Automation LLC. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="/privacy" className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300">
              Privacy Policy
            </a>
            <a href="/terms" className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
