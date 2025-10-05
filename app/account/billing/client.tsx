'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { formatCurrency } from '@/utils/stripe'

interface SubscriptionData {
  hasActiveSubscription: boolean
  subscription: {
    id: string
    status: string
    priceId: string
    interval: string
    seatCount: number
    startedAt: Date
    canceledAt: Date | null
  } | null
}

interface BillingPageClientProps {
  subscriptionData: SubscriptionData
  createBillingPortalSession: (returnUrl?: string) => Promise<{ url: string }>
}

export function BillingPageClient({ 
  subscriptionData, 
  createBillingPortalSession 
}: BillingPageClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { hasActiveSubscription, subscription } = subscriptionData

  const handleManageBilling = async () => {
    setIsLoading(true)
    try {
      const { url } = await createBillingPortalSession(window.location.href)
      window.location.href = url
    } catch (error) {
      console.error('Error opening billing portal:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to open billing portal')
      setIsLoading(false)
    }
  }

  if (!hasActiveSubscription) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No active subscription</h3>
        <p className="mt-1 text-sm text-gray-500">
          You don&apos;t have an active subscription. Choose a plan to get started.
        </p>
        <div className="mt-6">
          <a
            href="/pricing"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Plans
          </a>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    trialing: 'bg-blue-100 text-blue-800',
    past_due: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-red-100 text-red-800',
    incomplete: 'bg-gray-100 text-gray-800',
  }

  const statusColor = statusColors[subscription?.status || 'active'] || 'bg-gray-100 text-gray-800'

  return (
    <div>
      {/* Current Subscription */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Subscription</h2>
        
        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {subscription?.interval === 'year' ? 'Annual' : 'Monthly'} Plan
                </h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                  {subscription?.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
              
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">Billing cycle:</dt>
                  <dd className="text-gray-900 font-medium capitalize">{subscription?.interval}ly</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Seats:</dt>
                  <dd className="text-gray-900 font-medium">{subscription?.seatCount}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">Started:</dt>
                  <dd className="text-gray-900 font-medium">
                    {subscription?.startedAt ? new Date(subscription.startedAt).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
                {subscription?.canceledAt && (
                  <div className="flex justify-between">
                    <dt className="text-gray-500">Canceled on:</dt>
                    <dd className="text-gray-900 font-medium">
                      {new Date(subscription.canceledAt).toLocaleDateString()}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleManageBilling}
              disabled={isLoading}
              className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading...
                </>
              ) : (
                'Manage Subscription & Payment Methods'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Billing Portal</h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Use the billing portal to update your payment method, view invoices, 
                change your plan, or cancel your subscription.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
