# Environment Variables Reference

Complete reference for all environment variables required by PromoPack.

## Quick Setup

Copy [.env.example](../.env.example) to `.env.local` for development:
```bash
cp .env.example .env.local
```

For production deployment, set these in your hosting platform (Coolify, Vercel, etc.).

## Required Variables

### Database

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` | ✅ Yes |

### Authentication

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXTAUTH_SECRET` | Secret key for session encryption | Generate with `openssl rand -base64 32` | ✅ Yes |
| `NEXTAUTH_URL` | Full URL of your application | `https://promopack.yourdomain.com` | ✅ Yes |
| `AUTH_TRUST_HOST` | Trust host header (required in production) | `true` | ✅ Yes (production) |

### File Storage (AWS S3)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `AWS_ACCESS_KEY_ID` | AWS access key ID | `AKIAIOSFODNN7EXAMPLE` | ✅ Yes |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` | ✅ Yes |
| `AWS_REGION` | AWS region for S3 bucket | `us-east-1` | ✅ Yes |
| `AWS_S3_BUCKET_NAME` | S3 bucket name for file storage | `promopack-files` | ✅ Yes |

### External Services

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `EXTRACTOR_API_URL` | URL of claim extraction service | `https://extractor.yourdomain.com` | ✅ Yes |
| `EXTRACTOR_API_KEY` | API key for extraction service | `your-api-key` | ✅ Yes |

## Optional Variables

### Payments (Stripe)

Required if you want to enable subscription payments:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `STRIPE_SECRET_KEY` | Stripe secret API key | `sk_live_...` or `sk_test_...` | 🔵 For payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | `whsec_...` | 🔵 For payments |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (public) | `pk_live_...` or `pk_test_...` | 🔵 For payments |

#### Stripe Price IDs

Get these after creating products in Stripe Dashboard:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY` | Starter tier monthly price ID | 🔵 For payments |
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL` | Starter tier annual price ID | 🔵 For payments |
| `NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY` | Professional tier monthly price ID | 🔵 For payments |
| `NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL` | Professional tier annual price ID | 🔵 For payments |
| `NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_MONTHLY` | Enterprise tier monthly price ID | 🔵 For payments |
| `NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL` | Enterprise tier annual price ID | 🔵 For payments |

**Setup Guide:** See [STRIPE_SETUP.md](./STRIPE_SETUP.md)

### Email (Resend)

Required if you want magic link authentication and password resets:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `AUTH_RESEND_KEY` | Resend API key | `re_...` | 🔵 For email auth |
| `EMAIL_FROM` | Sender email address | `noreply@yourdomain.com` | 🔵 For email auth |

**Testing:** Use `onboarding@resend.dev` for `EMAIL_FROM` to test without domain verification.

**Setup Guide:** See [EMAIL_SETUP.md](./EMAIL_SETUP.md)

### AI Features (OpenAI)

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `OPENAI_API_KEY` | OpenAI API key | `sk-...` | ⚪ Optional |

### SEO & Analytics

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site | `https://promopack.app` | ⚪ Optional |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Google Search Console verification | `abc123...` | ⚪ Optional |
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 Measurement ID | `G-XXXXXXXXXX` | ⚪ Optional |

## Environment-Specific Values

### Development (`.env.local`)

```env
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3032
NEXT_PUBLIC_SITE_URL=http://localhost:3032
AUTH_TRUST_HOST=true

# Use test/development keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Use Resend test domain
EMAIL_FROM=onboarding@resend.dev
```

### Production

```env
NODE_ENV=production
NEXTAUTH_URL=https://promopack.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://promopack.yourdomain.com
AUTH_TRUST_HOST=true

# Use live Stripe keys
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Use verified domain
EMAIL_FROM=noreply@yourdomain.com
```

## Security Best Practices

### Secret Generation

Generate strong secrets:
```bash
# For NEXTAUTH_SECRET
openssl rand -base64 32

# Alternative
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Secret Management

✅ **DO:**
- Use environment variables for all secrets
- Keep `.env.local` in `.gitignore`
- Use different keys for development/production
- Rotate secrets periodically
- Use secret management tools (AWS Secrets Manager, etc.) in production

❌ **DON'T:**
- Commit secrets to version control
- Share secrets in plain text (use secure password managers)
- Use same secrets across environments
- Hardcode secrets in application code

### Public vs Private Variables

**Private** (server-only, no `NEXT_PUBLIC_` prefix):
- `NEXTAUTH_SECRET`
- `DATABASE_URL`
- `AWS_SECRET_ACCESS_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `AUTH_RESEND_KEY`
- `OPENAI_API_KEY`

**Public** (exposed to browser, `NEXT_PUBLIC_` prefix):
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_STRIPE_PRICE_*`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_GA_ID`

## Validation

The application validates environment variables on startup. Check the console for errors if any required variables are missing.

**Server actions** will throw errors if trying to use features without required environment variables (e.g., Stripe payments without Stripe keys).

## Getting API Keys

### AWS S3
1. Go to AWS Console → IAM → Users
2. Create new user with S3 permissions
3. Create access key
4. Copy access key ID and secret

### Stripe
1. Go to https://dashboard.stripe.com
2. Get API keys from Developers → API Keys
3. Create products/prices in Dashboard → Products
4. Copy price IDs

### Resend
1. Go to https://resend.com
2. Sign up/log in
3. Go to API Keys
4. Create new API key

### OpenAI
1. Go to https://platform.openai.com
2. Sign up/log in
3. Go to API Keys
4. Create new API key

## Troubleshooting

### "Missing required environment variable"

Check the error message to see which variable is missing. Set it in your `.env.local` (development) or hosting platform environment variables (production).

### Stripe webhooks failing

1. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
2. Check webhook endpoint URL is correct
3. Test webhook delivery in Stripe Dashboard

### Email not sending

1. Verify `AUTH_RESEND_KEY` is set
2. Check `EMAIL_FROM` is either `onboarding@resend.dev` (test) or a verified domain
3. Check Resend Dashboard for delivery status

### Database connection errors

1. Verify `DATABASE_URL` format is correct
2. Check database is running and accessible
3. Test connection: `npx prisma db push`

## More Information

- [Coolify Deployment Guide](./COOLIFY_DEPLOYMENT.md)
- [Stripe Setup Guide](./STRIPE_SETUP.md)
- [Email Setup Guide](./EMAIL_SETUP.md)
- [Deployment Checklist](./DEPLOYMENT_CHECKLIST.md)
