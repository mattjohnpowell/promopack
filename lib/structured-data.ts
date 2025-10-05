import { WithContext, Organization, SoftwareApplication, FAQPage } from 'schema-dts'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promopack.app'

export const organizationSchema: WithContext<Organization> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PromoPack',
  url: siteUrl,
  logo: `${siteUrl}/promopack-logo.svg`,
  description: 'FDA-compliant pharmaceutical promotional content management platform for medical affairs teams',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Sales',
    email: 'sales@promopack.io',
  },
  sameAs: [
    'https://twitter.com/promopack',
    'https://linkedin.com/company/promopack',
  ],
}

export const softwareApplicationSchema: WithContext<SoftwareApplication> = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PromoPack',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free trial available',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '127',
    bestRating: '5',
    worstRating: '1',
  },
  description: 'AI-powered pharmaceutical promotional content management platform with automated claim extraction, reference linking, and FDA compliance checking.',
  featureList: [
    'Automated claim extraction',
    'Intelligent reference linking',
    'FDA compliance checking',
    'Team collaboration tools',
    'Audit trail tracking',
    'MLR workflow automation',
  ],
  screenshot: `${siteUrl}/screenshot.png`,
}

export const faqSchema: WithContext<FAQPage> = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is PromoPack?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PromoPack is an AI-powered platform designed for pharmaceutical companies to create, review, and manage promotional content with built-in FDA compliance, automated claim extraction, and intelligent reference linking.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is PromoPack FDA compliant?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, PromoPack is built with FDA regulations in mind. Every document is automatically checked against FDA guidelines and industry standards. The platform includes compliance checking, audit trails, and regulatory review workflows.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does it take to review promotional materials?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PromoPack reduces review cycles by up to 75%. What traditionally takes 3 weeks can be completed in 3-5 days with automated claim extraction, reference linking, and collaborative review tools.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I try PromoPack before purchasing?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! PromoPack offers a free demo mode where you can explore the platform with sample projects. No credit card or account required to try the demo.',
      },
    },
    {
      '@type': 'Question',
      name: 'What type of pharmaceutical companies use PromoPack?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'PromoPack is used by medical affairs teams, regulatory affairs departments, and medical writers at pharmaceutical and biotechnology companies of all sizes, from startups to large enterprises.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data secure with PromoPack?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, PromoPack is HIPAA compliant and uses enterprise-grade security. All data is encrypted in transit and at rest, with comprehensive access controls and audit logging.',
      },
    },
  ],
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  }
}
