"use client"

import { useState } from "react"
import { createCheckoutSession } from "@/app/actions"

interface PricingTier {
  id: string
  name: string
  price: number
  features: string[]
  stripePriceId: string
  popular?: boolean
}

const tiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    price: 99,
    stripePriceId: "price_starter_monthly",
    features: ["3 packs/month", "AI claim extraction", "Email support"]
  },
  {
    id: "professional",
    name: "Professional",
    price: 179,
    stripePriceId: "price_professional_monthly",
    popular: true,
    features: ["10 packs/month", "PubMed search", "Priority support"]
  },
  {
    id: "business",
    name: "Business",
    price: 399,
    stripePriceId: "price_business_monthly",
    features: ["Unlimited packs", "5 team members", "Phone support"]
  }
]

export function PricingComponent() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (tier: PricingTier) => {
    setLoading(tier.id)
    try {
      const result = await createCheckoutSession(tier.stripePriceId)
      if (result.url) window.location.href = result.url
    } catch (error) {
      alert("Failed to start checkout")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4">Stop Wasting 15 Hours on Every Reference Pack</h1>
          <p className="text-xl text-gray-600 mb-6">Save 10-15 hours per pack. PMCPA compliant. Start free trial today.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div key={tier.id} className={g-white rounded-lg p-8 shadow-lg \$\{tier.popular ? 'ring-2 ring-blue-600' : ''\}}>
              <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
              <div className="text-4xl font-bold mb-4">£{tier.price}<span className="text-lg text-gray-600">/mo</span></div>
              <ul className="mb-6 space-y-2">
                {tier.features.map((f, i) => <li key={i} className="text-gray-600">✓ {f}</li>)}
              </ul>
              <button onClick={() => handleSubscribe(tier)} disabled={loading === tier.id} className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
                {loading === tier.id ? "Starting..." : "Start Free Trial"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
