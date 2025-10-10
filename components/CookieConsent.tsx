"use client"

import { useState, useEffect } from 'react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      // Small delay to avoid layout shift on page load
      setTimeout(() => setShowBanner(true), 1000)
    } else {
      // Apply existing consent settings
      applyConsent(consent)
    }
  }, [])

  const applyConsent = (consentType: string) => {
    if (consentType === 'all') {
      // Enable analytics if you add Google Analytics later
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          analytics_storage: 'granted',
          ad_storage: 'denied', // We don't use ads
          ad_user_data: 'denied',
          ad_personalization: 'denied'
        })
      }
    }
  }

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all')
    applyConsent('all')
    setShowBanner(false)
  }

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential')
    setShowBanner(false)
    
    // Deny analytics
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      })
    }
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 md:p-6 z-50 shadow-2xl border-t-2 border-blue-500 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🍪</span>
            <div>
              <h3 className="font-semibold text-lg mb-1">We Value Your Privacy</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                We use essential cookies to make our site work and optional cookies to enhance your experience. 
                Your data is encrypted and never shared with third parties.{' '}
                <a href="/privacy" className="underline hover:text-blue-400 transition-colors">
                  Learn more in our Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={acceptEssential}
            className="px-6 py-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium border border-gray-600 w-full sm:w-auto"
          >
            Essential Only
          </button>
          <button
            onClick={acceptAll}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-lg w-full sm:w-auto"
          >
            Accept All Cookies
          </button>
        </div>
      </div>
    </div>
  )
}
