import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { Navbar } from "@/components/ui/navbar"
import { MotionRoot } from "@/components/motion/motion-root"
import { Hero } from "@/components/sections/hero"
import { TextMarquee } from "@/components/sections/text-marquee"
import { ProblemSolution } from "@/components/sections/problem-solution"
import { Opportunity } from "@/components/sections/opportunity"
import { Process } from "@/components/sections/process"
import { BusinessModels } from "@/components/sections/business-models"
import { SupplierNetwork } from "@/components/sections/supplier-network"
import { ProductIntelligence } from "@/components/sections/product-intelligence"
import { Packages } from "@/components/sections/packages"
import { Consultation } from "@/components/sections/consultation"
import { Closing } from "@/components/sections/closing"
import {
  Bot,
  Workflow,
  Brain,
  MessageSquare,
  Cog,
} from "lucide-react"

export default function HomePage() {
  return (
    <MotionRoot>
    <div className="min-h-screen bg-black">
      {/* Navigation Component */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      <TextMarquee />

      <ProblemSolution />

      <BusinessModels />

      <SupplierNetwork />

      <ProductIntelligence />

      {/* Services Section */}
      <section id="services" className="py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">What We Build for Your Amazon Business</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              From store setup to fulfillment workflows, choose the level of support your operation needs
            </p>
          </div>

          <BentoGrid className="lg:grid-rows-3">
            <BentoCard
              name="Supplier & Store Setup"
              className="lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={Bot}
              description="Launch with Amazon store setup, supplier connections, and initial product listings ready for your operation."
              href="#packages"
              cta="Learn more"
            />
            <BentoCard
              name="Product & Order Automation"
              className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={Workflow}
              description="Automate product monitoring, product rotation, order routing, and fulfillment workflows as your catalog grows."
              href="#how-it-works"
              cta="Learn more"
            />
            <BentoCard
              name="Amazon FBM Buildout"
              className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={Cog}
              description="Build the operational foundation for a full Amazon FBM business with the systems and support to run it."
              href="#packages"
              cta="Learn more"
            />
            <BentoCard
              name="AI Product Monitoring"
              className="lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={Brain}
              description="Use AI-assisted monitoring to track product opportunities and make better catalog decisions."
              href="#product-intelligence"
              cta="Learn more"
            />
            <BentoCard
              name="Reporting & Support"
              className="lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4"
              background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
              Icon={MessageSquare}
              description="Get advanced reporting, training, and operational support tailored to the package you choose."
              href="#packages"
              cta="Learn more"
            />
          </BentoGrid>
        </div>
      </section>

      <Opportunity />

      <Packages />

      <Process />

      <Consultation />

      <Closing />
    </div>
    </MotionRoot>
  )
}
