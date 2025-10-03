# Deployment Checklist - Auth Improvements

## ✅ Code Deployed
- [x] Code committed and pushed to GitHub
- [x] All TypeScript errors resolved
- [x] Database migration created and tested locally

## 🔧 Production Environment Setup

### 1. Add New Environment Variables

Add these to your production `.env` (Coolify or wherever you deploy):

```env
# Resend Email (for magic links and password resets)
AUTH_RESEND_KEY=re_your_key_here
EMAIL_FROM=noreply@promopack.com
```

### 2. Get Resend API Key

1. Go to https://resend.com
2. Sign up or log in
3. Navigate to API Keys
4. Create a new API key
5. Copy the key (starts with `re_`)

### 3. Configure Email Domain

**Option A: Testing (Quick Start)**
```env
EMAIL_FROM=onboarding@resend.dev
```
- Use Resend's test domain
- Works immediately
- Emails will be sent from Resend's domain

**Option B: Production (Recommended)**
1. Go to Resend Dashboard → Domains
2. Click "Add Domain"
3. Enter `promopack.com`
4. Add the provided DNS records to your domain registrar:
   - TXT record for verification
   - MX, TXT (SPF), and CNAME (DKIM) records for sending
5. Wait for verification (usually 5-15 minutes)
6. Update environment variable:
   ```env
   EMAIL_FROM=noreply@promopack.com
   ```

### 4. Run Database Migration

SSH into your production server and run:

```bash
cd /path/to/promopack
npx prisma migrate deploy
```

This will apply the `20251003205900_add_verification_tokens` migration.

### 5. Restart Application

After adding environment variables and running migration:

```bash
# If using Coolify, redeploy from the dashboard
# Or manually:
npm run build
pm2 restart promopack  # or your process manager
```

## 🧪 Testing

### Test 1: Sign In Error Handling
1. Go to https://promopack.powellmatt.com/auth
2. Try signing in with wrong password
3. ✅ Should see clear error message with red background

### Test 2: Forgot Password Link
1. On sign-in form, click "Forgot password?"
2. ✅ Should navigate to `/auth/reset-password`

### Test 3: Magic Link (if Resend configured)
1. Go to https://promopack.powellmatt.com/auth
2. Click "Magic Link" tab
3. Enter your email
4. Click "Send Magic Link"
5. ✅ Check your email inbox
6. ✅ Click the link → should sign you in

### Test 4: Password Reset via Email
1. Go to `/auth/reset-password`
2. Enter your email
3. ✅ Receive magic link
4. ✅ Click link → signed in

### Test 5: Traditional Auth Still Works
1. Go to `/auth`
2. Use "Sign In" tab
3. Enter email and password
4. ✅ Should sign in successfully

## 🔍 Verification

Check these logs in production:

```bash
# Watch application logs
tail -f /path/to/logs

# Look for these patterns:
# [AUTH] Authorize called with credentials: { email: '...' }
# [AUTH] Login successful for user: ...
```

## 🐛 Troubleshooting

### Magic links not sending?

1. **Check Resend Dashboard:**
   - Go to https://resend.com/emails
   - Check if emails are in "Sent" or "Failed"
   - Look for error messages

2. **Check environment variables:**
   ```bash
   echo $AUTH_RESEND_KEY
   echo $EMAIL_FROM
   ```

3. **Check application logs:**
   - Look for Resend API errors
   - Check for "401 Unauthorized" (wrong API key)

### Domain not verified?

1. Check DNS records are correct:
   ```bash
   dig TXT promopack.com
   dig MX promopack.com
   ```

2. DNS propagation can take up to 48 hours (usually 5-15 min)

3. Use test domain meanwhile: `onboarding@resend.dev`

### Migration failed?

```bash
# Check current migration status
npx prisma migrate status

# If needed, reset and reapply
npx prisma migrate reset
npx prisma migrate deploy
```

## 📊 Monitoring

After deployment, monitor:

1. **Email delivery rate** (Resend Dashboard)
2. **Sign-in success rate** (application logs)
3. **Error rates** (check for spikes)
4. **User feedback** (any complaints about authentication?)

## 🔐 Security Notes

- ✅ Magic links expire after 24 hours
- ✅ Tokens are single-use
- ✅ All sensitive data in environment variables
- ✅ No passwords stored in logs
- ✅ Proper error messages (don't reveal user existence)

## 📝 Post-Deployment

After successful deployment:

1. **Test all auth flows** (see Testing section above)
2. **Update team** on new magic link feature
3. **Monitor Resend usage** (check monthly quota)
4. **Document any issues** encountered

## 🎯 Success Criteria

Deployment is successful when:

- [x] Code deployed to production
- [ ] Environment variables added
- [ ] Database migration applied
- [ ] Magic link email sending works
- [ ] Password reset flow works
- [ ] Traditional sign-in still works
- [ ] No errors in production logs
- [ ] Users can authenticate successfully

---

**Current Status:** Code deployed ✅ | Environment setup pending ⏳
