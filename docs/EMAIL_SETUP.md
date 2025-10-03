# Email & Authentication Setup

## Overview

PromoPack now supports three authentication methods:
1. **Email + Password** - Traditional sign in
2. **Magic Links** - Passwordless email links
3. **Sign Up** - Create new account with email + password

## Resend Setup (for Magic Links & Password Reset)

### 1. Get Resend API Key

1. Go to [Resend.com](https://resend.com) and sign up
2. Verify your domain or use the test domain `onboarding@resend.dev`
3. Create an API key from the dashboard
4. Add to your `.env`:

```env
AUTH_RESEND_KEY=re_your_key_here
EMAIL_FROM=noreply@yourdomain.com
```

### 2. Verify Domain (Production)

For production, you need to verify your domain:

1. Go to Resend Dashboard → Domains
2. Add your domain (e.g., `promopack.com`)
3. Add the provided DNS records to your domain
4. Wait for verification (usually a few minutes)
5. Update `EMAIL_FROM` to use your verified domain

### 3. Test Magic Links

1. Navigate to `/auth`
2. Click the "Magic Link" tab
3. Enter your email
4. Check your inbox for the magic link
5. Click the link to sign in

## Password Reset Flow

Users can reset their password by:

1. Going to `/auth/reset-password`
2. Entering their email
3. Receiving a magic link
4. Signing in via the link

Alternatively, users can click "Forgot password?" on the sign-in form.

## Environment Variables

Required for email functionality:

```env
# Resend Email
AUTH_RESEND_KEY=re_123456789          # From Resend dashboard
EMAIL_FROM=noreply@yourdomain.com     # Your verified sending address

# Next-Auth (already configured)
AUTH_SECRET=your-secret
AUTH_TRUST_HOST=true
NEXTAUTH_URL=https://yourdomain.com
```

## Database Schema

The migration `20251003205900_add_verification_tokens` adds:

- `VerificationToken` table for storing magic link tokens
- Relationship to `User` table
- Automatic token expiration (24 hours)

## Customizing Email Templates

To customize the magic link email:

1. Create `emails/magic-link.tsx` with your React Email template
2. Configure in `auth.ts`:

```typescript
Resend({
  apiKey: process.env.AUTH_RESEND_KEY,
  from: process.env.EMAIL_FROM,
  sendVerificationRequest: async ({ identifier, url, provider }) => {
    // Custom email logic here
  },
})
```

## Testing

### Local Development

Use Resend's test domain for local testing:

```env
EMAIL_FROM=onboarding@resend.dev
```

Emails will be sent to real addresses but from Resend's test domain.

### Production

1. Verify your domain in Resend
2. Update `EMAIL_FROM` to your domain
3. Test with a real email address
4. Check Resend logs for delivery status

## Troubleshooting

### Magic link not working

1. Check Resend dashboard for email logs
2. Verify `AUTH_RESEND_KEY` is correct
3. Check spam folder
4. Ensure domain is verified (production)

### Token expired

Magic links expire after 24 hours. Request a new link.

### Email not sending

1. Check Resend API logs
2. Verify environment variables are set
3. Check `EMAIL_FROM` matches verified domain
4. Ensure `AUTH_RESEND_KEY` has send permissions

## Security Notes

- Magic links expire after 24 hours
- Tokens are single-use
- Email verification improves account security
- Users can still use password if they prefer
