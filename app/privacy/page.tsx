export const metadata = {
  title: "Privacy Policy - PromoPack",
  description: "PromoPack's comprehensive privacy policy explaining how we collect, use, and protect your data in compliance with GDPR and HIPAA.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-pharma-slate mb-4">Privacy Policy</h1>
          <p className="text-pharma-gray">
            Last updated: September 29, 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">1. Introduction</h2>
            <p className="text-pharma-gray mb-4">
              PromoPack (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy and ensuring
              compliance with applicable data protection laws, including the General Data Protection
              Regulation (GDPR) and the Health Insurance Portability and Accountability Act (HIPAA).
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our promotional content management platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-pharma-slate mb-3">2.1 Personal Information</h3>
            <p className="text-pharma-gray mb-4">
              We collect personal information that you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 text-pharma-gray mb-4">
              <li>Name, email address, and contact information</li>
              <li>Professional information (job title, company, role)</li>
              <li>Account credentials and authentication data</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Communications you send to us</li>
            </ul>

            <h3 className="text-xl font-semibold text-pharma-slate mb-3">2.2 Usage Data</h3>
            <p className="text-pharma-gray mb-4">
              We automatically collect certain information when you use our platform:
            </p>
            <ul className="list-disc pl-6 text-pharma-gray mb-4">
              <li>Log data (IP address, browser type, pages visited)</li>
              <li>Device information and usage patterns</li>
              <li>Performance metrics and error reports</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>

            <h3 className="text-xl font-semibold text-pharma-slate mb-3">2.3 Health Information</h3>
            <p className="text-pharma-gray mb-4">
              As a healthcare-focused platform, we may process protected health information (PHI)
              including medical claims, references, and promotional content. This data is handled
              with the highest level of security and in full compliance with HIPAA requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">3. How We Use Your Information</h2>
            <p className="text-pharma-gray mb-4">We use collected information for the following purposes:</p>
            <ul className="list-disc pl-6 text-pharma-gray mb-4">
              <li><strong>Service Provision:</strong> To provide, maintain, and improve our platform</li>
              <li><strong>Account Management:</strong> To create and manage your account</li>
              <li><strong>Communication:</strong> To respond to inquiries and provide customer support</li>
              <li><strong>Compliance:</strong> To ensure regulatory compliance and data security</li>
              <li><strong>Analytics:</strong> To understand usage patterns and improve our services</li>
              <li><strong>Legal Obligations:</strong> To comply with legal requirements and protect rights</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">4. Information Sharing and Disclosure</h2>
            <p className="text-pharma-gray mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties
              except in the following circumstances:
            </p>
            <ul className="list-disc pl-6 text-pharma-gray mb-4">
              <li><strong>Service Providers:</strong> Trusted third-party service providers who assist in operating our platform</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Consent:</strong> With your explicit consent</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">5. Data Security</h2>
            <p className="text-pharma-gray mb-4">
              We implement comprehensive security measures to protect your information:
            </p>
            <ul className="list-disc pl-6 text-pharma-gray mb-4">
              <li>End-to-end encryption for data in transit and at rest</li>
              <li>Regular security audits and penetration testing</li>
              <li>Access controls and role-based permissions</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">6. Your Rights Under GDPR</h2>
            <p className="text-pharma-gray mb-4">
              If you are located in the European Economic Area, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-pharma-gray mb-4">
              <li><strong>Access:</strong> Request access to your personal data</li>
              <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Restriction:</strong> Request limitation of processing</li>
              <li><strong>Portability:</strong> Request transfer of your data</li>
              <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
            </ul>
            <p className="text-pharma-gray">
              To exercise these rights, please contact us at privacy@promopack.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">7. Data Retention</h2>
            <p className="text-pharma-gray mb-4">
              We retain your personal information for as long as necessary to provide our services,
              comply with legal obligations, resolve disputes, and enforce our agreements. Specific
              retention periods vary depending on the type of data and applicable regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">8. International Data Transfers</h2>
            <p className="text-pharma-gray mb-4">
              Your information may be transferred to and processed in countries other than your own.
              We ensure appropriate safeguards are in place for such transfers, including standard
              contractual clauses approved by the European Commission.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">9. Cookies and Tracking</h2>
            <p className="text-pharma-gray mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage,
              and provide personalized content. You can control cookie preferences through your
              browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">10. Third-Party Services</h2>
            <p className="text-pharma-gray mb-4">
              Our platform integrates with third-party services for payment processing, file storage,
              and analytics. These services have their own privacy policies, and we encourage you
              to review them.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">11. Children&apos;s Privacy</h2>
            <p className="text-pharma-gray mb-4">
              Our services are not intended for individuals under 18 years of age. We do not
              knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">12. Changes to This Policy</h2>
            <p className="text-pharma-gray mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any
              material changes by posting the new policy on this page and updating the &ldquo;Last updated&rdquo; date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">13. Contact Us</h2>
            <p className="text-pharma-gray mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-pharma-gray-light/30 p-6 rounded-lg">
              <p className="text-pharma-gray mb-2"><strong>Email:</strong> privacy@promopack.com</p>
              <p className="text-pharma-gray mb-2"><strong>Phone:</strong> +1 (555) PROMO-01</p>
              <p className="text-pharma-gray mb-2"><strong>Address:</strong> 123 Pharma Plaza, Cambridge, MA 02139</p>
              <p className="text-pharma-gray"><strong>Data Protection Officer:</strong> dpo@promopack.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}