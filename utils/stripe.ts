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
