# Stripe Integration Setup Guide

This guide walks you through setting up Stripe payments for PromoPack.

## Prerequisites

- A Stripe account (sign up at https://stripe.com)
- Access to your Stripe Dashboard
- Node.js and npm installed

## Step 1: Get Your Stripe API Keys

1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Click on **Developers** in the left sidebar
3. Click on **API keys**
4. Copy your **Secret key** (starts with `sk_test_` for test mode or `sk_live_` for live mode)
5. Also note your **Publishable key** (starts with `pk_test_` or `pk_live_`)

## Step 2: Configure Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (set these after creating products in Step 3)
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_xxx
```

## Step 3: Create Products and Prices in Stripe

### Option A: Via Stripe Dashboard (Recommended for beginners)

1. Go to **Products** → **Add product**
2. Create three products:

   **Starter Plan:**
   - Name: `PromoPack Starter`
   - Description: `Perfect for individual brand managers`
   - Create two prices:
     - Monthly: £49/month (or your currency)
     - Annual: £490/year (save 17%)

   **Professional Plan:**
   - Name: `PromoPack Professional`
   - Description: `For individual professionals and consultants`
   - Create two prices:
     - Monthly: £149/month
     - Annual: £1,490/year

   **Enterprise Plan:**
   - Name: `PromoPack Enterprise`
   - Description: `For teams and departments`
   - Create two prices:
     - Monthly: £499/month
     - Annual: £4,990/year

3. After creating each price, copy its Price ID (starts with `price_`) and add it to your `.env.local` file

### Option B: Via Stripe CLI (Advanced)

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Create products and prices
stripe products create --name="PromoPack Starter" --description="Perfect for individual brand managers"
stripe prices create --product=prod_xxx --currency=gbp --unit-amount=4900 --recurring[interval]=month
stripe prices create --product=prod_xxx --currency=gbp --unit-amount=49000 --recurring[interval]=year

# Repeat for Professional and Enterprise plans
```

## Step 4: Sync Products to Database

Run the sync script to import Stripe products into your database:

```bash
npx tsx scripts/sync-stripe-products.ts
```

This will:
- Fetch all products and prices from Stripe
- Store them in your local `Product` and `Price` tables
- Keep them in sync for future updates

## Step 5: Set Up Webhooks

Webhooks allow Stripe to notify your app about subscription events (payments, cancellations, etc.)

### For Local Development (Using Stripe CLI)

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Login to Stripe CLI:
   ```bash
   stripe login
   ```
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3032/api/stripe/webhooks
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### For Production (Using Stripe Dashboard)

1. Go to **Developers** → **Webhooks** → **Add endpoint**
2. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhooks`
3. Select events to listen to:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `invoice.created`
   - `invoice.updated`
   - `customer.updated`
4. Copy the **Signing secret** and add it to your production environment variables

## Step 6: Update Pricing Component

Update `components/Pricing.tsx` with your actual Stripe Price IDs:

```typescript
const pricingTiers: PricingTier[] = [
  {
    id: "professional",
    name: "Professional",
    price: 149,
    currency: "GBP",
    interval: "month",
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY || "",
    // ... rest of config
  },
  // ... other tiers
]
```

## Step 7: Enable Stripe Customer Portal

The Customer Portal allows users to manage their subscriptions, payment methods, and view invoices.

1. Go to **Settings** → **Billing** → **Customer portal**
2. Click **Activate test link** (for test mode) or **Activate** (for live mode)
3. Configure portal settings:
   - ✅ Allow customers to update payment methods
   - ✅ Allow customers to cancel subscriptions
   - ✅ Allow customers to switch plans
   - ✅ Show invoice history
4. Save your changes

## Step 8: Test the Integration

### Test Flow:

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Start webhook listener** (in a separate terminal):
   ```bash
   stripe listen --forward-to localhost:3032/api/stripe/webhooks
   ```

3. **Test the checkout flow:**
   - Sign up for a new account at `http://localhost:3032/auth`
   - Go to pricing page: `http://localhost:3032/pricing`
   - Click "Subscribe" on any plan
   - Use test card: `4242 4242 4242 4242`
   - Any future expiry date (e.g., 12/34)
   - Any 3-digit CVC

4. **Verify webhook events:**
   - Check terminal running `stripe listen` for webhook events
   - Check your database for new records in `Subscription`, `Invoice`, `Payment` tables

5. **Test billing portal:**
   - Go to `http://localhost:3032/account/billing`
   - Click "Manage Subscription & Payment Methods"
   - Verify you can update payment method, view invoices, etc.

### Test Cards:

- **Success:** `4242 4242 4242 4242`
- **Requires authentication:** `4000 0025 0000 3155`
- **Declined:** `4000 0000 0000 9995`

[More test cards](https://stripe.com/docs/testing#cards)

## Step 9: Go Live Checklist

Before switching to live mode:

- [ ] Replace test API keys with live keys in production environment
- [ ] Create live mode products and prices in Stripe
- [ ] Set up live webhooks pointing to production URL
- [ ] Update environment variables with live Price IDs
- [ ] Run sync script in production to import live products
- [ ] Test checkout flow in live mode with small amount
- [ ] Enable Stripe Radar for fraud protection
- [ ] Set up email receipts in Stripe settings
- [ ] Configure tax collection if needed

## Troubleshooting

### "No such price" error
- Verify Price IDs in `.env.local` match those in Stripe Dashboard
- Run sync script again: `npx tsx scripts/sync-stripe-products.ts`

### Webhook signature verification failed
- Check that `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe CLI or Dashboard
- Ensure webhook endpoint is accessible (not behind auth)

### Subscription not showing in database
- Check webhook listener is running
- Verify webhook events are being received in Stripe Dashboard → Developers → Events
- Check server logs for errors in webhook handler

### Customer portal not working
- Ensure Customer Portal is activated in Stripe Settings
- Verify `companyId` field contains Stripe customer ID

## Additional Resources

- [Stripe API Reference](https://stripe.com/docs/api)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)

## Support

If you encounter issues:
1. Check Stripe Dashboard → Developers → Logs for API errors
2. Check Stripe Dashboard → Developers → Events for webhook delivery status
3. Review server logs for webhook processing errors
4. Contact Stripe support for payment processing issues
