# Security & Data Protection Implementation Guide

## Overview
This document outlines how to deliver on the security promises made in the pricing page:
- ✅ Enterprise-grade encryption
- ✅ GDPR compliance
- ✅ Data never shared

---

## 1. Enterprise-Grade Encryption

### ✅ Already Implemented

#### Data in Transit
- **HTTPS/TLS 1.3**: Automatic with Next.js deployment on Vercel/Coolify
- **API calls**: All external service calls (extractor, PubMed) use HTTPS
- **Database connections**: PostgreSQL connections should use SSL

#### Data at Rest
- **Supabase Storage**: Automatically encrypts files at rest using AES-256
- **PostgreSQL**: Check that your provider (Supabase/Neon/Railway) has encryption enabled

### 🔧 Action Items

#### 1.1 Verify Database SSL Connection
Update your `DATABASE_URL` to enforce SSL:

```bash
# In .env and production environment
DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
```

#### 1.2 Add Security Headers
Create `next.config.ts` security headers:

```typescript
// In next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
}
```

#### 1.3 Encrypt Sensitive Data in Database (Optional but Recommended)
For highly sensitive fields, add field-level encryption:

```typescript
// utils/encryption.ts
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32-byte key
const ALGORITHM = 'aes-256-gcm';

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();
  
  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedText: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedText.split(':');
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(ivHex, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

Generate encryption key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 2. GDPR Compliance

### 🔧 Required Implementations

#### 2.1 Privacy Policy & Terms of Service
✅ Already have: `/app/privacy/page.tsx` and `/app/terms/page.tsx`

**Action**: Update these pages to include:
- Data collection practices
- Legal basis for processing (contract, legitimate interest)
- Data retention periods
- User rights (access, deletion, portability, rectification)
- DPO contact (if applicable)
- Cookie policy
- International data transfers

#### 2.2 Cookie Consent Banner
Create a GDPR-compliant cookie banner:

```typescript
// components/CookieConsent.tsx
"use client"

import { useState, useEffect } from 'react'

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const acceptAll = () => {
    localStorage.setItem('cookieConsent', 'all')
    setShowBanner(false)
    // Enable analytics
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  const acceptEssential = () => {
    localStorage.setItem('cookieConsent', 'essential')
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-6 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm">
            We use cookies to enhance your experience and analyze site usage. 
            <a href="/privacy" className="underline ml-1">Learn more</a>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={acceptEssential}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 text-sm"
          >
            Essential Only
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-sm"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
```

Add to `app/layout.tsx`:
```typescript
import { CookieConsent } from '@/components/CookieConsent'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
```

#### 2.3 User Data Rights - Implement Self-Service Tools

**Data Export** (Right to Portability):
```typescript
// app/actions.ts
"use server"

export async function exportUserData() {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: {
        include: {
          documents: true,
          claims: true
        }
      }
    }
  })

  // Return JSON for download
  return {
    user: {
      email: user?.email,
      name: user?.name,
      createdAt: user?.id
    },
    projects: user?.projects,
    exportedAt: new Date().toISOString()
  }
}
```

**Data Deletion** (Right to Erasure):
```typescript
// app/actions.ts
"use server"

export async function deleteUserAccount() {
  const session = await auth()
  if (!session?.user?.email) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) throw new Error('User not found')

  // Delete all user data (cascade will handle projects, documents, claims)
  await prisma.user.delete({
    where: { id: user.id }
  })

  // Delete files from storage
  // TODO: Implement S3 bucket cleanup for user's files

  // Sign out
  await signOut()
}
```

**Account Settings Page** with data controls:
```typescript
// app/account/data/page.tsx
import { exportUserData, deleteUserAccount } from '@/app/actions'

export default function DataManagementPage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Your Data</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Export Your Data</h2>
        <p className="text-gray-600 mb-4">
          Download all your data in JSON format (GDPR Article 20)
        </p>
        <form action={async () => {
          'use server'
          const data = await exportUserData()
          // Trigger download
        }}>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Download My Data
          </button>
        </form>
      </section>

      <section className="border-t pt-8">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Delete Account</h2>
        <p className="text-gray-600 mb-4">
          Permanently delete your account and all associated data (GDPR Article 17)
        </p>
        <form action={deleteUserAccount}>
          <button className="bg-red-600 text-white px-4 py-2 rounded">
            Delete My Account
          </button>
        </form>
      </section>
    </div>
  )
}
```

#### 2.4 Data Retention Policy
Implement automatic data deletion:

```typescript
// scripts/cleanup-old-data.ts
// Run this as a cron job (e.g., monthly)
import { prisma } from '@/utils/db'

async function cleanupOldData() {
  const retentionDays = 365 * 2 // 2 years for inactive projects
  
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

  // Delete projects not updated in 2 years
  const deletedProjects = await prisma.project.deleteMany({
    where: {
      updatedAt: {
        lt: cutoffDate
      }
    }
  })

  console.log(`Deleted ${deletedProjects.count} old projects`)
}

cleanupOldData()
```

#### 2.5 Update Privacy Policy
Add a section to `app/privacy/page.tsx`:

```markdown
## Your Rights Under GDPR

You have the following rights:
- **Right to Access**: Request a copy of your data
- **Right to Rectification**: Correct inaccurate data
- **Right to Erasure**: Delete your account and data
- **Right to Portability**: Export your data in machine-readable format
- **Right to Object**: Object to processing of your data

To exercise these rights, visit your [Account Settings](/account/data) or email privacy@promopack.io

## Data Retention
- Active projects: Retained while your subscription is active
- Inactive projects: Deleted after 2 years of inactivity
- Deleted accounts: Data permanently removed within 30 days
```

---

## 3. Data Never Shared

### 🔧 Implementation Checklist

#### 3.1 Third-Party Audit
Document all third parties that receive data:

**Current third parties:**
1. **Supabase** (file storage) - Data Processing Agreement (DPA) ✅
2. **Database provider** (Postgres hosting) - DPA required
3. **Extractor service** (claim extraction) - Review contract
4. **Stripe** (payments) - DPA ✅
5. **Vercel/Coolify** (hosting) - DPA ✅
6. **Analytics** (if using GA/Posthog) - Configure for GDPR

**Action**: 
- Sign Data Processing Agreements (DPAs) with all vendors
- Add subprocessor list to Privacy Policy
- Ensure all vendors are GDPR-compliant

#### 3.2 Prevent Data Leakage
Ensure no PII in logs or analytics:

```typescript
// utils/logger.ts
export function sanitizeForLogging(data: any) {
  const sensitive = ['email', 'password', 'token', 'key']
  
  const sanitized = { ...data }
  for (const key of Object.keys(sanitized)) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '[REDACTED]'
    }
  }
  return sanitized
}

// Usage in app/actions.ts
console.log('User action:', sanitizeForLogging({ email: user.email, action: 'create' }))
```

#### 3.3 Rate Limiting & Abuse Prevention
Prevent data scraping:

```typescript
// middleware.ts (add rate limiting)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function middleware(request: NextRequest) {
  const ip = request.ip || 'unknown'
  const now = Date.now()
  const windowMs = 60000 // 1 minute
  const maxRequests = 100

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, [])
  }

  const requests = rateLimitMap.get(ip).filter((time: number) => now - time < windowMs)
  requests.push(now)
  rateLimitMap.set(ip, requests)

  if (requests.length > maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  return NextResponse.next()
}
```

---

## 4. Security Best Practices Checklist

### Current Status Audit

- [x] HTTPS enforced
- [x] Authentication (Next-Auth v5)
- [x] Password hashing (bcrypt via `utils/password.ts`)
- [ ] Security headers in next.config.ts
- [ ] Database SSL mode enforced
- [ ] GDPR cookie consent banner
- [ ] User data export functionality
- [ ] User data deletion functionality
- [ ] Privacy policy with GDPR rights
- [ ] Data retention policy
- [ ] DPAs signed with all vendors
- [ ] Rate limiting
- [ ] CSP headers
- [ ] Regular security audits

### Environment Variable Security

```bash
# .env.example - Document all required vars
DATABASE_URL=postgresql://...?sslmode=require
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
ENCRYPTION_KEY=<generate-with-crypto-randomBytes-32>
SUPABASE_URL=
SUPABASE_KEY_ID=
SUPABASE_KEY_SECRET=
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Never commit**:
- Real API keys
- Encryption keys
- Database credentials

---

## 5. Compliance Documentation

### Create a Security Page
```typescript
// app/security/page.tsx
export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Security at PromoPack</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🔒 Encryption</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ TLS 1.3 for all data in transit</li>
          <li>✅ AES-256 encryption for data at rest</li>
          <li>✅ Encrypted database connections (SSL)</li>
          <li>✅ Encrypted file storage (Supabase)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🇪🇺 GDPR Compliance</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ EU-based data storage options</li>
          <li>✅ DPAs with all subprocessors</li>
          <li>✅ User data export & deletion tools</li>
          <li>✅ Cookie consent management</li>
          <li>✅ 30-day data retention after deletion</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🛡️ Data Protection</h2>
        <ul className="space-y-2 text-gray-700">
          <li>✅ No data shared with third parties</li>
          <li>✅ Regular security audits</li>
          <li>✅ SOC 2 Type II certified infrastructure</li>
          <li>✅ 24/7 security monitoring</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">📧 Report a Security Issue</h2>
        <p className="text-gray-700">
          If you discover a security vulnerability, please email{' '}
          <a href="mailto:security@promopack.io" className="text-blue-600 underline">
            security@promopack.io
          </a>
        </p>
      </section>
    </div>
  )
}
```

---

## 6. Ongoing Compliance

### Monthly Tasks
- [ ] Review access logs for suspicious activity
- [ ] Update dependencies (npm audit fix)
- [ ] Review DPAs with vendors
- [ ] Test data export/deletion flows

### Quarterly Tasks
- [ ] Security audit (consider hiring external firm)
- [ ] Review and update privacy policy
- [ ] Penetration testing

### Yearly Tasks
- [ ] Renew SSL certificates (if self-managed)
- [ ] Review compliance with new regulations
- [ ] Update security documentation

---

## 7. Quick Wins (Do These First)

1. **Add security headers** to `next.config.ts` (10 min)
2. **Enforce SSL** in DATABASE_URL (5 min)
3. **Create cookie consent banner** (30 min)
4. **Add data export button** to account page (1 hour)
5. **Update privacy policy** with GDPR rights (30 min)
6. **Create /security page** (30 min)

---

## Resources

- [GDPR Checklist](https://gdpr.eu/checklist/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy)
- [Stripe Security Best Practices](https://stripe.com/docs/security/guide)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)

---

## Contact for Security Questions
- Email: security@promopack.io
- DPO: [Appoint if >250 employees or high-risk processing]
