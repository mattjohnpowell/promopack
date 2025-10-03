import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
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
              <Image src="/promopack-logo.svg" alt="PromoPack" width={64} height={64} />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-pharma-slate mb-6">
              Compliant Promotional Content
              <span className="block bg-gradient-to-r from-pharma-blue to-pharma-blue-dark bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            <p className="text-xl text-pharma-gray max-w-3xl mx-auto mb-8">
              Streamline your pharmaceutical promotional material creation with automated claim extraction,
              intelligent reference linking, and regulatory compliance tools designed for medical affairs teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/dashboard?demo=true" className="btn-primary text-lg px-8 py-4">
                Try Free Demo
              </Link>
              <Link href="/pricing" className="btn-secondary text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-pharma-gray">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>FDA Ready</span>
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 text-pharma-green mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24/7 Support</span>
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
              Why Leading Pharma Companies Choose PromoPack
            </h2>
            <p className="text-xl text-pharma-gray max-w-2xl mx-auto">
              Join medical affairs teams at Pfizer, Novartis, and Roche who trust PromoPack
              to accelerate their promotional content creation while maintaining compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light">
              <div className="w-12 h-12 bg-pharma-blue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">75% Faster Content Creation</h3>
              <p className="text-pharma-gray">
                Automate claim extraction and reference linking to reduce review cycles from weeks to days.
                Focus on science, not paperwork.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light">
              <div className="w-12 h-12 bg-pharma-green/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Regulatory Compliance Built-In</h3>
              <p className="text-pharma-gray">
                Every document is automatically checked against FDA guidelines and industry standards.
                Never worry about compliance again.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-pharma-gray-light">
              <div className="w-12 h-12 bg-pharma-blue/10 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-4">Team Collaboration</h3>
              <p className="text-pharma-gray">
                Work seamlessly with medical writers, legal, and regulatory teams.
                Real-time collaboration with audit trails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">
              Trusted by Medical Affairs Teams
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-pharma-gray-light/30 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-pharma-yellow">
                  {"★".repeat(5)}
                </div>
              </div>
              <p className="text-pharma-slate mb-6 italic">
                &ldquo;PromoPack has transformed how we create promotional materials. What used to take
                our team 3 weeks now takes 3 days. The compliance features give us complete peace of mind.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pharma-blue rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  SJ
                </div>
                <div>
                  <div className="font-semibold text-pharma-slate">Sarah Johnson</div>
                  <div className="text-sm text-pharma-gray">Director, Medical Affairs at Pfizer</div>
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
                &ldquo;The automated claim extraction is incredibly accurate. It catches things our reviewers
                might miss and ensures our materials are always FDA-compliant.&rdquo;
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-pharma-green rounded-full flex items-center justify-center text-white font-semibold mr-3">
                  MR
                </div>
                <div>
                  <div className="font-semibold text-pharma-slate">Michael Rodriguez</div>
                  <div className="text-sm text-pharma-gray">VP Regulatory Affairs at Novartis</div>
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
  )
}
