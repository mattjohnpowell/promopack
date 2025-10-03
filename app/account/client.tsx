"use client"

import { useEffect } from "react"
import { User, Account, Subscription, Invoice, Seat } from "@prisma/client"
import toast from "react-hot-toast"

interface AccountClientProps {
  user: User & {
    account: (Account & {
      subscriptions: (Subscription & { seats: Seat[] })[]
      invoices: Invoice[]
    }) | null
  }
  success: boolean
  sessionId?: string
}

export function AccountClient({ user, success }: AccountClientProps) {

  useEffect(() => {
    if (success) {
      toast.success("Subscription activated successfully!")
    }
  }, [success])

  const currentSubscription = user.account?.subscriptions.find(
    sub => sub.status === 'active' || sub.status === 'trialing'
  )

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: currency === 'usd' ? 'USD' : 'GBP'
    }).format(amount / 100)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Dashboard</h1>
          <p className="text-lg text-gray-600">Manage your subscription and billing</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Subscription Status */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card-professional p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Current Plan</h2>

              {currentSubscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {currentSubscription.interval === 'month' ? 'Monthly' : 'Yearly'} Plan
                      </h3>
                      <p className="text-gray-600">
                        {currentSubscription.seatCount} seat{currentSubscription.seatCount > 1 ? 's' : ''}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      currentSubscription.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : currentSubscription.status === 'trialing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {currentSubscription.status === 'trialing' ? 'Trial' : currentSubscription.status}
                    </span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Started</p>
                        <p className="font-medium">{formatDate(currentSubscription.startedAt)}</p>
                      </div>
                      {currentSubscription.canceledAt && (
                        <div>
                          <p className="text-sm text-gray-600">Cancels</p>
                          <p className="font-medium">{formatDate(currentSubscription.canceledAt)}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button className="btn-secondary">
                      Change Plan
                    </button>
                    <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50">
                      Cancel Subscription
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 mb-4">Choose a plan to get started with automated reference pack creation.</p>
                  <a href="/pricing" className="btn-primary">
                    View Pricing
                  </a>
                </div>
              )}
            </div>

            {/* Recent Invoices */}
            <div className="card-professional p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Invoices</h2>

              {user.account?.invoices.length ? (
                <div className="space-y-4">
                  {user.account.invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          Invoice {invoice.number || invoice.id.slice(-8)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(invoice.issuedAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {formatCurrency(invoice.amount, invoice.currency)}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8">No invoices yet</p>
              )}
            </div>
          </div>

          {/* Account Info Sidebar */}
          <div className="space-y-6">
            <div className="card-professional p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.account && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-medium">{user.account.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Billing Email</p>
                      <p className="font-medium">{user.account.billingEmail || user.email}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="card-professional p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Usage This Month</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects Created</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Packs Generated</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Documents Processed</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </div>

            <div className="card-professional p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Support</h3>
              <p className="text-gray-600 text-sm mb-4">
                Need help? Contact our support team.
              </p>
              <button className="btn-secondary w-full">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}