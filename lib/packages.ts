export type PackageId = "starter" | "growth" | "complete"

export interface BusinessPackage {
  id: PackageId
  name: string
  price: number
  description: string
  features: string[]
  cta: string
  flagship?: boolean
}

export const WORKING_CAPITAL_NOTE =
  "Every package requires an additional $5,000–$10,000 in available credit or working capital for product purchases. This is separate from the package price."

export const packages: BusinessPackage[] = [
  {
    id: "starter",
    name: "Starter",
    price: 10000,
    description: "The entry point for launching your Amazon business.",
    features: ["Amazon store setup", "Supplier connections", "Initial product listings", "Basic automation", "Training"],
    cta: "Start with Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: 15000,
    description: "An expanded catalog and deeper automation for a growing operation.",
    features: [
      "Everything in Starter",
      "Expanded product catalog",
      "Advanced automation",
      "AI-assisted product monitoring",
      "Additional support",
    ],
    cta: "Choose Growth",
  },
  {
    id: "complete",
    name: "Complete Automation",
    price: 25000,
    description: "The flagship package for a fully built and automated Amazon operation.",
    features: [
      "Full Amazon FBM business buildout",
      "Dropshipping supplier integration",
      "AI-powered product monitoring",
      "Automated product rotation",
      "Order fulfillment workflows",
      "Advanced reporting",
      "Premium operational support",
    ],
    cta: "Build the Complete System",
    flagship: true,
  },
]

export const formatUsd = (value: number) => `$${value.toLocaleString("en-US")}`

export const SELECT_PACKAGE_EVENT = "da:select-package"
