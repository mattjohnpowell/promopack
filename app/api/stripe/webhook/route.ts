import { NextRequest, NextResponse } from 'next/server'
import { handleStripeWebhook } from '@/app/actions'

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature')
    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    const payload = await request.arrayBuffer()
    const result = await handleStripeWebhook(signature, Buffer.from(payload))

    return NextResponse.json(result)
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 400 }
    )
  }
}