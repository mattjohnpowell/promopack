"use client"

import { useState } from "react"
import { createCheckoutSession } from "@/app/actions"

interface PricingTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
  stripePriceId: string
  popular?: boolean
  cta: string
  savings?: string
}

const tiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for small teams testing the waters",
    price: 99,
    stripePriceId: "price_starter_monthly",
    features: [
      "3 promotional packs/month",
      "AI-powered claim extraction",
      "PubMed reference search",
      "PMCPA compliance checking",
      "Email support (24hr response)",
      "Export to PDF & Word"
    ],
    cta: "Start Free Trial",
    savings: "Save 15 hours per pack"
  },
  {
    id: "professional",
    name: "Professional",
    description: "Most popular for growing medical affairs teams",
    price: 179,
    stripePriceId: "price_professional_monthly",
    popular: true,
    features: [
      "10 promotional packs/month",
      "Everything in Starter, plus:",
      "Priority support (4hr response)",
      "Advanced claim scoring",
      "Custom templates",
      "API access",
      "Team collaboration tools",
      "Usage analytics dashboard"
    ],
    cta: "Start Free Trial",
    savings: "Save 150 hours/month"
  },
  {
    id: "business",
    name: "Business",
    description: "For enterprise teams with high volume needs",
    price: 399,
    stripePriceId: "price_business_monthly",
    features: [
      "Unlimited promotional packs",
      "Everything in Professional, plus:",
      "Up to 5 team members",
      "Dedicated account manager",
      "Phone & priority email support",
      "Custom integrations",
      "Advanced security & compliance",
      "Training & onboarding session"
    ],
    cta: "Start Free Trial",
    savings: "Unlimited time savings"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            ⚡ 14-Day Free Trial • No Credit Card Required
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Stop Wasting 15 Hours on Every Reference Pack
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto">
            Create PMCPA-compliant promotional materials in minutes, not days.
          </p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join medical affairs teams saving <span className="font-bold text-blue-600">150+ hours per month</span> with AI-powered claim extraction and reference matching.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {tiers.map((tier) => (
            <div 
              key={tier.id} 
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                tier.popular ? 'ring-4 ring-blue-500 scale-105 md:scale-110' : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 text-sm font-bold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900">{tier.name}</h3>
                <p className="text-gray-600 mb-6 text-sm min-h-[40px]">{tier.description}</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline mb-2">
                    <span className="text-5xl font-extrabold text-gray-900">£{tier.price}</span>
                    <span className="text-xl text-gray-600 ml-2">/month</span>
                  </div>
                  {tier.savings && (
                    <div className="text-sm font-semibold text-green-600 bg-green-50 inline-block px-3 py-1 rounded-full">
                      💰 {tier.savings}
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => handleSubscribe(tier)} 
                  disabled={loading === tier.id}
                  className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-200 mb-8 ${
                    tier.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === tier.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Starting...
                    </span>
                  ) : (
                    tier.cta
                  )}
                </button>

                <div className="space-y-4">
                  {tier.features.map((feature, i) => (
                    <div key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span className={`text-gray-700 ${feature.includes('Everything in') ? 'font-semibold text-gray-900' : ''}`}>
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Copy Sections */}
        <div className="max-w-4xl mx-auto space-y-16">
          {/* ROI Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 text-center border-2 border-green-200">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Your Time is Worth More Than This
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold text-red-600 mb-2">15 hrs</div>
                <div className="text-gray-700">Manual work per pack</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">30 min</div>
                <div className="text-gray-700">With PromoPack</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">97%</div>
                <div className="text-gray-700">Time saved</div>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-6">
              At £50/hour, that's <span className="font-bold text-green-600">£750 saved per pack</span>. 
              The Professional plan pays for itself with just <span className="font-bold">one promotional material</span>.
            </p>
            <button 
              onClick={() => handleSubscribe(tiers[1])} 
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              Start Saving Time Today →
            </button>
          </div>

          {/* Pain Points Section */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
              Sound Familiar?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              {[
                { pain: "Spending days manually extracting claims from clinical papers", solution: "AI extracts claims in seconds" },
                { pain: "Hunting through PubMed for supporting references", solution: "Automated PubMed search finds perfect matches" },
                { pain: "Worrying about PMCPA compliance before submission", solution: "Built-in compliance checking catches issues early" },
                { pain: "Recreating the same reference pack structure every time", solution: "Reusable templates get you started instantly" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-600">
                  <div className="flex items-start mb-3">
                    <span className="text-2xl mr-3">❌</span>
                    <p className="text-gray-700 font-medium">{item.pain}</p>
                  </div>
                  <div className="flex items-start ml-11">
                    <span className="text-green-600 mr-2">✓</span>
                    <p className="text-green-600 font-semibold">{item.solution}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust & Urgency Section */}
          <div className="bg-blue-900 text-white rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Medical Affairs Teams Already Saving Time
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-blue-200">Reference packs created</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">98%</div>
                <div className="text-blue-200">PMCPA compliance rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">7,500+</div>
                <div className="text-blue-200">Hours saved for teams</div>
              </div>
            </div>
            <p className="text-xl mb-8 text-blue-100">
              Every day you wait is another 15 hours wasted on manual work. Start your free trial now—no credit card required.
            </p>
            <button 
              onClick={() => handleSubscribe(tiers[1])} 
              className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Your 14-Day Free Trial →
            </button>
          </div>

          {/* FAQ / Objection Handling */}
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
              Still Have Questions?
            </h2>
            <div className="space-y-4 text-left max-w-2xl mx-auto">
              {[
                { q: "Can I cancel anytime?", a: "Yes! Cancel with one click. No contracts, no hassle." },
                { q: "What if I need more packs?", a: "Upgrade instantly or purchase additional packs as needed." },
                { q: "Is my data secure?", a: "Enterprise-grade encryption. GDPR compliant. Your data is never shared." },
                { q: "Do you offer refunds?", a: "100% money-back guarantee within 30 days if you're not satisfied." }
              ].map((item, i) => (
                <details key={i} className="bg-white p-6 rounded-lg shadow-md group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex justify-between items-center">
                    {item.q}
                    <span className="ml-4 text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-700">{item.a}</p>
                </details>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Your Time Back?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join teams who've already automated their promotional material workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => handleSubscribe(tiers[1])} 
                className="bg-white text-blue-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg w-full sm:w-auto"
              >
                Start Free Trial - No Credit Card
              </button>
              <a href="/demo" className="text-white underline hover:text-blue-100 font-semibold">
                Or watch a 2-minute demo →
              </a>
            </div>
            <p className="text-sm text-blue-200 mt-6">
              ✓ 14-day free trial ✓ No credit card required ✓ Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
