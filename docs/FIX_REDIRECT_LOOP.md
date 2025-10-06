# Fix: Redirect Loop (Infinite Redirects) - Cloudflare + Coolify

## Problem
```
Error: fetch failed
Cause: redirect count exceeded
```

This means Cloudflare and Coolify are stuck in an infinite redirect loop.

## Why This Happens

**Redirect Loop Flow:**
```
1. Browser → HTTPS request → Cloudflare
2. Cloudflare (Flexible mode) → HTTP request → Coolify
3. Coolify sees HTTP → redirects to HTTPS
4. Cloudflare receives HTTPS → converts to HTTP again
5. Loop repeats → ERROR: redirect count exceeded
```

## Quick Fixes

### Fix 1: Change Cloudflare SSL Mode to "Full" ⭐ RECOMMENDED

1. Go to Cloudflare dashboard
2. Select your domain: `powellmatt.com`
3. Click **SSL/TLS** in left menu
4. Change encryption mode to **"Full"**
   - NOT "Flexible" 
   - NOT "Full (strict)" (unless you have a valid origin certificate)
5. Click **Save**
6. Wait 30 seconds for changes to propagate
7. Test your extractor again

**Why this works**: Coolify serves HTTPS (with self-signed cert), Cloudflare connects via HTTPS, no redirect loop.

### Fix 2: Disable HTTPS Redirect in Coolify

**In Coolify Dashboard:**

1. Go to your extractor service
2. Settings → Environment Variables
3. Add or update:
   ```
   FORCE_HTTPS=false
   ```
   or
   ```
   DISABLE_HTTPS_REDIRECT=true
   ```
4. Redeploy the service
5. Change Cloudflare SSL mode to **"Flexible"**

**Why this works**: Coolify accepts HTTP, Cloudflare can forward HTTP without causing redirects.

### Fix 3: Use Cloudflare Authenticated Origin Pulls (Best Long-term)

**Step 1: Generate Cloudflare Origin Certificate**

1. Cloudflare dashboard → SSL/TLS → Origin Server
2. Click **"Create Certificate"**
3. Select:
   - Private key type: RSA (2048)
   - Hostnames: `*.powellmatt.com`, `powellmatt.com`
   - Certificate validity: 15 years
4. Click **Create**
5. **Copy both the certificate and private key**

**Step 2: Add Certificate to Coolify**

1. In Coolify, go to your extractor service
2. Settings → SSL/TLS or Certificates
3. Paste:
   - Certificate: (from Cloudflare)
   - Private Key: (from Cloudflare)
4. Save and redeploy

**Step 3: Set Cloudflare to Full (Strict)**

1. Cloudflare → SSL/TLS
2. Change mode to **"Full (strict)"**
3. Save

**Why this works**: Both ends use valid HTTPS certificates, no redirects needed.

## Testing After Fix

### Test 1: Browser Test
```
https://promopack-extractor.powellmatt.com/health
```
Should return 200 OK (or JSON response).

### Test 2: Command Line Test
```bash
curl -I https://promopack-extractor.powellmatt.com/health
```
Should show:
```
HTTP/2 200
...
cf-cache-status: DYNAMIC
```

### Test 3: From Your App
Run the test script:
```bash
node scripts/test-extractor-simple.js
```
Should show ✅ for both tests.

## Verification Steps

After applying fix, check:

1. **No redirect loop**:
   ```bash
   curl -L -I https://promopack-extractor.powellmatt.com/health
   ```
   Should show only 1-2 redirects max, ending in 200.

2. **SSL handshake works**:
   ```bash
   openssl s_client -connect promopack-extractor.powellmatt.com:443 -servername promopack-extractor.powellmatt.com
   ```
   Should show successful SSL connection.

3. **Cloudflare headers present**:
   ```bash
   curl -I https://promopack-extractor.powellmatt.com/health | grep -i cf-
   ```
   Should show Cloudflare headers.

## Current Setup Analysis

Based on your error, your current setup is:

- ✅ Cloudflare SSL mode: **Flexible** (HTTPS → HTTP)
- ✅ Coolify: **Has SSL/HTTPS enabled** (redirects HTTP → HTTPS)
- ❌ **Result**: Infinite redirect loop

## Recommended Configuration

**For simplicity (good enough for most use cases):**
```
Cloudflare SSL Mode: Full
Coolify: Keep SSL enabled (self-signed cert is OK)
```

**For production/security (best practice):**
```
Cloudflare SSL Mode: Full (strict)
Coolify: Use Cloudflare Origin Certificate
```

## What NOT to Do

❌ Don't use "Flexible" mode with Coolify auto-HTTPS enabled
❌ Don't use "Full (strict)" with self-signed certificates
❌ Don't disable SSL entirely (keep HTTPS for security)

## If Problem Persists

Check Coolify container logs:
```bash
# SSH to VPS
ssh your-vps

# View extractor logs
docker logs <extractor-container-id> --tail 50
```

Look for:
- Redirect rules being applied
- SSL certificate errors
- Port binding issues

## Summary

**Quick Action**: Change Cloudflare SSL mode to **"Full"** and test again. This should fix the redirect loop immediately.
