# Coolify Deployment Guide for PromoPack

This guide walks you through deploying PromoPack to Coolify, a self-hosted platform-as-a-service.

## Prerequisites

- Coolify instance running and accessible
- PostgreSQL database (can be provisioned in Coolify)
- Domain name pointed to your Coolify server
- GitHub repository with PromoPack code

## Step 1: Prepare Your Repository

Ensure your repository has:
- [x] `Dockerfile` (created)
- [x] `.dockerignore` (created)
- [x] `next.config.ts` with `output: 'standalone'` (configured)

## Step 2: Set Up PostgreSQL Database in Coolify

1. In Coolify dashboard, go to **Databases**
2. Click **New Database**
3. Select **PostgreSQL**
4. Configure:
   - Name: `promopack-db`
   - PostgreSQL version: `16` (latest stable)
5. Click **Deploy**
6. Once deployed, copy the **Internal Connection String** for later use

Example connection string format:
```
postgresql://postgres:password@promopack-db:5432/promopack
```

## Step 3: Create New Application in Coolify

1. Go to **Applications** → **New Application**
2. Select **Public Repository** or connect your private GitHub repo
3. Enter repository URL: `https://github.com/yourusername/promopack`
4. Select branch: `main` or `master`
5. Build pack: **Dockerfile**
6. Port: `3000`

## Step 4: Configure Environment Variables

In Coolify, go to your application → **Environment Variables** and add all required variables:

### Core Application

```env
# Node Environment
NODE_ENV=production

# Application URL
NEXTAUTH_URL=https://promopack.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://promopack.yourdomain.com
AUTH_TRUST_HOST=true
```

### Database

```env
# Use the connection string from Step 2
DATABASE_URL=postgresql://postgres:password@promopack-db:5432/promopack
```

### Authentication (Next-Auth v5)

```env
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret-key-here
```

### AWS S3 Storage

```env
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=promopack-files
```

### External Services

```env
# Your claim extraction Python service
EXTRACTOR_API_URL=https://your-extractor-service.com
EXTRACTOR_API_KEY=your-extractor-api-key
```

### Stripe Payments

```env
# Stripe API Keys (from https://dashboard.stripe.com)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Stripe Price IDs (create products first in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_...
```

### Email (Resend)

```env
# Resend API Key (from https://resend.com)
AUTH_RESEND_KEY=re_...
EMAIL_FROM=noreply@promopack.yourdomain.com
```

### OpenAI (Optional - for AI features)

```env
OPENAI_API_KEY=sk-...
```

### Analytics (Optional)

```env
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## Step 5: Configure Domain

1. In Coolify, go to your application → **Domains**
2. Add your domain: `promopack.yourdomain.com`
3. Enable **HTTPS** (Let's Encrypt)
4. Wait for SSL certificate provisioning

## Step 6: Deploy Application

1. Click **Deploy** in Coolify dashboard
2. Wait for build to complete (5-10 minutes first time)
3. Monitor build logs for any errors

## Step 7: Run Database Migrations

After first deployment, you need to run Prisma migrations:

### Option A: Using Coolify Terminal

1. Go to your application → **Terminal**
2. Run:
```bash
npx prisma migrate deploy
npx prisma db seed  # If you have seed data
```

### Option B: Using Pre-Deploy Commands

In Coolify, add to **Pre-Deploy Commands**:
```bash
npx prisma migrate deploy
```

This will run migrations automatically on every deployment.

## Step 8: Configure Stripe Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://promopack.yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`)
6. Add to Coolify environment variables as `STRIPE_WEBHOOK_SECRET`
7. Redeploy application

## Step 9: Configure Resend Email Domain

### Quick Start (Testing)
Use Resend's test domain:
```env
EMAIL_FROM=onboarding@resend.dev
```

### Production Setup
1. Go to Resend Dashboard → **Domains**
2. Click **Add Domain**
3. Enter: `promopack.yourdomain.com` or `yourdomain.com`
4. Add DNS records to your domain registrar:
   - **TXT** record for verification
   - **MX** records for email receiving
   - **TXT** (SPF) record for sender authentication
   - **CNAME** (DKIM) record for email signing
5. Wait for verification (5-15 minutes)
6. Update `EMAIL_FROM` environment variable
7. Redeploy application

## Step 10: Verify Deployment

### Health Checks

1. Visit your domain: `https://promopack.yourdomain.com`
2. Check homepage loads correctly
3. Test authentication:
   - Sign up with new account
   - Verify magic link email arrives
   - Test password sign-in
4. Test core features:
   - Create a project
   - Upload a document
   - Generate a pack

### Monitor Logs

In Coolify:
1. Go to application → **Logs**
2. Watch for errors
3. Check for successful API calls

## Troubleshooting

### Build Fails

**Check Dockerfile:**
```bash
# Test locally first
docker build -t promopack .
docker run -p 3000:3000 promopack
```

**Check build logs in Coolify:**
- Look for missing dependencies
- Verify Node.js version compatibility
- Check TypeScript compilation errors

### Database Connection Errors

```bash
# Verify connection string format
postgresql://user:password@host:port/database

# Check database is running
# In Coolify: Databases → promopack-db → Status
```

### Application Won't Start

1. Check environment variables are set correctly
2. Verify `DATABASE_URL` is accessible from app container
3. Check Prisma migrations were applied:
```bash
npx prisma migrate status
```

### Magic Links Not Sending

1. Verify `AUTH_RESEND_KEY` is correct
2. Check Resend Dashboard for email delivery status
3. Verify domain is verified (production) or using test domain
4. Check application logs for Resend API errors

### Stripe Webhooks Failing

1. Verify webhook URL is correct: `/api/stripe/webhook`
2. Check `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
3. Test webhook endpoint:
```bash
curl -X POST https://promopack.yourdomain.com/api/stripe/webhook
```
4. Review webhook delivery logs in Stripe Dashboard

### SSL Certificate Issues

1. Ensure domain DNS is pointing to Coolify server
2. Wait for Let's Encrypt provisioning (can take 5-10 minutes)
3. Check Coolify logs for certificate errors
4. Try disabling and re-enabling HTTPS

## Maintenance

### Updating Application

1. Push code changes to GitHub
2. In Coolify, click **Redeploy**
3. Monitor build logs
4. Verify changes in production

### Database Backups

Set up automated backups in Coolify:
1. Go to **Databases** → **promopack-db**
2. Enable **Automated Backups**
3. Configure backup schedule (daily recommended)
4. Set retention period (30 days recommended)

### Monitoring

1. Set up **Health Checks** in Coolify
2. Configure **Notifications** for deployment failures
3. Monitor **Resource Usage** (CPU, Memory, Disk)
4. Review **Application Logs** regularly

### Scaling

For high traffic:
1. Increase container resources in Coolify
2. Consider database connection pooling (PgBouncer)
3. Set up CDN for static assets
4. Enable Next.js caching

## Security Checklist

- [ ] All environment variables set
- [ ] HTTPS enabled with valid SSL certificate
- [ ] Database not exposed to public internet
- [ ] Strong `NEXTAUTH_SECRET` generated
- [ ] Stripe webhook secret configured
- [ ] Email domain verified and SPF/DKIM configured
- [ ] Rate limiting enabled (via Coolify or application level)
- [ ] Regular database backups configured
- [ ] Application logs monitored
- [ ] Security headers configured (in Next.js middleware)

## Performance Optimization

1. **Enable Next.js caching:**
   - Static pages cached at CDN
   - API routes cached where appropriate

2. **Database optimization:**
   - Add connection pooling
   - Create database indexes for frequently queried fields
   - Monitor slow queries

3. **Asset optimization:**
   - Use Next.js Image component for automatic optimization
   - Enable compression in Coolify
   - Use CDN for static assets

4. **Monitoring:**
   - Set up application performance monitoring (APM)
   - Track Core Web Vitals
   - Monitor database query performance

## Cost Considerations

- **Coolify hosting:** Free (self-hosted) + server costs
- **PostgreSQL database:** Included with Coolify
- **AWS S3 storage:** ~$0.023/GB/month + transfer costs
- **Resend emails:** 3,000 free/month, then $20/month (50k emails)
- **Stripe fees:** 2.9% + $0.30 per transaction
- **Domain & SSL:** Domain cost only (SSL free via Let's Encrypt)

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Database migrations applied
- [ ] Domain configured with HTTPS
- [ ] Email domain verified
- [ ] Stripe webhooks configured and tested
- [ ] Database backups enabled
- [ ] Health checks passing
- [ ] Error monitoring set up
- [ ] All core features tested in production
- [ ] Load testing performed
- [ ] Security audit completed
- [ ] Terms of Service and Privacy Policy added
- [ ] Support email configured
- [ ] Analytics tracking set up

## Support

- **Coolify Documentation:** https://coolify.io/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Prisma Deployment:** https://www.prisma.io/docs/guides/deployment

## Next Steps

After deployment:
1. Update [TODO.md](../TODO.md) - Mark deployment tasks as complete
2. Test all authentication flows
3. Configure Resend for production emails (see next TODO item)
4. Set up monitoring and alerts
5. Plan for scaling as user base grows
