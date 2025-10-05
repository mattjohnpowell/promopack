/**
 * Stripe server-side configuration and utilities.
 * 
 * This module provides the initialized Stripe client for server-side operations
 * including checkout sessions, subscriptions, invoices, and customer portal access.
 * 
 * Environment variables required:
 * - STRIPE_SECRET_KEY: Stripe API secret key (live or test mode)
 * - STRIPE_WEBHOOK_SECRET: Webhook signing secret for verifying webhook events
 */

import Stripe from 'stripe';

// Validate that required environment variables are present
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY');
}

/**
 * Initialized Stripe client instance.
 * Uses the latest API version and includes app metadata.
 */
export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-08-27.basil', // Use latest stable API version
  typescript: true,
  appInfo: {
    name: 'PromoPack',
    version: '0.1.0',
  },
});

/**
 * Webhook secret for verifying Stripe webhook signatures.
 * This ensures webhook events are genuinely from Stripe.
 */
export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

/**
 * Helper to format currency amounts.
 * Stripe amounts are in cents, so we divide by 100 for display.
 */
export function formatCurrency(amountInCents: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amountInCents / 100);
}

/**
 * Helper to get or create a Stripe customer for a user account.
 * This function checks if the account already has a Stripe customer ID,
 * creates one if not, and returns the customer ID.
 */
export async function getOrCreateStripeCustomer(params: {
  accountId: string;
  email: string;
  name?: string;
}): Promise<string> {
  const { accountId, email, name } = params;
  
  // Import prisma here to avoid circular dependencies
  const { prisma } = await import('./db');
  
  // Check if account already has a Stripe customer
  const account = await prisma.account.findUnique({
    where: { id: accountId },
    select: { companyId: true }, // We'll use companyId to store Stripe customer ID
  });
  
  if (account?.companyId) {
    // Verify the customer still exists in Stripe
    try {
      await stripe.customers.retrieve(account.companyId);
      return account.companyId;
    } catch (error) {
      console.error('Stripe customer not found, creating new one:', error);
    }
  }
  
  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: {
      accountId,
    },
  });
  
  // Store customer ID in account.companyId (repurposing this field)
  await prisma.account.update({
    where: { id: accountId },
    data: { companyId: customer.id },
  });
  
  return customer.id;
}

/**
 * Product IDs and Price IDs for PromoPack tiers.
 * These should match the products created in your Stripe dashboard.
 * Update these after creating products in Stripe.
 */
export const STRIPE_PRODUCTS = {
  STARTER: {
    // Update these with actual Stripe product/price IDs
    MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || '',
    ANNUAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL || '',
  },
  PROFESSIONAL: {
    MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY || '',
    ANNUAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL || '',
  },
  ENTERPRISE: {
    // Enterprise uses custom pricing, typically handled via invoices
    MONTHLY: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    ANNUAL: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL || '',
  },
} as const;

/**
 * Handle Stripe webhook events.
 * Processes subscription lifecycle events to keep database in sync with Stripe.
 */
export async function handleStripeWebhook(signature: string, payload: Buffer) {
  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable')
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err: any) {
    throw new Error(`Webhook signature verification failed: ${err.message}`)
  }

  // Import prisma here to avoid circular dependencies
  const { prisma } = await import('./db')

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session

      if (session.metadata?.accountId) {
        await prisma.account.update({
          where: { id: session.metadata.accountId },
          data: {
            companyId: session.customer as string, // Store Stripe customer ID
          },
        })
      }
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription

      // Find account by Stripe customer ID
      const account = await prisma.account.findFirst({
        where: { companyId: subscription.customer as string },
      })

      if (account) {
        // Update subscription status in database
        // You may want to add a subscription table to track this properly
        await prisma.account.update({
          where: { id: account.id },
          data: {
            // Store subscription status in a field (you may need to add this to your schema)
            // For now, we'll just log it
          },
        })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription

      const account = await prisma.account.findFirst({
        where: { companyId: subscription.customer as string },
      })

      if (account) {
        // Handle subscription cancellation
        // Update account status, disable features, etc.
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      // Handle successful payment
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      // Handle failed payment - notify user, suspend service, etc.
      break
    }
  }

  return { received: true }
}
