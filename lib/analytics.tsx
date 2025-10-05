'use client'

import Script from 'next/script'

export function GoogleAnalytics({ gaId }: { gaId: string }) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}

// Event tracking helper
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    ;(window as any).gtag('event', eventName, params)
  }
}

// Common event trackers
export const trackSignup = (method: string) => {
  trackEvent('sign_up', { method })
}

export const trackDemo = () => {
  trackEvent('demo_started', {
    event_category: 'engagement',
    event_label: 'Free Demo'
  })
}

export const trackPricing = (plan: string) => {
  trackEvent('view_pricing', {
    event_category: 'conversion',
    plan_name: plan
  })
}

export const trackBlogRead = (title: string) => {
  trackEvent('blog_read', {
    event_category: 'content',
    blog_title: title
  })
}
