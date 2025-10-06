import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { organizationSchema, softwareApplicationSchema, faqSchema } from "@/lib/structured-data"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pharma-blue/5 via-white to-pharma-green/5 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pharma-blue/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pharma-green/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-pharma-blue to-pharma-blue-dark rounded-3xl flex items-center justify-center mb-8 shadow-xl">
              <Image
                src="/promopack-logo.svg"
                alt="PromoPack - FDA-compliant pharmaceutical promotional content platform logo"
                width={64}
                height={64}
                priority
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-pharma-slate mb-6">
              Global Pharmaceutical Promotional Content Platform
              <span className="block bg-gradient-to-r from-pharma-blue to-pharma-blue-dark bg-clip-text text-transparent">
                Multi-Market Compliance | 75% Faster Reviews
              </span>
            </h1>

            <p className="text-xl text-pharma-gray max-w-3xl mx-auto mb-8">
              AI-powered platform for creating compliant pharmaceutical promotional materials across FDA, EMA, MHRA,
              Health Canada, and TGA markets. Automated claim extraction, PubMed reference linking, and built-in
              regulatory compliance checking for medical affairs and regulatory teams worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/demo" className="btn-primary text-lg px-8 py-4">
                Try Free Demo
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-pharma-gray">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>FDA (US)</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>EMA (EU)</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>MHRA (UK)</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Health Canada</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>TGA (AU)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">
              One Platform, Multi-Market Compliance
            </h2>
            <p className="text-xl text-pharma-gray max-w-2xl mx-auto">
              Create promotional materials that meet regulatory requirements across FDA, EMA, MHRA, Health Canada,
              and TGA markets. Built for global pharmaceutical companies and medical affairs teams.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light">
              <div className="w-12 h-12 bg-pharma-blue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Accelerate MLR Workflows by 75%</h3>
              <p className="text-pharma-gray">
                AI-powered claim extraction and automated reference linking reduce medical legal regulatory
                review cycles from 3 weeks to 3-5 days. Focus on medical strategy, not manual document review.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light">
              <div className="w-12 h-12 bg-pharma-green/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">FDA Compliance Automation</h3>
              <p className="text-pharma-gray">
                Automated compliance checking against FDA promotional material guidelines, OPDP regulations,
                and PhRMA code standards. Built-in audit trails for regulatory submissions.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light">
              <div className="w-12 h-12 bg-pharma-blue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Cross-Functional MLR Collaboration</h3>
              <p className="text-pharma-gray">
                Streamline collaboration between medical affairs, legal, regulatory, and medical writing teams.
                Real-time review workflows with complete audit trails for documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">
              Trusted by Medical Affairs Professionals
            </h2>
            <p className="text-xl text-pharma-gray">
              Join teams creating compliant promotional content faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-8 bg-pharma-gray-light/30 rounded-xl">
              <div className="text-5xl font-bold text-pharma-blue mb-2">75%</div>
              <div className="text-pharma-slate font-semibold mb-2">Faster Review Cycles</div>
              <div className="text-sm text-pharma-gray">Reduce time from 3 weeks to 3-5 days</div>
            </div>
            <div className="text-center p-8 bg-pharma-gray-light/30 rounded-xl">
              <div className="text-5xl font-bold text-pharma-green mb-2">99%</div>
              <div className="text-pharma-slate font-semibold mb-2">Compliance Accuracy</div>
              <div className="text-sm text-pharma-gray">Automated FDA guideline checking</div>
            </div>
            <div className="text-center p-8 bg-pharma-gray-light/30 rounded-xl">
              <div className="text-5xl font-bold text-pharma-blue mb-2">50+</div>
              <div className="text-pharma-slate font-semibold mb-2">Hours Saved Monthly</div>
              <div className="text-sm text-pharma-gray">Per medical affairs professional</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-pharma-gray-light/30 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-pharma-yellow">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-pharma-slate mb-6 italic">
                &ldquo;This platform has completely changed our workflow. The automated claim extraction
                and reference linking saves us countless hours, and the compliance checking gives us
                confidence that our materials meet all regulatory requirements.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pharma-blue rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  MA
                </div>
                <div>
                  <div className="font-semibold text-pharma-slate">Medical Affairs Director</div>
                  <div className="text-sm text-pharma-gray">Large Pharmaceutical Company</div>
                </div>
              </div>
            </div>

            <div className="bg-pharma-gray-light/30 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-pharma-yellow">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-pharma-slate mb-6 italic">
                &ldquo;The collaboration features and audit trail capabilities make cross-functional
                review seamless. Our legal, regulatory, and medical teams can all work together
                efficiently while maintaining full documentation.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pharma-green rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  RA
                </div>
                <div>
                  <div className="font-semibold text-pharma-slate">Regulatory Affairs Manager</div>
                  <div className="text-sm text-pharma-gray">Biotechnology Startup</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pharma-blue to-pharma-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Promotional Content Process?
          </h2>
          <p className="text-xl text-pharma-blue-light mb-8">
            Join hundreds of medical affairs professionals who have streamlined their workflow
            with PromoPack. Start your free trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard?demo=true" className="bg-white text-pharma-blue px-8 py-4 rounded-lg font-semibold hover:bg-pharma-gray-light transition-colors">
              Start Free Demo
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-pharma-blue transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-pharma-gray">
              Everything you need to know about PromoPack
            </p>
          </div>

          <div className="space-y-6">
            <details className="group bg-pharma-gray-light/30 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-pharma-slate text-lg list-none">
                <span>What is PromoPack?</span>
                <svg className="w-5 h-5 text-pharma-blue transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-pharma-gray">
                PromoPack is an AI-powered platform designed for pharmaceutical companies to create, review, and manage promotional content with built-in FDA compliance, automated claim extraction, and intelligent reference linking.
              </p>
            </details>

            <details className="group bg-pharma-gray-light/30 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-pharma-slate text-lg list-none">
                <span>Is PromoPack FDA compliant?</span>
                <svg className="w-5 h-5 text-pharma-blue transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-pharma-gray">
                Yes, PromoPack is built with FDA regulations in mind. Every document is automatically checked against FDA guidelines and industry standards. The platform includes compliance checking, audit trails, and regulatory review workflows.
              </p>
            </details>

            <details className="group bg-pharma-gray-light/30 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-pharma-slate text-lg list-none">
                <span>How long does it take to review promotional materials?</span>
                <svg className="w-5 h-5 text-pharma-blue transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-pharma-gray">
                PromoPack reduces review cycles by up to 75%. What traditionally takes 3 weeks can be completed in 3-5 days with automated claim extraction, reference linking, and collaborative review tools.
              </p>
            </details>

            <details className="group bg-pharma-gray-light/30 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-pharma-slate text-lg list-none">
                <span>Can I try PromoPack before purchasing?</span>
                <svg className="w-5 h-5 text-pharma-blue transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-pharma-gray">
                Yes! PromoPack offers a free demo mode where you can explore the platform with sample projects. No credit card or account required to try the demo.
              </p>
            </details>

            <details className="group bg-pharma-gray-light/30 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-pharma-slate text-lg list-none">
                <span>What type of pharmaceutical companies use PromoPack?</span>
                <svg className="w-5 h-5 text-pharma-blue transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-pharma-gray">
                PromoPack is used by medical affairs teams, regulatory affairs departments, and medical writers at pharmaceutical and biotechnology companies of all sizes, from startups to large enterprises.
              </p>
            </details>

            <details className="group bg-pharma-gray-light/30 rounded-xl p-6 cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-pharma-slate text-lg list-none">
                <span>Is my data secure with PromoPack?</span>
                <svg className="w-5 h-5 text-pharma-blue transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <p className="mt-4 text-pharma-gray">
                Yes, PromoPack is HIPAA compliant and uses enterprise-grade security. All data is encrypted in transit and at rest, with comprehensive access controls and audit logging.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Auth Section */}
      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">Get Started</h2>
            <p className="text-pharma-gray">Create your account or try our demo</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/dashboard?demo=true"
              className="w-full btn-primary flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Try Demo Mode
            </Link>
            <div className="text-center">
              <span className="text-sm text-pharma-gray-light">No account required • Explore sample projects</span>
            </div>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-pharma-gray-light/50" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-pharma-gray-light/30 text-pharma-gray-light font-medium">Or sign in to get started</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-pharma-gray-light">
            {/* AuthTabs component will go here */}
            <div className="text-center text-pharma-gray">
              Authentication form will be integrated here
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  )
}
