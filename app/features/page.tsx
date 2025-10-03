import Link from "next/link"

export const metadata = {
  title: "Features - PromoPack for Pharmaceutical Teams",
  description: "Discover PromoPack's comprehensive features for compliant promotional content creation, including AI-powered claim extraction, reference linking, and regulatory tools.",
}

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pharma-blue/5 via-white to-pharma-green/5 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-pharma-slate mb-6">
            Powerful Features for
            <span className="block bg-gradient-to-r from-pharma-blue to-pharma-blue-dark bg-clip-text text-transparent">
              Pharmaceutical Excellence
            </span>
          </h1>
          <p className="text-xl text-pharma-gray max-w-3xl mx-auto">
            Everything you need to create compliant, impactful promotional materials
            faster than ever before.
          </p>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Claim Extraction */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pharma-blue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">AI-Powered Claim Extraction</h3>
              <p className="text-pharma-gray mb-4">
                Our advanced AI automatically identifies and extracts medical claims from your source documents,
                ensuring no important information is missed.
              </p>
              <ul className="text-sm text-pharma-gray space-y-2">
                <li>• Intelligent text analysis</li>
                <li>• Context-aware extraction</li>
                <li>• Multi-format support (PDF, DOC)</li>
                <li>• Accuracy validation</li>
              </ul>
            </div>

            {/* Smart Reference Linking */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pharma-green/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Smart Reference Linking</h3>
              <p className="text-pharma-gray mb-4">
                Automatically link claims to supporting references with intelligent matching
                and validation to ensure regulatory compliance.
              </p>
              <ul className="text-sm text-pharma-gray space-y-2">
                <li>• Automated reference matching</li>
                <li>• Citation validation</li>
                <li>• Cross-reference checking</li>
                <li>• Compliance verification</li>
              </ul>
            </div>

            {/* Regulatory Compliance Engine */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pharma-blue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Regulatory Compliance Engine</h3>
              <p className="text-pharma-gray mb-4">
                Built-in compliance checking against FDA guidelines, PhRMA Code, and industry standards
                to ensure your materials meet regulatory requirements.
              </p>
              <ul className="text-sm text-pharma-gray space-y-2">
                <li>• FDA guideline compliance</li>
                <li>• PhRMA Code adherence</li>
                <li>• Real-time validation</li>
                <li>• Audit trail generation</li>
              </ul>
            </div>

            {/* PDF Pack Generation */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pharma-green/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Professional PDF Generation</h3>
              <p className="text-pharma-gray mb-4">
                Generate polished, regulatory-ready PDF packs with proper formatting, watermarks,
                and comprehensive reference sections.
              </p>
              <ul className="text-sm text-pharma-gray space-y-2">
                <li>• Professional formatting</li>
                <li>• Custom branding options</li>
                <li>• Watermark protection</li>
                <li>• Download & sharing</li>
              </ul>
            </div>

            {/* Team Collaboration */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pharma-blue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Team Collaboration</h3>
              <p className="text-pharma-gray mb-4">
                Work seamlessly with medical writers, legal teams, and reviewers with real-time
                collaboration, comments, and approval workflows.
              </p>
              <ul className="text-sm text-pharma-gray space-y-2">
                <li>• Real-time collaboration</li>
                <li>• Comment & review system</li>
                <li>• Approval workflows</li>
                <li>• Version control</li>
              </ul>
            </div>

            {/* Advanced Analytics */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-pharma-green/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Advanced Analytics</h3>
              <p className="text-pharma-gray mb-4">
                Track performance metrics, compliance status, and team productivity with
                comprehensive dashboards and reporting tools.
              </p>
              <ul className="text-sm text-pharma-gray space-y-2">
                <li>• Performance metrics</li>
                <li>• Compliance reporting</li>
                <li>• Team productivity</li>
                <li>• Custom dashboards</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Streamlined Workflow</h2>
            <p className="text-xl text-pharma-gray">
              From concept to compliant materials in record time
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Upload Documents</h3>
              <p className="text-pharma-gray text-sm">
                Drag & drop your source materials and references
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">AI Extraction</h3>
              <p className="text-pharma-gray text-sm">
                Claims are automatically identified and extracted
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-blue rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Link & Validate</h3>
              <p className="text-pharma-gray text-sm">
                Connect claims to references with compliance checking
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-green rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Generate Pack</h3>
              <p className="text-pharma-gray text-sm">
                Download your professional, compliant PDF pack
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-pharma-gray">
              Built for the pharmaceutical industry&apos;s highest standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-pharma-slate mb-6">Compliance & Security</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong>HIPAA Compliant</strong>
                    <p className="text-pharma-gray text-sm">Full compliance with healthcare data protection standards</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong>End-to-End Encryption</strong>
                    <p className="text-pharma-gray text-sm">All data encrypted in transit and at rest</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong>Audit Trails</strong>
                    <p className="text-pharma-gray text-sm">Complete logging of all user actions and changes</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-pharma-slate mb-6">Integration & Support</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong>SSO Integration</strong>
                    <p className="text-pharma-gray text-sm">Single sign-on with enterprise identity providers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong>API Access</strong>
                    <p className="text-pharma-gray text-sm">RESTful APIs for seamless system integration</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-pharma-green mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <strong>Dedicated Support</strong>
                    <p className="text-pharma-gray text-sm">24/7 enterprise support with SLA guarantees</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pharma-blue to-pharma-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-xl text-pharma-blue-light mb-8">
            Join leading pharmaceutical companies using PromoPack to accelerate
            their promotional material development while ensuring compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard?demo=true" className="bg-white text-pharma-blue px-8 py-4 rounded-lg font-semibold hover:bg-pharma-gray-light transition-colors">
              Start Free Demo
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-pharma-blue transition-colors">
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}