"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { AlertTriangle, ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, Loader2 } from "lucide-react"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { SELECT_PACKAGE_EVENT, WORKING_CAPITAL_NOTE, formatUsd, packages } from "@/lib/packages"
import { SectionHeading } from "./section-heading"

interface FormState {
  goals: string[]
  experience: string
  package: string
  comfort: string
  capital: string
  employment: string
  timeline: string
  name: string
  email: string
  phone: string
  consent: boolean
}

const INITIAL: FormState = {
  goals: [],
  experience: "",
  package: "",
  comfort: "",
  capital: "",
  employment: "",
  timeline: "",
  name: "",
  email: "",
  phone: "",
  consent: false,
}

const GOALS = [
  "Launch a new Amazon store",
  "Automate fulfillment and orders",
  "Add AI-assisted product monitoring",
  "Scale an existing Amazon business",
  "Build a dropshipping supplier network",
]
const EXPERIENCE = ["New to e-commerce", "Some online selling experience", "Experienced Amazon seller"]
const COMFORT = ["Up to $10,000", "Up to $15,000", "Up to $25,000", "I’d like to discuss it"]
const CAPITAL = ["Under $5,000", "$5,000–$10,000", "More than $10,000", "Not sure yet"]
const EMPLOYMENT = ["Employed full-time", "Employed part-time", "Self-employed or business owner", "Not currently employed", "Other"]
const TIMELINE = ["Ready to start within 30 days", "Within 1–3 months", "Still researching"]
const PACKAGE_OPTIONS = [
  ...packages.map((p) => ({ value: p.id, label: `${p.name} — ${formatUsd(p.price)}` })),
  { value: "unsure", label: "Not sure yet" },
]

const required = (msg: string) => z.string().min(1, msg)

const STEPS = [
  {
    title: "Goals & experience",
    schema: z.object({
      goals: z.array(z.string()).min(1, "Select at least one goal."),
      experience: required("Choose your experience level."),
    }),
  },
  {
    title: "Package & investment",
    schema: z.object({
      package: required("Choose a preferred package."),
      comfort: required("Choose your investment comfort level."),
    }),
  },
  { title: "Operating capital", schema: z.object({ capital: required("Choose a capital range.") }) },
  {
    title: "Readiness",
    schema: z.object({
      employment: required("Select your employment status."),
      timeline: required("Choose when you could start."),
    }),
  },
  {
    title: "Contact",
    schema: z.object({
      name: z.string().trim().min(2, "Enter your name."),
      email: z.string().trim().email("Enter a valid email address."),
      phone: z
        .string()
        .trim()
        .refine((v) => v === "" || v.replace(/\D/g, "").length >= 7, "Enter a valid phone number or leave it blank."),
      consent: z.literal(true, { errorMap: () => ({ message: "Please agree so we can respond to your request." }) }),
    }),
  },
] as const

type Status = "editing" | "submitting" | "success" | "error" | "unconfigured"

const endpoint = process.env.NEXT_PUBLIC_CONSULTATION_ENDPOINT

interface ChoiceProps {
  type: "radio" | "checkbox"
  name: string
  label: string
  checked: boolean
  onChange: () => void
}

function Choice({ type, name, label, checked, onChange }: ChoiceProps) {
  return (
    <label className="group relative flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-neutral-200 transition-colors hover:border-white/30 has-[:checked]:border-cyan-300/70 has-[:checked]:bg-cyan-300/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-white/70">
      <input type={type} name={name} checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center border border-white/30 transition-colors peer-checked:border-cyan-300 peer-checked:bg-cyan-300",
          type === "radio" ? "rounded-full" : "rounded-md",
        )}
      >
        <Check className="h-3 w-3 scale-0 text-black transition-transform group-has-[:checked]:scale-100" />
      </span>
      {label}
    </label>
  )
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-2 flex items-center gap-1.5 text-sm text-rose-300">
      <AlertTriangle className="h-4 w-4 shrink-0" />
      {message}
    </p>
  )
}

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: 48 * dir }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: -48 * dir }),
}

export function Consultation() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState<FormState>(INITIAL)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>("editing")
  const [copied, setCopied] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      setData((d) => ({ ...d, package: id }))
      setErrors((er) => ({ ...er, package: "" }))
    }
    window.addEventListener(SELECT_PACKAGE_EVENT, onSelect)
    return () => window.removeEventListener(SELECT_PACKAGE_EVENT, onSelect)
  }, [])

  // Move focus to the new step heading so keyboard and screen reader users land in the right place.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    headingRef.current?.focus({ preventScroll: true })
  }, [step, status])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setData((d) => ({ ...d, [key]: value }))
    setErrors((e) => (e[key] ? { ...e, [key]: "" } : e))
  }

  const toggleGoal = (g: string) => set("goals", data.goals.includes(g) ? data.goals.filter((x) => x !== g) : [...data.goals, g])

  const validate = () => {
    const result = STEPS[step].schema.safeParse(data)
    if (result.success) {
      setErrors({})
      return true
    }
    const next: Record<string, string> = {}
    result.error.issues.forEach((i) => {
      const key = String(i.path[0])
      if (!next[key]) next[key] = i.message
    })
    setErrors(next)
    requestAnimationFrame(() => {
      formRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"], fieldset[data-invalid="true"] input')
        ?.focus()
    })
    return false
  }

  const go = (delta: number) => {
    setDir(delta)
    setStep((s) => s + delta)
  }

  const summary = () =>
    [
      `Goals: ${data.goals.join(", ")}`,
      `Experience: ${data.experience}`,
      `Preferred package: ${PACKAGE_OPTIONS.find((p) => p.value === data.package)?.label}`,
      `Investment comfort: ${data.comfort}`,
      `Operating capital: ${data.capital}`,
      `Employment: ${data.employment}`,
      `Start timeline: ${data.timeline}`,
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone || "—"}`,
    ].join("\n")

  const submit = async () => {
    if (!endpoint) {
      setStatus("unconfigured")
      return
    }
    setStatus("submitting")
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: controller.signal,
      })
      setStatus(res.ok ? "success" : "error")
    } catch {
      setStatus("error")
    } finally {
      clearTimeout(timeout)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (status === "submitting" || !validate()) return
    if (step < STEPS.length - 1) go(1)
    else void submit()
  }

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const textField = (key: "name" | "email" | "phone", label: string, type: string, autoComplete: string, optional?: boolean) => (
    <div>
      <label htmlFor={`f-${key}`} className="mb-1.5 block text-sm text-neutral-300">
        {label} {optional && <span className="text-neutral-500">(optional)</span>}
      </label>
      <input
        id={`f-${key}`}
        type={type}
        autoComplete={autoComplete}
        value={data[key]}
        onChange={(e) => set(key, e.target.value)}
        aria-invalid={!!errors[key]}
        aria-describedby={errors[key] ? `err-${key}` : undefined}
        className="h-12 w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 text-white outline-none transition-colors placeholder:text-neutral-600 focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/40 aria-[invalid=true]:border-rose-400"
      />
      <ErrorText id={`err-${key}`} message={errors[key]} />
    </div>
  )

  const group = (key: string, legend: string, children: React.ReactNode) => (
    <fieldset data-invalid={!!errors[key]} aria-describedby={errors[key] ? `err-${key}` : undefined} className="min-w-0">
      <legend className="mb-3 text-sm font-medium text-white">{legend}</legend>
      <div className="grid gap-2.5 sm:grid-cols-2">{children}</div>
      <ErrorText id={`err-${key}`} message={errors[key]} />
    </fieldset>
  )

  const stepBody = [
    <div key="s1" className="space-y-7">
      {group(
        "goals",
        "What do you want to achieve? (Select all that apply)",
        GOALS.map((g) => <Choice key={g} type="checkbox" name="goals" label={g} checked={data.goals.includes(g)} onChange={() => toggleGoal(g)} />),
      )}
      {group(
        "experience",
        "Your e-commerce experience",
        EXPERIENCE.map((x) => <Choice key={x} type="radio" name="experience" label={x} checked={data.experience === x} onChange={() => set("experience", x)} />),
      )}
    </div>,
    <div key="s2" className="space-y-7">
      {group(
        "package",
        "Preferred package",
        PACKAGE_OPTIONS.map((p) => <Choice key={p.value} type="radio" name="package" label={p.label} checked={data.package === p.value} onChange={() => set("package", p.value)} />),
      )}
      {group(
        "comfort",
        "Investment comfort level",
        COMFORT.map((x) => <Choice key={x} type="radio" name="comfort" label={x} checked={data.comfort === x} onChange={() => set("comfort", x)} />),
      )}
    </div>,
    <div key="s3" className="space-y-5">
      <p className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-4 text-sm text-neutral-300">{WORKING_CAPITAL_NOTE}</p>
      {group(
        "capital",
        "Operating capital you could make available",
        CAPITAL.map((x) => <Choice key={x} type="radio" name="capital" label={x} checked={data.capital === x} onChange={() => set("capital", x)} />),
      )}
    </div>,
    <div key="s4" className="space-y-7">
      <div>
        <label htmlFor="f-employment" className="mb-1.5 block text-sm font-medium text-white">
          Current employment status
        </label>
        <select
          id="f-employment"
          value={data.employment}
          onChange={(e) => set("employment", e.target.value)}
          aria-invalid={!!errors.employment}
          aria-describedby={errors.employment ? "err-employment" : undefined}
          className="h-12 w-full rounded-xl border border-white/15 bg-neutral-900 px-4 text-white outline-none focus:border-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300/40 aria-[invalid=true]:border-rose-400"
        >
          <option value="">Select one…</option>
          {EMPLOYMENT.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </select>
        <ErrorText id="err-employment" message={errors.employment} />
      </div>
      {group(
        "timeline",
        "When could you start building?",
        TIMELINE.map((x) => <Choice key={x} type="radio" name="timeline" label={x} checked={data.timeline === x} onChange={() => set("timeline", x)} />),
      )}
    </div>,
    <div key="s5" className="space-y-5">
      {textField("name", "Full name", "text", "name")}
      {textField("email", "Email", "email", "email")}
      {textField("phone", "Phone", "tel", "tel", true)}
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={data.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "err-consent" : undefined}
            className="mt-0.5 h-5 w-5 shrink-0 accent-cyan-300"
          />
          <span>
            I agree to be contacted about my request and have read the{" "}
            <a href="/privacy" className="text-cyan-300 underline underline-offset-2">
              Privacy Policy
            </a>
            .
          </span>
        </label>
        <ErrorText id="err-consent" message={errors.consent} />
      </div>
    </div>,
  ]

  const finished = status === "success" || status === "unconfigured" || status === "error"

  return (
    <section id="consultation" className="relative overflow-hidden bg-black py-28">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(99,102,241,0.12),transparent_65%)]" />
      <div className="container relative mx-auto px-4">
        <SectionHeading
          eyebrow="Book a consultation"
          title="Tell us about the business you want to build"
          description="Five short steps. It helps us prepare for a useful conversation."
        />

        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-neutral-950/90 p-5 shadow-2xl sm:p-8">
          {!endpoint && (
            <p className="mb-6 flex items-start gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Preview only: this form is not connected to a submission service yet, so nothing you enter will be sent.
            </p>
          )}

          {!finished && (
            <div className="mb-8">
              <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
                <span aria-live="polite">
                  Step {step + 1} of {STEPS.length}
                </span>
                <span className="hidden sm:inline">{STEPS[step].title}</span>
              </div>
              <div
                role="progressbar"
                aria-label="Consultation form progress"
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-valuenow={step + 1}
                className="h-1.5 overflow-hidden rounded-full bg-white/10"
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-violet-400"
                  initial={false}
                  animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                />
              </div>
              <ol className="mt-3 hidden justify-between sm:flex">
                {STEPS.map((s, i) => (
                  <li key={s.title} aria-current={i === step ? "step" : undefined} className={cn("text-xs", i <= step ? "text-cyan-200" : "text-neutral-600")}>
                    {i + 1}
                  </li>
                ))}
              </ol>
            </div>
          )}

          {finished ? (
            <div role="status" className="py-4 text-center">
              {status === "success" ? (
                <>
                  <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-400" />
                  <h3 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-semibold text-white outline-none">
                    Request received
                  </h3>
                  <p className="mt-2 text-neutral-400">Thanks, {data.name.split(" ")[0]}. We’ll follow up at {data.email}.</p>
                </>
              ) : (
                <>
                  <AlertTriangle className={cn("mx-auto h-12 w-12", status === "error" ? "text-rose-400" : "text-amber-300")} />
                  <h3 ref={headingRef} tabIndex={-1} className="mt-4 text-2xl font-semibold text-white outline-none">
                    {status === "error" ? "We couldn’t send your request" : "Not submitted"}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-neutral-400">
                    {status === "error"
                      ? "Something went wrong while sending. Nothing was confirmed as received. Please try again."
                      : "This form isn’t connected to a submission service yet, so your answers were not sent or stored anywhere."}
                  </p>
                  <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setStatus("editing")}
                      className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back to my answers
                    </button>
                    {status === "unconfigured" && (
                      <button
                        type="button"
                        onClick={copySummary}
                        className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-black transition-transform active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy my answers"}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            <form ref={formRef} onSubmit={onSubmit} noValidate>
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 32 }}
                >
                  <h3 ref={headingRef} tabIndex={-1} className="mb-6 text-xl font-semibold text-white outline-none">
                    {STEPS[step].title}
                  </h3>
                  {stepBody[step]}
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  disabled={step === 0}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/15 px-5 text-sm text-neutral-300 transition-colors hover:text-white disabled:invisible focus-visible:outline-2 focus-visible:outline-white"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <motion.button
                  type="submit"
                  disabled={status === "submitting"}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-sky-500 px-6 text-sm font-semibold text-black shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : step === STEPS.length - 1 ? (
                    "Submit request"
                  ) : (
                    <>
                      Continue <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
