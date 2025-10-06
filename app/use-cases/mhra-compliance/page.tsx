import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const metadata: Metadata = generatePageMetadata({
  title: 'MHRA & ABPI Compliance Software for UK Pharmaceutical Advertising',
  description: 'Automated MHRA Blue Guide and ABPI Code of Practice compliance for UK pharmaceutical promotional materials. Meet UK advertising standards with Cochrane-backed evidence and NICE guideline alignment.',
  path: '/use-cases/mhra-compliance',
})

export default function MHRACompliancePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              MHRA & UK Compliance
            </div>
            <h1 className="text-5xl font-bold text-pharma-slate mb-6">
              MHRA-Compliant UK Pharmaceutical Promotional Materials
            </h1>
            <p className="text-xl text-pharma-gray mb-8">
              Ensure your pharmaceutical advertising meets MHRA Blue Guide standards, ABPI Code of Practice, and
              UK advertising regulations post-Brexit. Powered by PubMed with Cochrane Library integration
              (premium tier) for NICE guideline-aligned evidence.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard?demo=true" className="btn-primary text-lg px-8 py-4">
                Try MHRA Compliance Check
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
            UK Pharmaceutical Advertising Landscape
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-indigo-50 rounded-xl">
              <div className="text-5xl font-bold text-indigo-600 mb-2">£30B</div>
              <div className="text-pharma-slate font-semibold mb-2">UK Pharma Market</div>
              <div className="text-sm text-pharma-gray">Separate post-Brexit regulatory framework</div>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-xl">
              <div className="text-5xl font-bold text-indigo-600 mb-2">ABPI</div>
              <div className="text-pharma-slate font-semibold mb-2">Self-Regulation</div>
              <div className="text-sm text-pharma-gray">Stringent industry code of practice</div>
            </div>
            <div className="text-center p-8 bg-indigo-50 rounded-xl">
              <div className="text-5xl font-bold text-indigo-600 mb-2">NICE</div>
              <div className="text-pharma-slate font-semibold mb-2">Evidence Standards</div>
              <div className="text-sm text-pharma-gray">Cochrane-based systematic reviews preferred</div>
            </div>
          </div>

          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-6 rounded-r-lg">
            <h3 className="text-xl font-semibold text-pharma-slate mb-2">
              UK-Specific Regulatory Requirements
            </h3>
            <ul className="space-y-2 text-pharma-gray">
              <li>• MHRA Blue Guide (Guide to Advertising and Promotion of Medicines in the UK)</li>
              <li>• ABPI Code of Practice (2021 edition + amendments)</li>
              <li>• Prescription Medicines Code of Practice Authority (PMCPA) rulings</li>
              <li>• UK Statutory Instrument 2012 No. 1916 (advertising regulations)</li>
              <li>• NICE Technology Appraisal Guidance alignment</li>
              <li>• UK-specific SmPC and PIL requirements</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            How PromoPack Ensures UK Compliance
          </h2>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                Automated MHRA Blue Guide & ABPI Code Checking
              </h3>
              <p className="text-pharma-gray mb-6">
                Every promotional material is validated against MHRA Blue Guide standards and ABPI Code of Practice,
                ensuring compliance with UK-specific advertising regulations and self-regulatory requirements.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">ABPI Code Compliance</h4>
                  <p className="text-sm text-pharma-gray">
                    Validates materials against ABPI Code provisions including fair balance, substantiation,
                    and interaction with healthcare professionals.
                  </p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">UK SmPC Alignment</h4>
                  <p className="text-sm text-pharma-gray">
                    Ensures promotional claims align with UK-approved Summary of Product Characteristics.
                  </p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">PMCPA Precedent Checking</h4>
                  <p className="text-sm text-pharma-gray">
                    References historical PMCPA rulings to avoid common compliance pitfalls.
                  </p>
                </div>
                <div className="bg-indigo-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">NICE Guideline Support</h4>
                  <p className="text-sm text-pharma-gray">
                    Links to NICE Technology Appraisal Guidance and quality standards where applicable.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                UK Evidence Standards: PubMed + Cochrane Library
              </h3>
              <p className="text-pharma-gray mb-6">
                UK regulators and NICE favor systematic reviews and high-quality evidence. Our platform provides
                PubMed access standard, with premium Cochrane Library integration for gold-standard systematic
                reviews preferred by UK authorities.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div className="bg-pharma-gray-light/30 p-6 rounded-lg">
                  <h4 className="font-semibold text-pharma-slate mb-3">Standard Tier: PubMed</h4>
                  <ul className="space-y-2 text-sm text-pharma-gray">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>36M+ citations including major UK journals</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>BMJ, The Lancet, BJCP coverage</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Sufficient for most MHRA submissions</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-indigo-50 p-6 rounded-lg border-2 border-indigo-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-pharma-slate">Premium: Cochrane Library</h4>
                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Coming Q2 2025</span>
                  </div>
                  <ul className="space-y-2 text-sm text-pharma-gray">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Gold standard systematic reviews</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Preferred by NICE and NHS England</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-indigo-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Enhanced credibility for UK submissions</span>
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
                    <div className="font-semibold text-pharma-slate mb-2">Why Cochrane matters for UK market</div>
                    <p className="text-sm text-pharma-gray">
                      The Cochrane Library is UK-based and considered the gold standard for systematic reviews.
                      NICE guidelines extensively reference Cochrane reviews, and MHRA/ABPI favor evidence from
                      Cochrane-quality systematic reviews. For NHS procurement and NICE submissions, Cochrane
                      references significantly strengthen your case.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                Post-Brexit UK-Specific Features
              </h3>
              <p className="text-pharma-gray mb-6">
                Navigate the diverging UK regulatory landscape with dedicated compliance tools separate from
                EU EMA requirements.
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">UK SmPC Updates</div>
                    <div className="text-sm text-pharma-gray">Track UK-specific product changes</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">MHRA Guidance</div>
                    <div className="text-sm text-pharma-gray">Latest Blue Guide updates</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <div className="font-semibold text-pharma-slate">ISRCTN Registry</div>
                    <div className="text-sm text-pharma-gray">UK clinical trial data</div>
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
            UK Compliance Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'MHRA Blue Guide',
              'ABPI Code of Practice',
              'PMCPA Rulings',
              'UK SmPC Alignment',
              'NICE Guidelines',
              'Cochrane Library (Premium)',
              'ISRCTN Registry',
              'NHS Evidence Standards',
            ].map((feature, i) => (
              <div key={i} className="bg-pharma-gray-light/30 p-6 rounded-xl text-center">
                <div className="text-indigo-600 mb-2">
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

      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for UK Market Success?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Try PromoPack&apos;s MHRA-compliant platform with PubMed today, upgrade to Cochrane Library
            for NICE-aligned systematic review evidence
          </p>
          <Link href="/dashboard?demo=true" className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Start Free Demo - Test UK Compliance
          </Link>
        </div>
      </section>
    </div>
  )
}
