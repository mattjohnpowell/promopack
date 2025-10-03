"use client"

import { useState } from "react"
import Link from "next/link"

export default function HelpPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index)
  }

  const faqs = [
    {
      question: "How do I get started with PromoPack?",
      answer: "Getting started is easy! Sign up for a free account, then try our interactive demo to explore the platform. For full access, choose a plan that fits your needs. Our onboarding team will guide you through setup and provide training tailored to your team's workflow."
    },
    {
      question: "What file formats does PromoPack support?",
      answer: "PromoPack supports PDF files for both source documents and references. This ensures compatibility with regulatory requirements and maintains document integrity. We're working on expanding support for additional formats in future updates."
    },
    {
      question: "How accurate is the AI claim extraction?",
      answer: "Our AI achieves over 95% accuracy in claim extraction from well-structured pharmaceutical documents. However, all extracted claims are presented for human review and validation before final use. The system learns from corrections to improve accuracy over time."
    },
    {
      question: "Is PromoPack HIPAA compliant?",
      answer: "Yes, PromoPack is fully HIPAA compliant. We use enterprise-grade encryption, secure data handling practices, and maintain strict access controls. Our platform is designed specifically for healthcare and pharmaceutical data handling."
    },
    {
      question: "Can multiple team members work on the same project?",
      answer: "Absolutely! PromoPack supports real-time collaboration. You can invite team members to projects with different permission levels (viewer, editor, admin). All changes are tracked with audit trails for compliance."
    },
    {
      question: "How do I ensure my promotional materials are FDA compliant?",
      answer: "PromoPack includes built-in compliance checking against FDA guidelines and PhRMA Code requirements. The system validates claims, ensures proper referencing, and flags potential compliance issues. However, final regulatory approval remains your responsibility."
    },
    {
      question: "What happens to my data if I cancel my subscription?",
      answer: "You can export all your projects and data before cancellation. We retain data for 30 days after cancellation in case you wish to restore your account. After this period, data is permanently deleted in accordance with our retention policies."
    },
    {
      question: "Do you offer enterprise solutions?",
      answer: "Yes! We provide enterprise solutions including SSO integration, custom security configurations, dedicated support, volume pricing, and API access. Contact our sales team to discuss your specific enterprise requirements."
    },
    {
      question: "How do I upload and organize my documents?",
      answer: "Use the file upload area to drag and drop your PDF documents. You can create projects to organize related documents, and tag them as either 'Source' (containing claims) or 'Reference' (supporting documentation). The system automatically processes PDFs for claim extraction."
    },
    {
      question: "Can I customize the generated PDF packs?",
      answer: "Yes, you can customize PDF output including branding, watermarks, and layout preferences. Enterprise customers have additional customization options available through our professional services team."
    }
  ]

  const tutorials = [
    {
      title: "Getting Started Guide",
      description: "Complete walkthrough of setting up your account and first project",
      duration: "10 min",
      level: "Beginner"
    },
    {
      title: "Document Upload & Organization",
      description: "How to upload, organize, and manage your pharmaceutical documents",
      duration: "8 min",
      level: "Beginner"
    },
    {
      title: "Claim Extraction & Validation",
      description: "Understanding how AI extracts claims and how to validate them",
      duration: "12 min",
      level: "Intermediate"
    },
    {
      title: "Reference Linking Best Practices",
      description: "Expert techniques for linking claims to supporting references",
      duration: "15 min",
      level: "Intermediate"
    },
    {
      title: "Compliance Checking Workflow",
      description: "How to use PromoPack's compliance tools effectively",
      duration: "10 min",
      level: "Advanced"
    },
    {
      title: "Team Collaboration Features",
      description: "Managing projects with multiple team members and reviewers",
      duration: "8 min",
      level: "Intermediate"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pharma-blue/5 via-white to-pharma-green/5 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-pharma-slate mb-6">
            Help Center
          </h1>
          <p className="text-xl text-pharma-gray max-w-3xl mx-auto">
            Find answers, learn best practices, and get the most out of PromoPack
            for your pharmaceutical content creation needs.
          </p>
        </div>
      </section>

      {/* Search & Quick Actions */}
      <section className="py-12 bg-pharma-gray-light/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">How can we help?</h2>
            <div className="max-w-md mx-auto">
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full px-4 py-3 border border-pharma-gray-light rounded-lg focus:ring-2 focus:ring-pharma-blue focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link href="#faq" className="bg-white p-6 rounded-lg shadow-sm border border-pharma-gray-light hover:shadow-md transition-shadow text-center">
              <svg className="w-8 h-8 text-pharma-blue mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-semibold text-pharma-slate mb-2">FAQ</h3>
              <p className="text-pharma-gray text-sm">Quick answers to common questions</p>
            </Link>

            <Link href="#tutorials" className="bg-white p-6 rounded-lg shadow-sm border border-pharma-gray-light hover:shadow-md transition-shadow text-center">
              <svg className="w-8 h-8 text-pharma-green mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="font-semibold text-pharma-slate mb-2">Video Tutorials</h3>
              <p className="text-pharma-gray text-sm">Step-by-step video guides</p>
            </Link>

            <Link href="/contact" className="bg-white p-6 rounded-lg shadow-sm border border-pharma-gray-light hover:shadow-md transition-shadow text-center">
              <svg className="w-8 h-8 text-pharma-blue mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <h3 className="font-semibold text-pharma-slate mb-2">Contact Support</h3>
              <p className="text-pharma-gray text-sm">Get help from our experts</p>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-pharma-gray">
              Everything you need to know about PromoPack
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border border-pharma-gray-light rounded-lg">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-pharma-gray-light/30 transition-colors"
                >
                  <span className="font-semibold text-pharma-slate">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-pharma-gray transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFAQ === index && (
                  <div className="px-6 pb-4">
                    <p className="text-pharma-gray">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials Section */}
      <section id="tutorials" className="py-20 bg-pharma-gray-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Video Tutorials</h2>
            <p className="text-xl text-pharma-gray">
              Learn PromoPack with our comprehensive video guides
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-pharma-gray-light hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-pharma-blue/10 rounded-lg flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-pharma-blue">{tutorial.level}</span>
                      <span className="text-sm text-pharma-gray">{tutorial.duration}</span>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-pharma-slate mb-2">{tutorial.title}</h3>
                <p className="text-pharma-gray text-sm mb-4">{tutorial.description}</p>
                <button className="w-full bg-pharma-blue text-white py-2 px-4 rounded-lg hover:bg-pharma-blue-dark transition-colors text-sm font-medium">
                  Watch Tutorial
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-pharma-slate mb-4">Additional Resources</h2>
            <p className="text-xl text-pharma-gray">
              More ways to get the most out of PromoPack
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Documentation</h3>
              <p className="text-pharma-gray text-sm mb-4">
                Comprehensive guides and API references
              </p>
              <button className="text-pharma-blue hover:text-pharma-blue-dark font-medium">
                View Docs →
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Best Practices</h3>
              <p className="text-pharma-gray text-sm mb-4">
                Industry tips for compliant content creation
              </p>
              <button className="text-pharma-blue hover:text-pharma-blue-dark font-medium">
                Learn More →
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Community</h3>
              <p className="text-pharma-gray text-sm mb-4">
                Connect with other PromoPack users
              </p>
              <button className="text-pharma-blue hover:text-pharma-blue-dark font-medium">
                Join Community →
              </button>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pharma-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pharma-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pharma-slate mb-2">Newsletter</h3>
              <p className="text-pharma-gray text-sm mb-4">
                Stay updated with latest features and tips
              </p>
              <button className="text-pharma-blue hover:text-pharma-blue-dark font-medium">
                Subscribe →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-r from-pharma-blue to-pharma-blue-dark">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl text-pharma-blue-light mb-8">
            Our support team is here to help you succeed with PromoPack.
            Get in touch for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-white text-pharma-blue px-8 py-4 rounded-lg font-semibold hover:bg-pharma-gray-light transition-colors">
              Contact Support
            </Link>
            <a href="tel:+1-555-PROMO-01" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-pharma-blue transition-colors">
              Call Us: +1 (555) PROMO-01
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}