import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const metadata: Metadata = generatePageMetadata({
  title: 'EMA Compliance Software for EU Pharmaceutical Promotional Materials',
  description: 'Automated EMA Directive 2001/83/EC compliance checking for European pharmaceutical promotional content. Meet EU advertising regulations, EFPIA Code, and multi-country requirements with confidence.',
  path: '/use-cases/ema-compliance',
})

export default function EMACompliancePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              EMA & European Union Compliance
            </div>
            <h1 className="text-5xl font-bold text-pharma-slate mb-6">
              EMA-Compliant Pharmaceutical Promotional Materials
            </h1>
            <p className="text-xl text-pharma-gray mb-8">
              Ensure your pharmaceutical promotional content meets EMA Directive 2001/83/EC, EFPIA Code of Practice,
              and country-specific requirements across all 27 EU member states. Automated compliance checking with
              PubMed + EMBASE integration for comprehensive European literature coverage.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard?demo=true" className="btn-primary text-lg px-8 py-4">
                Try EMA Compliance Check
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
            The Challenge of EU Multi-Market Compliance
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <div className="text-5xl font-bold text-red-600 mb-2">27</div>
              <div className="text-pharma-slate font-semibold mb-2">Member States</div>
              <div className="text-sm text-pharma-gray">Each with country-specific regulations on top of EMA rules</div>
            </div>
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <div className="text-5xl font-bold text-red-600 mb-2">500M</div>
              <div className="text-pharma-slate font-semibold mb-2">Population</div>
              <div className="text-sm text-pharma-gray">Europe&apos;s €250B pharmaceutical market</div>
            </div>
            <div className="text-center p-8 bg-red-50 rounded-xl">
              <div className="text-5xl font-bold text-red-600 mb-2">24</div>
              <div className="text-pharma-slate font-semibold mb-2">Official Languages</div>
              <div className="text-sm text-pharma-gray">Multi-language promotional material requirements</div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-pharma-slate mb-2">
              Key EMA Regulatory Requirements
            </h3>
            <ul className="space-y-2 text-pharma-gray">
              <li>• Directive 2001/83/EC Article 86-100 (advertising of medicinal products)</li>
              <li>• EFPIA Code of Practice on promotion of prescription medicines</li>
              <li>• Member state specific regulations (ANSM France, BfArM Germany, AIFA Italy, etc.)</li>
              <li>• SmPC (Summary of Product Characteristics) alignment</li>
              <li>• EPAR (European Public Assessment Report) requirements</li>
              <li>• QRD template compliance for patient information</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            How PromoPack Ensures EMA Compliance
          </h2>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                Automated EMA Directive 2001/83/EC Checking
              </h3>
              <p className="text-pharma-gray mb-6">
                Every promotional material is automatically validated against EMA Directive 2001/83/EC requirements,
                ensuring compliance with EU-wide advertising regulations before member state review.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">SmPC Alignment</h4>
                  <p className="text-sm text-pharma-gray">
                    Validates that all promotional claims align with approved Summary of Product Characteristics.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">EFPIA Code Compliance</h4>
                  <p className="text-sm text-pharma-gray">
                    Ensures adherence to European pharmaceutical industry self-regulatory standards.
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Member State Requirements</h4>
                  <p className="text-sm text-pharma-gray">
                    Country-specific rule checking for key markets (Germany, France, Italy, Spain).
                  </p>
                </div>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Clinical Trial Data</h4>
                  <p className="text-sm text-pharma-gray">
                    Integration with EU Clinical Trials Register for up-to-date trial references.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                European Literature Coverage: PubMed + EMBASE
              </h3>
              <p className="text-pharma-gray mb-6">
                Access the most comprehensive European pharmaceutical literature. Our platform searches PubMed&apos;s
                36M+ global citations, with premium tiers offering EMBASE integration for 30% more European journal
                coverage—critical for EMA submissions.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div className="bg-pharma-gray-light/30 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Standard Tier: PubMed</h4>
                  <ul className="space-y-2 text-sm text-pharma-gray">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>36M+ citations including major EU journals</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>The Lancet, BMJ, NEJM coverage</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>~80% of EMA submission references</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-pharma-slate">Premium Tier: EMBASE</h4>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">Coming Q2 2025</span>
                  </div>
                  <ul className="space-y-2 text-sm text-pharma-gray">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>8,500+ journals from 90+ countries</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>30% unique European content vs PubMed</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Preferred by EMA for comprehensive reviews</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-pharma-blue/5 p-6 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-blue mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate mb-2">Why EMBASE matters for EMA</div>
                    <p className="text-sm text-pharma-gray">
                      EMBASE includes more European regional journals, conference abstracts, and pharmaceutical literature
                      than PubMed. For multi-country EU launches, EMBASE ensures you&apos;re not missing critical European
                      studies that may be required by member state regulators.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                Multi-Country Compliance Management
              </h3>
              <p className="text-pharma-gray mb-6">
                Manage promotional materials across multiple EU member states with country-specific compliance rules
                and workflow templates.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">Country Selection</div>
                    <div className="text-sm text-pharma-gray">Tag materials by target market</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">Local Regulations</div>
                    <div className="text-sm text-pharma-gray">Country-specific checks</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">Audit Trails</div>
                    <div className="text-sm text-pharma-gray">EMA-ready documentation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            EMA Compliance Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'EMA Directive 2001/83/EC',
              'EFPIA Code of Practice',
              'SmPC Alignment',
              'EPAR Requirements',
              'Member State Rules',
              'EU Clinical Trials Register',
              'PubMed + EMBASE (Premium)',
              'Multi-Language Support',
            ].map((feature, i) => (
              <div key={i} className="bg-pharma-gray-light/30 p-6 rounded-xl text-center">
                <div className="text-blue-600 mb-2">
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

      <section className="py-20 bg-gradient-to-r from-blue-600 to-pharma-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for EU Multi-Market Launches?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Try PromoPack&apos;s EMA-compliant promotional content platform with PubMed coverage today,
            upgrade to EMBASE when you need comprehensive European literature
          </p>
          <Link href="/dashboard?demo=true" className="bg-white text-pharma-blue px-8 py-4 rounded-lg font-semibold hover:bg-pharma-gray-light transition-colors inline-block">
            Start Free Demo - Test EMA Compliance
          </Link>
        </div>
      </section>
    </div>
  )
}
