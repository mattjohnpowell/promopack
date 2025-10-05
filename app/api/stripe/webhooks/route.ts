/**
 * Stripe Webhook Handler
 * 
 * This endpoint receives webhook events from Stripe and handles:
 * - Subscription lifecycle (created, updated, deleted)
 * - Payment events (succeeded, failed)
 * - Invoice events
 * - Customer updates
 * 
 * Important: This endpoint must be publicly accessible (not behind auth).
 * Stripe webhook signing verifies authenticity of requests.
 */

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { stripe, webhookSecret } from '@/utils/stripe';
import { prisma } from '@/utils/db';
import Stripe from 'stripe';

/**
 * POST handler for Stripe webhooks
 */
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    console.error('❌ Missing stripe-signature header');
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    );
  }

  if (!webhookSecret) {
    console.error('❌ Missing STRIPE_WEBHOOK_SECRET environment variable');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: `Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 400 }
    );
  }

  console.log(`✅ Webhook received: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      // Subscription events
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // Payment events
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      // Invoice events
      case 'invoice.created':
      case 'invoice.updated':
        await handleInvoiceUpdated(event.data.object as Stripe.Invoice);
        break;

      // Customer events
      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      default:
        console.log(`ℹ️  Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error(`❌ Error processing webhook ${event.type}:`, err);
    return NextResponse.json(
      { error: `Webhook processing failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

/**
 * Handle subscription created/updated events
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const accountId = subscription.metadata.accountId;

  if (!accountId) {
    console.error('⚠️  Subscription missing accountId metadata:', subscription.id);
    return;
  }

  console.log(`📝 Updating subscription ${subscription.id} for account ${accountId}`);

  // Get the price details
  const priceId = subscription.items.data[0]?.price.id;
  const interval = subscription.items.data[0]?.price.recurring?.interval || 'month';

  await prisma.subscription.upsert({
    where: { stripeId: subscription.id },
    create: {
      stripeId: subscription.id,
      accountId,
      status: subscription.status,
      priceId,
      interval,
      seatCount: subscription.items.data[0]?.quantity || 1,
      startedAt: subscription.start_date ? new Date(subscription.start_date * 1000) : new Date(),
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
    update: {
      status: subscription.status,
      priceId,
      interval,
      seatCount: subscription.items.data[0]?.quantity || 1,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null,
    },
  });

  console.log(`✅ Subscription ${subscription.id} updated`);
}

/**
 * Handle subscription deleted event
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`🗑️  Deleting subscription ${subscription.id}`);

  await prisma.subscription.update({
    where: { stripeId: subscription.id },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  });

  console.log(`✅ Subscription ${subscription.id} marked as canceled`);
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log(`💰 Payment succeeded for invoice ${invoice.id}`);

  // Get account from customer
  const customer = await stripe.customers.retrieve(invoice.customer as string);
  if (customer.deleted) {
    console.error('⚠️  Customer deleted:', invoice.customer);
    return;
  }

  const accountId = customer.metadata.accountId;
  if (!accountId) {
    console.error('⚠️  Customer missing accountId metadata:', invoice.customer);
    return;
  }

  // Fetch expanded invoice to get charge info
  if (!invoice.id) return;
  const expandedInvoice = await stripe.invoices.retrieve(invoice.id, {
    expand: ['charge'],
  });

  // Create or update invoice record
  await prisma.invoice.upsert({
    where: { stripeId: invoice.id },
    create: {
      stripeId: invoice.id,
      accountId,
      number: invoice.number || undefined,
      amount: invoice.amount_paid,
      currency: invoice.currency.toUpperCase(),
      status: 'paid',
      issuedAt: new Date(invoice.created * 1000),
      pdfUrl: invoice.invoice_pdf || undefined,
    },
    update: {
      status: 'paid',
      pdfUrl: invoice.invoice_pdf || undefined,
    },
  });

  // Record payment if there's a charge
  const charge = (expandedInvoice as any).charge;
  const chargeId = typeof charge === 'string' ? charge : charge?.id;
  if (chargeId) {
    await prisma.payment.upsert({
      where: { stripeId: chargeId },
      create: {
        stripeId: chargeId,
        invoiceId: (await prisma.invoice.findUnique({ where: { stripeId: invoice.id } }))!.id,
        amount: invoice.amount_paid,
        currency: invoice.currency.toUpperCase(),
        method: 'card',
        status: 'succeeded',
        paidAt: new Date(),
      },
      update: {
        status: 'succeeded',
        paidAt: new Date(),
      },
    });
  }

  console.log(`✅ Payment recorded for invoice ${invoice.id}`);
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`❌ Payment failed for invoice ${invoice.id}`);

  const customer = await stripe.customers.retrieve(invoice.customer as string);
  if (customer.deleted) {
    console.error('⚠️  Customer deleted:', invoice.customer);
    return;
  }

  const accountId = customer.metadata.accountId;
  if (!accountId) {
    console.error('⚠️  Customer missing accountId metadata:', invoice.customer);
    return;
  }

  // Update invoice status
  await prisma.invoice.upsert({
    where: { stripeId: invoice.id },
    create: {
      stripeId: invoice.id,
      accountId,
      number: invoice.number || undefined,
      amount: invoice.amount_due,
      currency: invoice.currency.toUpperCase(),
      status: 'payment_failed',
      issuedAt: new Date(invoice.created * 1000),
      pdfUrl: invoice.invoice_pdf || undefined,
    },
    update: {
      status: 'payment_failed',
    },
  });

  // TODO: Send email notification to customer about failed payment

  console.log(`✅ Failed payment recorded for invoice ${invoice.id}`);
}

/**
 * Handle invoice created/updated events
 */
async function handleInvoiceUpdated(invoice: Stripe.Invoice) {
  console.log(`📄 Invoice ${invoice.id} ${invoice.status}`);

  const customer = await stripe.customers.retrieve(invoice.customer as string);
  if (customer.deleted) {
    console.error('⚠️  Customer deleted:', invoice.customer);
    return;
  }

  const accountId = customer.metadata.accountId;
  if (!accountId) {
    console.error('⚠️  Customer missing accountId metadata:', invoice.customer);
    return;
  }

  await prisma.invoice.upsert({
    where: { stripeId: invoice.id },
    create: {
      stripeId: invoice.id,
      accountId,
      number: invoice.number || undefined,
      amount: invoice.amount_due,
      currency: invoice.currency.toUpperCase(),
      status: invoice.status || 'draft',
      dueDate: invoice.due_date ? new Date(invoice.due_date * 1000) : undefined,
      issuedAt: new Date(invoice.created * 1000),
      pdfUrl: invoice.invoice_pdf || undefined,
    },
    update: {
      status: invoice.status || 'draft',
      pdfUrl: invoice.invoice_pdf || undefined,
      number: invoice.number || undefined,
    },
  });

  console.log(`✅ Invoice ${invoice.id} updated`);
}

/**
 * Handle customer updated events
 */
async function handleCustomerUpdated(customer: Stripe.Customer) {
  const accountId = customer.metadata.accountId;

  if (!accountId) {
    console.log('ℹ️  Customer missing accountId metadata, skipping');
    return;
  }

  console.log(`👤 Updating customer ${customer.id} for account ${accountId}`);

  await prisma.account.update({
    where: { id: accountId },
    data: {
      billingEmail: customer.email || undefined,
      name: customer.name || undefined,
    },
  });

  console.log(`✅ Customer ${customer.id} updated`);
}
