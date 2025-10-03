# Repo TODO

This file exports the checked ticklist from `.github/copilot-instructions.md` and provides a small, maintainable list of work items and the project's testing philosophy.

## Testing philosophy (short)
We prefer a feature-first testing approach: build a feature, manually verify it, then add focused automated tests (unit/integration) for that feature. Avoid running full monorepo test suites for every small change. Use CI to run the full test suite before merging.

---

## Core Features (From Specification)
- [x] Set up Next.js project with App Router, Tailwind CSS, Prisma, and Next-Auth v5
- [x] Configure PostgreSQL database with Prisma schema (User, Project, Document, Claim, Link models)
- [x] Implement authentication with Next-Auth v5 (login/logout, route protection)
- [x] Create user dashboard showing projects overview
- [x] Implement project creation (createProject server action)
- [x] Add file upload functionality with blob storage integration (generateUploadUrl, createDocument server actions)
- [x] Build claim extraction feature (extractClaims server action calling Python service)
- [x] Develop claim & linking workspace UI (interactive component for linking claims to references)
- [x] Implement PDF pack generation (generatePack server action using PDF-Lib)
- [ ] Set up deployment on Coolify with environment variables

## UI/UX Enhancements
- [x] Design modern, professional UI with pharmaceutical industry aesthetic (clean, trustworthy, efficient)
- [x] Implement responsive design for desktop and tablet use (mobile secondary)
- [x] Add drag-and-drop file upload interface
- [x] Integrate PDF viewer for source and reference documents
- [x] Create intuitive claim-linking interface (drag-and-drop or checkbox-based)
- [x] Add progress indicators for long-running operations (upload, extraction, generation)
- [x] Implement toast notifications for success/error feedback
- [x] Design loading states and skeleton screens
- [x] Add animations and transitions for smooth user experience
- [x] Create onboarding flow for new users

## Additional Features for Value Proposition
- [ ] Build ROI calculator showing time and cost savings
- [ ] Add demo mode with sample data for prospects
- [ ] Implement project templates for common pharma materials
- [ ] Create usage analytics dashboard for managers
- [ ] Add export options (PDF, CSV reports)
- [ ] Implement search and filtering for claims and documents
- [ ] Add collaboration features (comments, sharing within team)
- [ ] Create audit trail and compliance reporting
- [ ] Add version control for projects and documents
- [ ] Implement bulk operations for multiple claims/documents

## Technical Improvements
- [x] Add comprehensive error handling and logging
- [x] Implement rate limiting and security measures
- [x] Add data validation with Zod schemas
- [ ] Optimize performance for large PDF files
- [ ] Implement caching strategies
- [ ] Add automated testing (unit, integration) — follow Testing philosophy above
- [ ] Set up CI/CD pipeline
- [ ] Add monitoring and analytics
- [ ] Implement backup and recovery procedures

## Business and Sales Features
- [ ] Create landing page with value proposition and demo
- [ ] Add pricing page with tier comparisons
- [ ] Implement subscription management
- [ ] Add customer support chat or ticketing
- [ ] Create help center with tutorials and FAQs
- [ ] Add referral program
- [ ] Implement A/B testing for UI improvements
- [ ] Add integration with popular pharma tools (if applicable)
- [ ] Create case studies and testimonials section
- [ ] Add newsletter signup for industry updates

## Payments (new)

We need a payments system that supports both enterprise (pharma companies) and individual users (consultants, contractors, and employees of pharma companies who may pay out-of-pocket). Consider these flows and integration points:

- Enterprise (preferred by pharma):
	- Invoicing + Purchase Order (PO) support: allow enterprise accounts to pay via invoice/PO with net terms. Provide fields for company billing contact, VAT/Tax IDs, and billing addresses.
	- SSO / enterprise onboarding: sales teams create enterprise accounts and associate users, with seat-based or feature-based billing.
	- Offline payment reconciliation: support manual marking of invoices paid and webhook-driven accounting sync.
	- Integration with payment processors that support ACH/bank transfers and card-on-file (Stripe, Adyen or Braintree + invoicing tools). Consider a B2B billing flow (Stripe Billing with Invoicing or a dedicated invoicing provider) and an exportable CSV for finance.

- Individual payers (preferred by users):
	- Card payments via Stripe (checkout or Stripe Elements) for monthly/annual subscriptions or one-off purchases.
	- OAuth + quick pay flows for in-app purchases (Stripe Checkout with client-side integration).
	- Email receipts and self-service billing portal to update cards, view invoices, cancel subscriptions.

- Compliance & procurement considerations:
	- Provide invoice PDFs and clear tax fields. Support different billing addresses per project if needed.
	- Add role-based access so only billing admins can view/change billing details.

Next implementation tasks (TODOs):
- [ ] Design billing data model (accounts, subscriptions, seats, invoices, payments) in Prisma schema and migration.
- [ ] Integrate Stripe (or chosen provider) for enterprise & consumer flows; add webhooks for invoice/payment events.
- [ ] Build Billing UI (billing settings, payment method editor, invoices list, billing contacts).
- [ ] Implement server actions for creating subscriptions, submitting invoices, applying credits, and reconciling payments.
- [ ] Add exportable invoice reports for finance (CSV, PDF) and a way to mark manual payments.


## Compliance and Security
- [ ] Ensure GDPR compliance for data handling
- [ ] Add data encryption for sensitive pharma information
- [ ] Implement access controls and permissions
- [ ] Add audit logging for all user actions
- [ ] Ensure HIPAA-like security for health-related data
- [ ] Add watermarking for demo/trial versions

## Future Enhancements (Post-MVP)
- [ ] AI-powered claim suggestion
- [ ] Integration with PubMed or other medical databases
- [ ] Mobile app companion
- [ ] API for third-party integrations
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Custom branding for enterprise clients
