import { ROICalculator } from "@/components/ROICalculator"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "ROI Calculator | PromoPack",
  description: "Calculate your time and cost savings with PromoPack's automated claim extraction and compliance validation for pharmaceutical promotional materials.",
  openGraph: {
    title: "ROI Calculator | PromoPack",
    description: "Calculate your time and cost savings with PromoPack's automated claim extraction and compliance validation.",
  },
}

export default function ROICalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ROI Calculator
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            See how much time and money you can save with PromoPack
          </p>
          <p className="text-gray-500">
            Calculate your return on investment based on your current process and team size
          </p>
        </div>

        {/* ROI Calculator */}
        <div className="max-w-6xl mx-auto mb-12">
          <ROICalculator />
        </div>

        {/* Additional Benefits */}
        <div className="max-w-4xl mx-auto">
          <div className="card-professional p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Beyond Cost Savings</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Improved Compliance</h3>
                  <p className="text-sm text-gray-600">
                    Reduce regulatory risks with automated validation against FDA, EMA, and MHRA guidelines
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Faster Time-to-Market</h3>
                  <p className="text-sm text-gray-600">
                    Launch campaigns 60% faster with streamlined claim extraction and linking workflows
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Team Empowerment</h3>
                  <p className="text-sm text-gray-600">
                    Free your medical affairs team from tedious manual work to focus on strategic initiatives
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Complete Audit Trail</h3>
                  <p className="text-sm text-gray-600">
                    Maintain comprehensive documentation for regulatory submissions and audits
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-medical-blue to-medical-green p-8 rounded-xl text-white text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to Start Saving?</h2>
            <p className="text-blue-100 mb-6">
              Join pharmaceutical companies already using PromoPack to streamline their promotional materials workflow
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth"
                className="px-8 py-3 bg-white text-medical-blue font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Start Free Trial
              </a>
              <a
                href="/pricing"
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
              >
                View Pricing
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
