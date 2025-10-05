import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { getSubscriptionStatus, createBillingPortalSession } from '@/app/actions'
import { BillingPageClient } from './client'

export default async function BillingPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/auth')
  }

  // Get subscription status
  const subscriptionData = await getSubscriptionStatus()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Billing & Subscription</h1>
            
            <BillingPageClient 
              subscriptionData={subscriptionData}
              createBillingPortalSession={createBillingPortalSession}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
