import { Button } from "@/components/ui/button"
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"
import { SparklesCore } from "@/components/ui/sparkles"
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
import {
  ArrowRight,
  Bot,
  Workflow,
  Brain,
  MessageSquare,
  Cog,
  Linkedin,
  Twitter,
  Facebook,
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

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <AnimatedGradientBackground
          Breathing={true}
          gradientColors={["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]}
          gradientStops={[35, 50, 60, 70, 80, 90, 100]}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="relative h-32 w-full flex flex-col items-center justify-center">
              <div className="w-full absolute inset-0">
                <SparklesCore
                  id="ctasparticles"
                  background="transparent"
                  minSize={0.6}
                  maxSize={1.4}
                  particleDensity={100}
                  className="w-full h-full"
                  particleColor="#FFFFFF"
                  speed={0.8}
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 relative z-20 text-balance">
                Ready to Build Your Amazon Business?
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="bg-white text-black hover:bg-gray-100">
                <a href="#packages">
                  Discuss Your Amazon Package
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
                <a href="#consultation">Schedule a Consultation</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="relative py-20 bg-black border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/95 to-black/90" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-white">Amazon Business Automation</h3>
                <p className="text-gray-300 leading-relaxed">
                  Building Amazon FBM businesses with supplier connections, automation, product monitoring, and operational support.
                </p>
              </div>

              <div className="flex space-x-4">
                <a
                  href="#"
                  className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Services</h4>
              <ul className="space-y-3">
                {[
                  "Amazon Store Setup",
                  "Product Monitoring & Automation",
                  "Supplier Integration",
                  "Advanced Reporting",
                  "Operational Support",
                ].map((service) => (
                  <li key={service}>
                    <a
                      href="#services"
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Company</h4>
              <ul className="space-y-3">
                {[
                  { name: "About Us", href: "#" },
                  { name: "Blog", href: "#" },
                  { name: "Careers", href: "#" },
                  { name: "Contact", href: "#consultation" },
                ].map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
              <p className="text-gray-300 leading-relaxed">Consultations are available by appointment. No business address, phone number, or email is published here.</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-white/10 mt-16 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-gray-400 text-center lg:text-left">© 2024 Amazon Business Automation. All rights reserved.</p>

              <div className="flex flex-wrap justify-center lg:justify-end space-x-8">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </MotionRoot>
  )
}
