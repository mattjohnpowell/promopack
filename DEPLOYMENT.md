# PromoPack Deployment

Quick reference for deploying PromoPack to production.

## Deployment Platforms

PromoPack can be deployed to any platform that supports Docker:

- **Coolify** (Recommended - Self-hosted) - [Guide](./docs/COOLIFY_DEPLOYMENT.md)
- **Vercel** - Easy deployment for Next.js apps
- **Railway** - Simple Docker deployments
- **AWS ECS/Fargate** - Enterprise-grade scalability
- **Google Cloud Run** - Serverless containers
- **DigitalOcean App Platform** - Managed container hosting

## Quick Start (Coolify)

1. **Prerequisites:**
   - Coolify instance running
   - PostgreSQL database
   - Domain with DNS configured

2. **Deploy:**
   - Follow the comprehensive [Coolify Deployment Guide](./docs/COOLIFY_DEPLOYMENT.md)

3. **Environment Variables:**
   - See [Environment Variables Reference](./docs/ENVIRONMENT_VARIABLES.md)
   - Copy from [.env.example](./.env.example)

## Deployment Files

- [`Dockerfile`](./Dockerfile) - Production Docker image
- [`.dockerignore`](./.dockerignore) - Docker build exclusions
- [`scripts/start.sh`](./scripts/start.sh) - Startup script with migrations
- [`next.config.ts`](./next.config.ts) - Next.js configuration (standalone output)

## Required Services

### Core Services (Required)
- **PostgreSQL** - Database
- **AWS S3** - File storage
- **Claim Extractor API** - Python service for extracting claims

### Optional Services (Enhance functionality)
- **Stripe** - Subscription payments ([Setup Guide](./docs/STRIPE_SETUP.md))
- **Resend** - Email for auth ([Setup Guide](./docs/EMAIL_SETUP.md))
- **OpenAI** - AI-powered features

## Pre-Deployment Checklist

- [ ] Database URL configured
- [ ] Environment variables set (see [reference](./docs/ENVIRONMENT_VARIABLES.md))
- [ ] Domain DNS pointed to server
- [ ] SSL certificate configured
- [ ] Stripe webhooks configured (if using payments)
- [ ] Email domain verified (if using Resend)
- [ ] S3 bucket created and credentials set
- [ ] Extractor API accessible

## Post-Deployment Steps

1. **Verify deployment:**
   ```bash
   curl https://yourdomain.com
   ```

2. **Check database migrations:**
   ```bash
   npx prisma migrate status
   ```

3. **Test authentication:**
   - Sign up with new account
   - Test magic link (if Resend configured)
   - Test password sign-in

4. **Test core features:**
   - Create a project
   - Upload documents
   - Extract claims
   - Generate PDF pack

5. **Configure monitoring:**
   - Set up health checks
   - Configure alerts
   - Monitor application logs

## Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Build fails | Check Dockerfile and build logs |
| Database connection errors | Verify DATABASE_URL format and accessibility |
| Magic links not sending | Check Resend API key and domain verification |
| Stripe webhooks failing | Verify webhook secret and endpoint URL |
| Application won't start | Check environment variables and logs |

See full troubleshooting guide in [Coolify Deployment Guide](./docs/COOLIFY_DEPLOYMENT.md#troubleshooting).

## Scaling

For high-traffic deployments:

1. **Database:** Add connection pooling (PgBouncer)
2. **Application:** Increase container instances
3. **Static Assets:** Use CDN (Cloudflare, CloudFront)
4. **File Storage:** Configure S3 CDN distribution
5. **Caching:** Enable Next.js caching strategies

## Monitoring & Maintenance

- **Health Checks:** Configure in your hosting platform
- **Logs:** Monitor application and error logs
- **Backups:** Set up automated database backups
- **Updates:** Regularly update dependencies and Next.js
- **Security:** Monitor for security vulnerabilities

## Documentation

- [Coolify Deployment Guide](./docs/COOLIFY_DEPLOYMENT.md) - Complete step-by-step guide
- [Environment Variables](./docs/ENVIRONMENT_VARIABLES.md) - All environment variables
- [Stripe Setup](./docs/STRIPE_SETUP.md) - Payment configuration
- [Email Setup](./docs/EMAIL_SETUP.md) - Resend configuration
- [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) - Verification steps

## Support

- Check documentation in [`/docs`](./docs)
- Review [TODO.md](./TODO.md) for known issues
- Check deployment platform documentation

## Security

- All secrets stored in environment variables
- HTTPS enforced in production
- Database not exposed to public internet
- Regular security updates applied
- Follow [security checklist](./docs/COOLIFY_DEPLOYMENT.md#security-checklist)

---

**Ready to deploy?** Start with the [Coolify Deployment Guide](./docs/COOLIFY_DEPLOYMENT.md) →
