import { Metadata } from 'next'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://promopack.io'
const siteName = 'PromoPack'
const siteDescription = 'Transform pharmaceutical promotional content creation with AI-powered claim extraction, automated reference linking, and built-in FDA compliance. Trusted by medical affairs teams to reduce review cycles by 75%.'

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - FDA-Compliant Pharmaceutical Promotional Content Platform`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'pharmaceutical promotional content',
    'medical affairs software',
    'FDA compliant marketing',
    'claim extraction',
    'reference linking',
    'regulatory compliance software',
    'pharma marketing automation',
    'medical writing software',
    'promotional material review',
    'pharmaceutical documentation',
    'MLR software',
    'medical legal regulatory review',
    'pharma content management',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName,
    title: `${siteName} - FDA-Compliant Pharmaceutical Promotional Content Platform`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Pharmaceutical Promotional Content Management`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - FDA-Compliant Pharmaceutical Promotional Content Platform`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: '@promopack',
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
  noIndex = false,
}: {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
}): Metadata {
  const url = `${siteUrl}${path}`
  const ogImage = image || `${siteUrl}/og-image.png`

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: ogImage }],
    },
    twitter: {
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  }
}
