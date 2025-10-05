"use client"

import { useState } from "react"
import { createCheckoutSession } from "@/app/actions"

interface PricingTier {
  id: string
  name: string
  price: number
  currency: string
  interval: string
  description: string
  features: string[]
  stripePriceId: string
  popular?: boolean
}

const pricingTiers: PricingTier[] = [
  {
    id: "professional",
    name: "Professional",
    price: 149,
    currency: "GBP",
    interval: "month",
    description: "Perfect for individual brand managers and medical affairs staff",
    stripePriceId: "price_professional_monthly", // Will be replaced with actual Stripe price ID
    features: [
      "Create up to 5 reference packs per month",
      "Upload and process PDF documents",
      "Automated claim extraction",
      "Interactive claim-to-reference linking",
      "Generate compliant PDF packs",
      "Email support",
      "ROI calculator included"
    ]
  },
  {
    id: "business",
    name: "Business",
    price: 499,
    currency: "GBP",
    interval: "month",
    description: "Ideal for teams and departments with multiple users",
    stripePriceId: "price_business_monthly", // Will be replaced with actual Stripe price ID
    popular: true,
    features: [
      "Unlimited reference packs",
      "Up to 5 team members",
      "All Professional features",
      "Team collaboration tools",
      "Centralized dashboard",
      "Audit trail and compliance reporting",
      "Priority support",
      "Custom templates",
      "Advanced analytics"
    ]
  }
]

export function PricingComponent() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (tier: PricingTier) => {
    setIsLoading(tier.id)
    try {
      const result = await createCheckoutSession(tier.stripePriceId)
      if (result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error)
      alert("Failed to start checkout. Please try again.")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Save hours on every reference pack you create. Our tool automates the tedious work
            while ensuring perfect compliance with PMCPA requirements.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative card-professional p-8 ${
                tier.popular
                  ? "ring-2 ring-pharma-blue shadow-xl scale-105"
                  : "shadow-lg"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pharma-blue to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {tier.name}
                </h3>
                <p className="text-gray-600 mb-4">{tier.description}</p>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    £{tier.price}
                  </span>
                  <span className="text-gray-600">/{tier.interval}</span>
                </div>

                <p className="text-sm text-gray-500">
                  Save ~£400 in labor costs per pack
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier)}
                disabled={isLoading === tier.id}
                className={`w-full btn-primary ${
                  tier.popular
                    ? "bg-gradient-to-r from-pharma-blue to-cyan-600 hover:from-pharma-blue/90 hover:to-cyan-600/90"
                    : ""
                }`}
              >
                {isLoading === tier.id ? "Starting Checkout..." : `Start ${tier.name} Trial`}
              </button>
            </div>
          ))}
        </div>

        {/* ROI Calculator Preview */}
        <div className="mt-16 text-center">
          <div className="card-professional p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Calculate Your ROI
            </h3>
            <p className="text-gray-600 mb-6">
              See exactly how much time and money you&apos;ll save with our automated reference pack creation.
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-pharma-blue mb-2">10-15hrs</div>
                <div className="text-sm text-gray-600">Time saved per pack</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pharma-blue mb-2">£400+</div>
                <div className="text-sm text-gray-600">Cost savings per pack</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pharma-blue mb-2">100%</div>
                <div className="text-sm text-gray-600">Compliance guarantee</div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h3>
          <div className="space-y-6">
            <div className="card-professional p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h4>
              <p className="text-gray-600">
                Yes, you can cancel your subscription at any time. You&apos;ll continue to have access
                until the end of your billing period.
              </p>
            </div>
            <div className="card-professional p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h4>
              <p className="text-gray-600">
                We offer a 14-day free trial for both plans. No credit card required to start.
              </p>
            </div>
            <div className="card-professional p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                What if I need more than 5 users?
              </h4>
              <p className="text-gray-600">
                Contact us for enterprise pricing with unlimited users and additional features.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}