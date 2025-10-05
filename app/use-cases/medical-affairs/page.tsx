import { Metadata } from 'next'
import { generatePageMetadata } from '@/lib/metadata'
import Link from 'next/link'

export const metadata: Metadata = generatePageMetadata({
  title: 'Medical Affairs Software - Streamline MLR Workflows',
  description: 'Purpose-built medical affairs software for pharmaceutical teams. Automate MLR reviews, manage promotional content, and ensure FDA compliance. Reduce review cycles by 75%.',
  path: '/use-cases/medical-affairs',
})

export default function MedicalAffairsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pharma-blue/5 via-white to-pharma-green/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-block bg-pharma-blue/10 text-pharma-blue px-4 py-2 rounded-full text-sm font-semibold mb-6">
              Medical Affairs Solutions
            </div>
            <h1 className="text-5xl font-bold text-pharma-slate mb-6">
              Medical Affairs Software That Actually Understands Your Workflow
            </h1>
            <p className="text-xl text-pharma-gray mb-8">
              Purpose-built for medical affairs teams managing pharmaceutical promotional content.
              Automate MLR reviews, streamline cross-functional collaboration, and maintain FDA compliance—all in one platform.
            </p>
            <div className="flex gap-4">
              <Link href="/dashboard?demo=true" className="btn-primary text-lg px-8 py-4">
                Try Free Demo
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            The Medical Affairs Challenge
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-3">Slow MLR Review Cycles</h3>
              <p className="text-pharma-gray">
                3-4 week review cycles delay product launches and marketing campaigns. Manual claim extraction and reference verification bottleneck your team.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-3">Compliance Risk</h3>
              <p className="text-pharma-gray">
                Manual compliance checking leads to errors. FDA OPDP citations cost companies millions in corrective actions and reputation damage.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-3">Siloed Workflows</h3>
              <p className="text-pharma-gray">
                Medical, legal, and regulatory teams work in separate systems. Version control nightmares and lost audit trails create chaos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-4 text-center">
            How PromoPack Transforms Medical Affairs
          </h2>
          <p className="text-xl text-pharma-gray mb-12 text-center max-w-3xl mx-auto">
            Purpose-built for the unique needs of pharmaceutical medical affairs teams
          </p>

          <div className="space-y-12">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                    Automated MLR Workflow
                  </h3>
                  <p className="text-pharma-gray mb-4">
                    AI-powered claim extraction automatically identifies all product claims in your promotional materials.
                    Smart reference linking matches claims to supporting literature. Compliance pre-checks flag potential
                    FDA issues before legal review.
                  </p>
                  <ul className="space-y-2 text-pharma-gray">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Reduce review cycles from 3 weeks to 3-5 days</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Automated claim-reference validation</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Real-time compliance checking</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-pharma-blue/5 rounded-lg p-8 text-center">
                  <div className="text-6xl font-bold text-pharma-blue mb-2">75%</div>
                  <div className="text-pharma-slate font-semibold">Faster Review Cycles</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="bg-pharma-green/5 rounded-lg p-8 text-center order-2 md:order-1">
                  <div className="text-6xl font-bold text-pharma-green mb-2">99%</div>
                  <div className="text-pharma-slate font-semibold">Compliance Accuracy</div>
                </div>
                <div className="order-1 md:order-2">
                  <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                    Built-In FDA Compliance
                  </h3>
                  <p className="text-pharma-gray mb-4">
                    Every document is automatically validated against FDA OPDP regulations, PhRMA code, and your internal
                    compliance policies. Complete audit trails ensure regulatory readiness.
                  </p>
                  <ul className="space-y-2 text-pharma-gray">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>OPDP regulation checking</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Fair balance verification</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Complete audit trail documentation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-pharma-slate mb-4">
                    Cross-Functional Collaboration
                  </h3>
                  <p className="text-pharma-gray mb-4">
                    Unified platform for medical affairs, legal, regulatory, and marketing teams. Real-time collaboration,
                    role-based permissions, and intelligent workflow routing keep everyone aligned.
                  </p>
                  <ul className="space-y-2 text-pharma-gray">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Real-time collaborative review</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Automated workflow routing</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-pharma-green mr-2 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Version control and approval tracking</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-pharma-blue/5 rounded-lg p-8 text-center">
                  <div className="text-6xl font-bold text-pharma-blue mb-2">50+</div>
                  <div className="text-pharma-slate font-semibold">Hours Saved Per Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-pharma-slate mb-12 text-center">
            Complete Medical Affairs Toolkit
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Claim Extraction', desc: 'AI automatically identifies all product claims' },
              { title: 'Reference Linking', desc: 'Smart matching to PubMed and internal databases' },
              { title: 'Compliance Checking', desc: 'Real-time FDA OPDP regulation validation' },
              { title: 'MLR Workflow', desc: 'Automated routing to medical, legal, regulatory' },
              { title: 'Audit Trails', desc: 'Complete documentation for regulatory submissions' },
              { title: 'Team Collaboration', desc: 'Real-time review and approval workflows' },
            ].map((feature, i) => (
              <div key={i} className="bg-pharma-gray-light/30 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-pharma-slate mb-2">{feature.title}</h3>
                <p className="text-pharma-gray">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pharma-blue to-pharma-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Medical Affairs Workflow?
          </h2>
          <p className="text-xl text-pharma-blue-light mb-8">
            See how PromoPack can reduce your MLR review cycles by 75%
          </p>
          <Link href="/dashboard?demo=true" className="bg-white text-pharma-blue px-8 py-4 rounded-lg font-semibold hover:bg-pharma-gray-light transition-colors inline-block">
            Try Free Demo - No Credit Card Required
          </Link>
        </div>
      </section>
    </div>
  )
}
