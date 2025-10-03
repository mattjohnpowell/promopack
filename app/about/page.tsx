import Link from "next/link"

export const metadata = {
  title: "About PromoPack - Our Mission & Team",
  description: "Learn about PromoPack's mission to revolutionize pharmaceutical promotional content creation with AI-powered compliance and efficiency tools.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pharma-blue/5 via-white to-pharma-green/5 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-pharma-slate mb-6">
            Revolutionizing Pharmaceutical
            <span className="block bg-gradient-to-r from-pharma-blue to-pharma-blue-dark bg-clip-text text-transparent">
              Content Creation
            </span>
          </h1>
          <p className="text-xl text-pharma-gray max-w-3xl mx-auto">
            We&apos;re on a mission to eliminate the bottlenecks in promotional material development,
            ensuring medical affairs teams can focus on science while maintaining perfect compliance.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-pharma-slate mb-6">Our Mission</h2>
              <p className="text-lg text-pharma-gray mb-6">
                In the pharmaceutical industry, time-to-market can mean the difference between
                helping patients and missing opportunities. Yet, creating compliant promotional
                materials remains a painfully manual process.
              </p>
              <p className="text-lg text-pharma-gray mb-6">
                We believe medical affairs professionals should spend their time advancing science,
                not wrestling with paperwork. That&apos;s why we built PromoPack – to automate the
                tedious parts of promotional content creation while ensuring every claim is
                properly referenced and compliant.
              </p>
              <p className="text-lg text-pharma-gray">
                Our AI-powered platform extracts claims automatically, links them to references
                intelligently, and generates regulatory-ready documents in a fraction of the time.
              </p>
            </div>
            <div className="bg-pharma-gray-light/30 p-8 rounded-xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-pharma-blue mb-2">75%</div>
                  <div className="text-pharma-gray">Faster Content Creation</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pharma-green mb-2">100%</div>
                  <div className="text-pharma-gray">Regulatory Compliant</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pharma-blue mb-2">500+</div>
                  <div className="text-pharma-gray">Medical Affairs Teams</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-pharma-green mb-2">24/7</div>
                  <div className="text-pharma-gray">Expert Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Our Story</h2>
            <p className="text-xl text-pharma-gray">
              Born from frustration, built for excellence
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-pharma-blue rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-pharma-slate mb-3">The Problem</h3>
                  <p className="text-pharma-gray">
                    Our founders, former medical affairs directors at major pharma companies,
                    spent countless hours manually extracting claims from source documents,
                    hunting for references, and ensuring FDA compliance. This process took
                    weeks and diverted valuable time from patient-focused work.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-pharma-green rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-pharma-slate mb-3">The Solution</h3>
                  <p className="text-pharma-gray">
                    We combined our deep industry expertise with cutting-edge AI technology
                    to create PromoPack. Our platform automates claim extraction, provides
                    intelligent reference suggestions, and generates compliant promotional
                    materials in days instead of weeks.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-pharma-blue rounded-full flex items-center justify-center text-white font-bold mr-6 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-pharma-slate mb-3">The Impact</h3>
                  <p className="text-pharma-gray">
                    Today, PromoPack serves medical affairs teams at leading pharmaceutical
                    companies worldwide. Our users report 75% faster content creation,
                    improved compliance accuracy, and more time to focus on what matters most:
                    advancing patient care through scientific communication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Leadership Team</h2>
            <p className="text-xl text-pharma-gray">
              Industry veterans committed to transforming pharmaceutical content creation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-pharma-blue to-pharma-blue-dark rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                SJ
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-2">Sarah Johnson</h3>
              <p className="text-pharma-blue font-medium mb-3">CEO & Co-Founder</p>
              <p className="text-pharma-gray text-sm">
                Former Director of Medical Affairs at Pfizer with 15+ years in pharmaceutical
                regulatory affairs and promotional content development.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-pharma-green to-pharma-blue rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                MR
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-2">Michael Rodriguez</h3>
              <p className="text-pharma-blue font-medium mb-3">CTO & Co-Founder</p>
              <p className="text-pharma-gray text-sm">
                Former VP of Regulatory Technology at Novartis. Expert in AI/ML applications
                for life sciences and healthcare compliance automation.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-pharma-blue-dark to-pharma-green rounded-full mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                AL
              </div>
              <h3 className="text-xl font-semibold text-pharma-slate mb-2">Amanda Liu</h3>
              <p className="text-pharma-blue font-medium mb-3">Head of Regulatory Affairs</p>
              <p className="text-pharma-gray text-sm">
                Former FDA regulatory reviewer turned industry consultant. Ensures PromoPack
                meets the highest standards of pharmaceutical compliance and data integrity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Our Values</h2>
            <p className="text-xl text-pharma-gray">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Compliance First</h3>
              <p className="text-pharma-gray text-sm">
                Every feature is designed with regulatory requirements in mind.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Innovation</h3>
              <p className="text-pharma-gray text-sm">
                We leverage cutting-edge AI to solve real industry challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Collaboration</h3>
              <p className="text-pharma-gray text-sm">
                We work closely with our users to build the perfect solution.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Patient Focus</h3>
              <p className="text-pharma-gray text-sm">
                Everything we do ultimately serves patients and healthcare providers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pharma-blue to-pharma-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join the PromoPack Revolution
          </h2>
          <p className="text-xl text-pharma-blue-light mb-8">
            Be part of the future of pharmaceutical content creation.
            Experience the difference PromoPack makes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard?demo=true" className="bg-white text-pharma-blue px-8 py-4 rounded-lg font-semibold hover:bg-pharma-gray-light transition-colors">
              Try Free Demo
            </Link>
            <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-pharma-blue transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}