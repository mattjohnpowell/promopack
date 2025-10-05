import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const metadata: Metadata = generatePageMetadata({
  title: 'FDA Compliance Software for Pharmaceutical Promotional Materials',
  description: 'Automated FDA OPDP compliance checking for pharmaceutical promotional content. Ensure fair balance, claim substantiation, and regulatory compliance. Reduce compliance risk by 99%.',
  path: '/use-cases/fda-compliance',
})

export default function FDACompliancePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-pharma-green/5 via-white to-pharma-blue/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block bg-pharma-green/10 text-pharma-green px-4 py-2 rounded-full text-sm font-semibold mb-6">
              FDA Compliance Solutions
            </div>
            <h1 className="text-5xl font-bold text-pharma-slate mb-6">
              FDA-Compliant Promotional Materials, Guaranteed
            </h1>
            <p className="text-xl text-pharma-gray mb-8">
              Automated compliance checking against FDA OPDP regulations, PhRMA code, and industry standards.
              Eliminate compliance risk and pass regulatory review with confidence.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard?demo=true" className="btn-primary text-lg px-8 py-4">
                Try Compliance Check
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            The Cost of Non-Compliance
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <div className="text-5xl font-bold text-red-600 mb-2">$2M+</div>
              <div className="text-pharma-slate font-semibold mb-2">Average FDA Warning Letter Cost</div>
              <div className="text-sm text-pharma-gray">Including corrective actions and reputation damage</div>
            </div>
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <div className="text-5xl font-bold text-red-600 mb-2">6-12</div>
              <div className="text-pharma-slate font-semibold mb-2">Months of Corrective Action</div>
              <div className="text-sm text-pharma-gray">Timeline to resolve FDA violations</div>
            </div>
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <div className="text-5xl font-bold text-red-600 mb-2">100%</div>
              <div className="text-pharma-slate font-semibold mb-2">Public Disclosure</div>
              <div className="text-sm text-pharma-gray">All warning letters published on FDA.gov</div>
            </div>
          </div>

          <div className="bg-pharma-blue/5 border-l-4 border-pharma-blue p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-pharma-slate mb-2">
              Common FDA OPDP Violations
            </h3>
            <ul className="space-y-2 text-pharma-gray">
              <li>• Overstating efficacy or minimizing risks</li>
              <li>• Inadequate fair balance between benefits and risks</li>
              <li>• Insufficient claim substantiation</li>
              <li>• Missing or incomplete safety information</li>
              <li>• Improper use of comparative claims</li>
              <li>• Promotion of off-label uses</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            How PromoPack Ensures FDA Compliance
          </h2>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                Automated OPDP Regulation Checking
              </h3>
              <p className="text-pharma-gray mb-6">
                Every document is automatically validated against current FDA Office of Prescription Drug Promotion (OPDP)
                guidelines. Our AI identifies potential violations before they reach regulatory review.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-pharma-green/5 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Fair Balance Verification</h4>
                  <p className="text-sm text-pharma-gray">
                    Automated analysis ensures benefits and risks are presented with appropriate prominence and balance.
                  </p>
                </div>
                <div className="bg-pharma-green/5 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Claim Substantiation</h4>
                  <p className="text-sm text-pharma-gray">
                    Every product claim is matched to peer-reviewed references with adequate statistical support.
                  </p>
                </div>
                <div className="bg-pharma-green/5 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Safety Information</h4>
                  <p className="text-sm text-pharma-gray">
                    Validates inclusion of required safety disclosures and contraindications.
                  </p>
                </div>
                <div className="bg-pharma-green/5 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Indication Accuracy</h4>
                  <p className="text-sm text-pharma-gray">
                    Ensures promotional content stays within approved indications and doesn't imply off-label use.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                Complete Audit Trail Documentation
              </h3>
              <p className="text-pharma-gray mb-6">
                Maintain comprehensive audit trails for every promotional material. Track all reviews, approvals,
                and modifications with timestamped documentation for regulatory submissions.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">Version Control</div>
                    <div className="text-sm text-pharma-gray">Complete document history</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">Approval Tracking</div>
                    <div className="text-sm text-pharma-gray">MLR sign-off documentation</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">Change Logs</div>
                    <div className="text-sm text-pharma-gray">All modifications tracked</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                PhRMA Code & Industry Standards
              </h3>
              <p className="text-pharma-gray mb-4">
                Beyond FDA requirements, validate compliance with PhRMA Code on Interactions with Health Care Professionals
                and other industry self-regulatory standards.
              </p>
              <div className="bg-pharma-blue/5 p-6 rounded-lg">
                <div className="text-4xl font-bold text-pharma-green mb-2 text-center">99%</div>
                <div className="text-pharma-slate font-semibold text-center">Compliance Accuracy Rate</div>
                <div className="text-sm text-pharma-gray text-center mt-2">
                  Based on automated pre-checks vs. final regulatory review
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            Compliance Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'FDA OPDP Guidelines',
              'PhRMA Code Compliance',
              'Fair Balance Analysis',
              'Claim Substantiation',
              'Safety Disclosure Checks',
              'Reference Validation',
              'Indication Accuracy',
              'Audit Trail Logging',
            ].map((feature, i) => (
              <div key={i} className="bg-pharma-gray-light/30 p-6 rounded-xl text-center">
                <div className="text-pharma-green mb-2">
                  <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="font-semibold text-pharma-slate">{feature}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-pharma-green to-pharma-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Eliminate Compliance Risk Today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Try PromoPack's automated FDA compliance checking on your promotional materials
          </p>
          <Link href="/dashboard?demo=true" className="bg-white text-pharma-blue px-8 py-4 rounded-lg font-semibold hover:bg-pharma-gray-light transition-colors inline-block">
            Test Your Materials - Free Demo
          </Link>
        </div>
      </section>
    </div>
  )
}
