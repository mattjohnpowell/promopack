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
            Last updated: October 10, 2025
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>🔒 Your Privacy Matters:</strong> We are committed to enterprise-grade security, 
              GDPR compliance, and never sharing your data with third parties. 
              <a href="/account/data" className="underline ml-1 font-semibold hover:text-blue-700">
                Manage your data →
              </a>
            </p>
          </div>
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
              If you are located in the European Economic Area or UK, you have the following rights 
              under the General Data Protection Regulation (GDPR):
            </p>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">✨ Self-Service Data Tools Available</h3>
              <p className="text-sm text-green-800 mb-3">
                We&apos;ve made it easy to exercise your rights. Visit your{' '}
                <a href="/account/data" className="underline font-semibold hover:text-green-900">
                  Data Management page
                </a>
                {' '}to export or delete your data instantly.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-pharma-slate mb-2">
                  1. Right to Access (Article 15)
                </h4>
                <p className="text-pharma-gray text-sm mb-2">
                  You have the right to request a copy of all personal data we hold about you.
                </p>
                <p className="text-sm">
                  <a href="/account/data" className="text-blue-600 hover:underline font-medium">
                    → Download your data now
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-pharma-slate mb-2">
                  2. Right to Rectification (Article 16)
                </h4>
                <p className="text-pharma-gray text-sm mb-2">
                  You have the right to request correction of inaccurate or incomplete personal data.
                </p>
                <p className="text-sm">
                  <a href="/account" className="text-blue-600 hover:underline font-medium">
                    → Update your account details
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-pharma-slate mb-2">
                  3. Right to Erasure / &quot;Right to be Forgotten&quot; (Article 17)
                </h4>
                <p className="text-pharma-gray text-sm mb-2">
                  You have the right to request deletion of your personal data. We will permanently delete 
                  your account and all associated data within 30 days.
                </p>
                <p className="text-sm">
                  <a href="/account/data" className="text-blue-600 hover:underline font-medium">
                    → Delete your account
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-pharma-slate mb-2">
                  4. Right to Data Portability (Article 20)
                </h4>
                <p className="text-pharma-gray text-sm mb-2">
                  You have the right to receive your personal data in a machine-readable format (JSON) 
                  and transmit it to another service provider.
                </p>
                <p className="text-sm">
                  <a href="/account/data" className="text-blue-600 hover:underline font-medium">
                    → Export your data as JSON
                  </a>
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-pharma-slate mb-2">
                  5. Right to Restrict Processing (Article 18)
                </h4>
                <p className="text-pharma-gray text-sm mb-2">
                  You have the right to request limitation of how we process your data.
                </p>
                <p className="text-sm text-pharma-gray">
                  Contact: privacy@promopack.io
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-pharma-slate mb-2">
                  6. Right to Object (Article 21)
                </h4>
                <p className="text-pharma-gray text-sm mb-2">
                  You have the right to object to processing based on legitimate interests, direct marketing, 
                  or processing for scientific/historical research purposes.
                </p>
                <p className="text-sm text-pharma-gray">
                  Contact: privacy@promopack.io
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-pharma-slate mb-2">
                  7. Rights Related to Automated Decision-Making (Article 22)
                </h4>
                <p className="text-pharma-gray text-sm">
                  You have the right not to be subject to decisions based solely on automated processing. 
                  Our AI-powered features are tools to assist you, not replace human decision-making.
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>⚡ Response Time:</strong> We will respond to your requests within 30 days as required by GDPR. 
                For urgent matters, contact us at <a href="mailto:privacy@promopack.io" className="underline font-semibold">privacy@promopack.io</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">7. Data Retention</h2>
            <p className="text-pharma-gray mb-4">
              We retain your personal information only for as long as necessary to provide our services,
              comply with legal obligations, resolve disputes, and enforce our agreements.
            </p>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-pharma-slate mb-4">Specific Retention Periods:</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-pharma-gray font-medium">Active account data:</span>
                  <span className="text-pharma-slate">Retained while subscription is active</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-pharma-gray font-medium">Inactive projects:</span>
                  <span className="text-pharma-slate">Deleted after 2 years of inactivity</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-pharma-gray font-medium">Deleted accounts:</span>
                  <span className="text-pharma-slate">Permanently removed within 30 days</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-pharma-gray font-medium">Billing records:</span>
                  <span className="text-pharma-slate">7 years (tax/legal requirements)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-pharma-gray font-medium">Server logs:</span>
                  <span className="text-pharma-slate">90 days (security purposes)</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-pharma-gray font-medium">Analytics data:</span>
                  <span className="text-pharma-slate">14 months (Google Analytics default)</span>
                </div>
              </div>
            </div>

            <p className="text-pharma-gray mt-4 text-sm">
              You can request early deletion of your data at any time by visiting your{' '}
              <a href="/account/data" className="text-blue-600 hover:underline font-medium">
                Data Management page
              </a>.
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
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">9. Cookies and Tracking Technologies</h2>
            <p className="text-pharma-gray mb-4">
              We use cookies and similar technologies to enhance your experience, analyze usage,
              and provide personalized content. You can control cookie preferences through the 
              cookie banner that appears on your first visit.
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-pharma-slate mb-2">Essential Cookies (Always Active)</h3>
                <p className="text-pharma-gray text-sm mb-2">
                  These cookies are necessary for the website to function and cannot be disabled:
                </p>
                <ul className="list-disc pl-6 text-pharma-gray text-sm space-y-1">
                  <li>Authentication and session management</li>
                  <li>Security and fraud prevention</li>
                  <li>Load balancing and performance</li>
                  <li>Cookie consent preferences</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-pharma-slate mb-2">Analytics Cookies (Optional)</h3>
                <p className="text-pharma-gray text-sm mb-2">
                  These cookies help us understand how visitors interact with our website:
                </p>
                <ul className="list-disc pl-6 text-pharma-gray text-sm space-y-1">
                  <li>Google Analytics (anonymized IP addresses)</li>
                  <li>Page view tracking</li>
                  <li>Feature usage statistics</li>
                  <li>Performance monitoring</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>🍪 Manage Cookies:</strong> You can change your cookie preferences at any time by 
                  clearing your browser&apos;s cookies and reloading the page. The cookie banner will appear again.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-pharma-slate mb-4">10. Third-Party Services & Subprocessors</h2>
            <p className="text-pharma-gray mb-4">
              Our platform integrates with trusted third-party services to provide our functionality. 
              All subprocessors have signed Data Processing Agreements (DPAs) and are GDPR compliant.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-pharma-slate mb-4">Current Subprocessors:</h3>
              <div className="space-y-3 text-sm">
                <div className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-pharma-slate">Supabase</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">DPA ✓</span>
                  </div>
                  <p className="text-pharma-gray text-xs">Database hosting and file storage (encrypted at rest)</p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-pharma-slate">Stripe</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">DPA ✓</span>
                  </div>
                  <p className="text-pharma-gray text-xs">Payment processing (PCI DSS Level 1 certified)</p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-pharma-slate">Vercel / Coolify</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">DPA ✓</span>
                  </div>
                  <p className="text-pharma-gray text-xs">Application hosting and CDN</p>
                </div>

                <div className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-pharma-slate">Google Analytics</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">DPA ✓</span>
                  </div>
                  <p className="text-pharma-gray text-xs">Usage analytics (anonymized, optional via cookie consent)</p>
                </div>

                <div className="pb-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-pharma-slate">Custom Extractor Service</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Internal</span>
                  </div>
                  <p className="text-pharma-gray text-xs">AI-powered claim extraction (self-hosted, no third-party data sharing)</p>
                </div>
              </div>
            </div>

            <p className="text-pharma-gray mt-4 text-sm">
              <strong>Important:</strong> We do not sell, rent, or share your personal data with third parties for 
              their marketing purposes. All subprocessors are used solely to deliver our service to you.
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
            <div className="bg-pharma-gray-light/30 p-6 rounded-lg space-y-3">
              <div>
                <p className="text-sm font-semibold text-pharma-slate mb-1">For Privacy Inquiries:</p>
                <p className="text-pharma-gray"><strong>Email:</strong> <a href="mailto:privacy@promopack.io" className="text-blue-600 hover:underline">privacy@promopack.io</a></p>
                <p className="text-pharma-gray text-sm">Response time: Within 30 days (GDPR requirement)</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold text-pharma-slate mb-1">Data Protection Officer:</p>
                <p className="text-pharma-gray"><strong>Email:</strong> <a href="mailto:dpo@promopack.io" className="text-blue-600 hover:underline">dpo@promopack.io</a></p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold text-pharma-slate mb-1">General Support:</p>
                <p className="text-pharma-gray"><strong>Email:</strong> <a href="mailto:support@promopack.io" className="text-blue-600 hover:underline">support@promopack.io</a></p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold text-pharma-slate mb-1">Security Issues:</p>
                <p className="text-pharma-gray"><strong>Email:</strong> <a href="mailto:security@promopack.io" className="text-blue-600 hover:underline">security@promopack.io</a></p>
                <p className="text-pharma-gray text-sm">For responsible disclosure of security vulnerabilities</p>
              </div>

              <div className="border-t pt-3">
                <p className="text-sm font-semibold text-pharma-slate mb-1">Self-Service Tools:</p>
                <p className="text-pharma-gray">
                  <a href="/account/data" className="text-blue-600 hover:underline font-medium">
                    Data Management Page →
                  </a>
                  {' '}(Export or delete your data instantly)
                </p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>🇪🇺 EU Data Protection Supervisory Authority:</strong> If you are not satisfied with our response, 
                you have the right to lodge a complaint with your local data protection authority.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}