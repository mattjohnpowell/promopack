<!-- copilot-instructions: concise, repo-specific guidance for AI coding agents -->

# [Project Name] — Copilot Instructions (concise)

Summary: [Project Name] is a Next.js (App Router) web app that uses Prisma/Postgres, Next-Auth v5, server actions, and external services for file storage and a Python-based claim extractor. Keep edits minimal and follow existing patterns for server actions, database access, and revalidation.

- Project roots and key files:
	- `app/actions.ts` — canonical server actions (signUp, generateUploadUrl, createDocument, extractClaims, createLink, deleteLink, generatePack). Use this as the primary example for auth checks, Prisma usage, and revalidatePath calls.
	- `utils/` — helpers: `db.ts` (Prisma client), `storage.ts` (S3 upload presign), `password.ts` (salt/hash), `templates.ts`.
	- `prisma/schema.prisma` and `generated/prisma/*` — DB models and generated client; use Prisma client patterns already present (findUnique, findFirst, create, createMany).
	- `app/api/auth/[...nextauth]/route.ts` — authentication wiring (Next-Auth v5). Follow existing session/auth patterns (`auth()` usage in server actions).
	- `package.json` — dev commands: `npm run dev` (runs `next dev --turbopack -p 3032`) and `npm run build`.

- Architectural notes (big picture):
	- Frontend: Next.js App Router with server actions for most write operations. Components call server actions directly (no separate REST API layer).
	- Persistence: Prisma + Postgres (migrations in `prisma/migrations`). Always use the `prisma` client from `utils/db.ts`.
	- File storage: `utils/storage.ts` exposes `generateUploadUrl` that returns presigned S3 URLs; uploads happen client-side and `createDocument` stores the returned download URL.
	- Claim extraction: `extractClaims` calls an external Python extraction service using environment variables `EXTRACTOR_API_URL` and `EXTRACTOR_API_KEY`. Validate env presence before calling.
	- Pack generation: `generatePack` currently returns a text report; future work expects `pdf-lib` usage. Keep current returns stable.

- Patterns & conventions to follow (concrete):
	- Auth check pattern: call `const session = await auth()` and verify `session?.user?.email` before DB ops (see `app/actions.ts`).
	- Ownership checks: use `prisma.findFirst` with `userId` or nested checks (e.g., claim → project → userId) to confirm permissions.
	- Error handling: throw descriptive Error messages; log with `console.error` before throwing (see examples in `createDocument`, `extractClaims`).
	- Revalidation: after state-changing operations call `revalidatePath('/projects/${projectId}')` to update pages served from cache.
	- File-type constraints: uploads are restricted to PDFs (server action checks fileType startsWith `application/pdf`).

- Developer workflows & commands (executable):
	- Start dev server: `npm run dev` (Next.js on port 3032).
	- Build: `npm run build` then `npm run start`.
	```instructions
	<!-- copilot-instructions: concise, repo-specific guidance for AI coding agents -->

	# [Project Name] — Copilot Instructions (concise + checklist)

	Summary: [Project Name] is a Next.js (App Router) app using Prisma/Postgres, Next-Auth v5, server actions, and an external Python claim-extractor service. Prefer small, incremental edits that re-use existing server-action, Prisma, and revalidation patterns.

	Quick checklist (use the tick list when editing):

	- [x] Verify auth pattern: `const session = await auth()` and require `session?.user?.email` before DB writes.
	- [x] Use the shared Prisma client from `utils/db.ts` (`prisma`) for DB access.
	- [x] Replicate ownership checks using `prisma.findFirst({ where: { id, userId }})` or nested relations (see `app/actions.ts`).
	- [x] Validate document types (`SOURCE` | `REFERENCE`) and file types (server actions allow PDFs only: `fileType.startsWith('application/pdf')`).
	- [x] After mutations, call `revalidatePath(`/projects/${projectId}`)` to refresh cached pages.
	- [x] If changing schema, add a Prisma migration and regenerate the client; `generated/prisma` is committed here.

	Verification notes (quick evidence):

	- Auth checks: present in `app/actions.ts` (e.g. `generateUploadUrl`, `createDocument`, `extractClaims`) and `app/dashboard/*` pages — look for `const session = await auth()`.
	- Prisma client usage: `import { prisma } from "@/utils/db"` found in `app/actions.ts` and `app/projects/[id]/page.tsx`.
	- Ownership checks: `prisma.project.findFirst({ where: { id: projectId, userId: user.id }})` used in several server actions (see `generateUploadUrl`, `createDocument`).
	- File/type validation: `fileType.startsWith("application/pdf")` and `if (!["SOURCE","REFERENCE"].includes(type))` checks are implemented in `app/actions.ts`.
	- Revalidation: `revalidatePath(`/projects/${projectId}`)` is called after document/claim/link mutations in `app/actions.ts`.
	- Migrations & client: `prisma/migrations/` exists and `generated/prisma` is committed in the repo root.

	Concise patterns & examples to copy verbatim:

	- Auth + ownership: `auth()` → `prisma.user.findUnique({ where: { email: session.user.email }})` → `prisma.project.findFirst({ where: { id: projectId, userId: user.id }})` (see `generateUploadUrl`).
	- External extractor call: `extractClaims` POSTs to `process.env.EXTRACTOR_API_URL` with `EXTRACTOR_API_KEY` and uses `prisma.claim.createMany` to bulk insert.
	- Upload flow: server action calls `utils/storage.generateUploadUrl()` and returns `{ uploadUrl, downloadUrl }`; client uploads directly to S3.

	Short copy-paste examples (use these in server actions):

	```ts
	// 1) Auth + ownership check
	const session = await auth();
	if (!session?.user?.email) throw new Error('Unauthorized');
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
	if (!project) throw new Error('Project not found or access denied');
	// ...perform mutation and then revalidate
	revalidatePath(`/projects/${projectId}`);
	```

	```ts
	// 2) Call extractor service and bulk-insert claims
	const extractorApiUrl = process.env.EXTRACTOR_API_URL;
	const extractorApiKey = process.env.EXTRACTOR_API_KEY;
	if (!extractorApiUrl || !extractorApiKey) throw new Error('Extractor not configured');

	const res = await fetch(`${extractorApiUrl}/extract-claims`, {
		method: 'POST',
		headers: { 'Authorization': `Bearer ${extractorApiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ document_url: sourceDocUrl }),
	});
	if (!res.ok) throw new Error(`Extractor error ${res.status}`);
	const data = await res.json();
	if (!Array.isArray(data.claims)) throw new Error('Invalid extractor response');
	await prisma.claim.createMany({ data: data.claims.map((c: any) => ({ text: c.text, page: c.page, projectId })) });
	revalidatePath(`/projects/${projectId}`);
	```

	```ts
	// 3) Generate presigned upload URL (storage helper)
	const { generateUploadUrl } = await import('@/utils/storage');
	const { uploadUrl, downloadUrl } = await generateUploadUrl(fileName, fileType);
	// return uploadUrl to client; client uploads file directly to S3 and then calls createDocument with downloadUrl
	```

	Key commands (copyable):

	```powershell
	npm run dev    # dev server (next dev --turbopack -p 3032)
	npm run build  # build (next build --turbopack)
	npm run start  # start production server
	npm run lint   # run eslint
	```

Development Environment Notes:

- The user will try to keep `npm run dev` running at all times for testing on port 3032.
- If you need to poll the dev server, use curl (e.g., `curl http://localhost:3032`) or PowerShell equivalent (e.g., `Invoke-WebRequest http://localhost:3032`).
- If you need control of the terminal, ask the user to stop the session and let you have it.

Note on local checks

- Don't run the full linting/typecheck suite on every small change. Prefer the feature-first approach described in the Testing philosophy: implement the feature, run focused unit or integration tests locally if needed, then run `npm run build` or CI-based checks before merging. Running the entire repo lint/tsc frequently is noisy and slows iteration; use targeted checks (single file or package) during development.

	Files to read first (highest signal):

	- `app/actions.ts` — canonical server actions and examples for auth, ownership, revalidation, and error logging.
	- `utils/db.ts`, `utils/storage.ts`, `utils/password.ts` — small utilities used throughout.
	- `app/api/auth/[...nextauth]/route.ts` — Next-Auth v5 wiring and session shape.
	- `prisma/schema.prisma` and `generated/prisma/` — DB schema and generated client.

	Project-specific gotchas:

	- Server actions are the primary write path — don't introduce parallel REST endpoints unless justified.
	- Error-handling convention: log with `console.error(...)` and then `throw new Error('user-friendly message')`.
	- The extractor service must be present in envs for `extractClaims` to work; prefer failing fast and documenting missing envs.

	Important env vars:

	- `DATABASE_URL` — Postgres for Prisma.
	- `EXTRACTOR_API_URL`, `EXTRACTOR_API_KEY` — claim-extractor service.
	- AWS creds used by `utils/storage.ts` (check that file for exact names).
	- `NEXTAUTH_SECRET` and any Next-Auth redirect/callback config in `app/api/auth`.

	Stripe env vars (payments)

	- `STRIPE_SECRET_KEY` — server-side secret key for Stripe API calls.
	- `STRIPE_WEBHOOK_SECRET` — webhook secret to verify incoming Stripe events.
	- When integrating Stripe, prefer using Stripe Billing for subscriptions and Stripe Invoicing for enterprise invoicing flows. Store secrets securely and add them to your deployment environment.

	When changing database models:

	- Create a migration (e.g. `npx prisma migrate dev --name <desc>`), run it locally, and regenerate the client. Keep `generated/prisma` in sync.

	Notes after schema changes:

	- After editing `prisma/schema.prisma`, run:

	```bash
	npx prisma migrate dev --name add-billing
	```

	- Then regenerate the client (if your repo commits generated client files, update them):

	```bash
	npx prisma generate
	```

	If `generated/prisma` is committed in your repo, ensure the generated client is updated and checked in after the migration.

	When in doubt:

	- Follow `app/actions.ts` patterns. If an external service or env isn't available, add a clear error message and a short comment describing required envs.

	If you'd like both the tick list and a short examples section with 2–3 code snippets extracted from `app/actions.ts`, reply with which topics to expand: auth, prisma, extractor, or storage.

	```

# PromoPack — Copilot Instructions (concise)

Summary: PromoPack is a Next.js (App Router) web app that uses Prisma/Postgres, Next-Auth v5, server actions, and external services for file storage and a Python-based claim extractor. Keep edits minimal and follow existing patterns for server actions, database access, and revalidation.

- Project roots and key files:
	- `app/actions.ts` — canonical server actions (signUp, generateUploadUrl, createDocument, extractClaims, createLink, deleteLink, generatePack). Use this as the primary example for auth checks, Prisma usage, and revalidatePath calls.
	- `utils/` — helpers: `db.ts` (Prisma client), `storage.ts` (S3 upload presign), `password.ts` (salt/hash), `templates.ts`.
	- `prisma/schema.prisma` and `generated/prisma/*` — DB models and generated client; use Prisma client patterns already present (findUnique, findFirst, create, createMany).
	- `app/api/auth/[...nextauth]/route.ts` — authentication wiring (Next-Auth v5). Follow existing session/auth patterns (`auth()` usage in server actions).
	- `package.json` — dev commands: `npm run dev` (runs `next dev --turbopack -p 3032`) and `npm run build`.

- Architectural notes (big picture):
	- Frontend: Next.js App Router with server actions for most write operations. Components call server actions directly (no separate REST API layer).
	- Persistence: Prisma + Postgres (migrations in `prisma/migrations`). Always use the `prisma` client from `utils/db.ts`.
	- File storage: `utils/storage.ts` exposes `generateUploadUrl` that returns presigned S3 URLs; uploads happen client-side and `createDocument` stores the returned download URL.
	- Claim extraction: `extractClaims` calls an external Python extraction service using environment variables `EXTRACTOR_API_URL` and `EXTRACTOR_API_KEY`. Validate env presence before calling.
	- Pack generation: `generatePack` currently returns a text report; future work expects `pdf-lib` usage. Keep current returns stable.

- Patterns & conventions to follow (concrete):
	- Auth check pattern: call `const session = await auth()` and verify `session?.user?.email` before DB ops (see `app/actions.ts`).
	- Ownership checks: use `prisma.findFirst` with `userId` or nested checks (e.g., claim → project → userId) to confirm permissions.
	- Error handling: throw descriptive Error messages; log with `console.error` before throwing (see examples in `createDocument`, `extractClaims`).
	- Revalidation: after state-changing operations call `revalidatePath('/projects/${projectId}')` to update pages served from cache.
	- File-type constraints: uploads are restricted to PDFs (server action checks fileType startsWith `application/pdf`).

- Developer workflows & commands (executable):
	- Start dev server: `npm run dev` (Next.js on port 3032).
	- Build: `npm run build` then `npm run start`.
	```instructions
	<!-- copilot-instructions: concise, repo-specific guidance for AI coding agents -->

	# PromoPack — Copilot Instructions (concise + checklist)

	Summary: PromoPack is a Next.js (App Router) app using Prisma/Postgres, Next-Auth v5, server actions, and an external Python claim-extractor service. Prefer small, incremental edits that re-use existing server-action, Prisma, and revalidation patterns.

	Quick checklist (use the tick list when editing):

	- [x] Verify auth pattern: `const session = await auth()` and require `session?.user?.email` before DB writes.
	- [x] Use the shared Prisma client from `utils/db.ts` (`prisma`) for DB access.
	- [x] Replicate ownership checks using `prisma.findFirst({ where: { id, userId }})` or nested relations (see `app/actions.ts`).
	- [x] Validate document types (`SOURCE` | `REFERENCE`) and file types (server actions allow PDFs only: `fileType.startsWith('application/pdf')`).
	- [x] After mutations, call `revalidatePath(`/projects/${projectId}`)` to refresh cached pages.
	- [x] If changing schema, add a Prisma migration and regenerate the client; `generated/prisma` is committed here.

	Verification notes (quick evidence):

	- Auth checks: present in `app/actions.ts` (e.g. `generateUploadUrl`, `createDocument`, `extractClaims`) and `app/dashboard/*` pages — look for `const session = await auth()`.
	- Prisma client usage: `import { prisma } from "@/utils/db"` found in `app/actions.ts` and `app/projects/[id]/page.tsx`.
	- Ownership checks: `prisma.project.findFirst({ where: { id: projectId, userId: user.id }})` used in several server actions (see `generateUploadUrl`, `createDocument`).
	- File/type validation: `fileType.startsWith("application/pdf")` and `if (!["SOURCE","REFERENCE"].includes(type))` checks are implemented in `app/actions.ts`.
	- Revalidation: `revalidatePath(`/projects/${projectId}`)` is called after document/claim/link mutations in `app/actions.ts`.
	- Migrations & client: `prisma/migrations/` exists and `generated/prisma` is committed in the repo root.

	Concise patterns & examples to copy verbatim:

	- Auth + ownership: `auth()` → `prisma.user.findUnique({ where: { email: session.user.email }})` → `prisma.project.findFirst({ where: { id: projectId, userId: user.id }})` (see `generateUploadUrl`).
	- External extractor call: `extractClaims` POSTs to `process.env.EXTRACTOR_API_URL` with `EXTRACTOR_API_KEY` and uses `prisma.claim.createMany` to bulk insert.
	- Upload flow: server action calls `utils/storage.generateUploadUrl()` and returns `{ uploadUrl, downloadUrl }`; client uploads directly to S3.

	Short copy-paste examples (use these in server actions):

	```ts
	// 1) Auth + ownership check
	const session = await auth();
	if (!session?.user?.email) throw new Error('Unauthorized');
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	const project = await prisma.project.findFirst({ where: { id: projectId, userId: user.id } });
	if (!project) throw new Error('Project not found or access denied');
	// ...perform mutation and then revalidate
	revalidatePath(`/projects/${projectId}`);
	```

	```ts
	// 2) Call extractor service and bulk-insert claims
	const extractorApiUrl = process.env.EXTRACTOR_API_URL;
	const extractorApiKey = process.env.EXTRACTOR_API_KEY;
	if (!extractorApiUrl || !extractorApiKey) throw new Error('Extractor not configured');

	const res = await fetch(`${extractorApiUrl}/extract-claims`, {
		method: 'POST',
		headers: { 'Authorization': `Bearer ${extractorApiKey}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ document_url: sourceDocUrl }),
	});
	if (!res.ok) throw new Error(`Extractor error ${res.status}`);
	const data = await res.json();
	if (!Array.isArray(data.claims)) throw new Error('Invalid extractor response');
	await prisma.claim.createMany({ data: data.claims.map((c: any) => ({ text: c.text, page: c.page, projectId })) });
	revalidatePath(`/projects/${projectId}`);
	```

	```ts
	// 3) Generate presigned upload URL (storage helper)
	const { generateUploadUrl } = await import('@/utils/storage');
	const { uploadUrl, downloadUrl } = await generateUploadUrl(fileName, fileType);
	// return uploadUrl to client; client uploads file directly to S3 and then calls createDocument with downloadUrl
	```

	Key commands (copyable):

	```powershell
	npm run dev    # dev server (next dev --turbopack -p 3032)
	npm run build  # build (next build --turbopack)
	npm run start  # start production server
	npm run lint   # run eslint
	```

Development Environment Notes:

- The user will try to keep `npm run dev` running at all times for testing on port 3032.
- If you need to poll the dev server, use curl (e.g., `curl http://localhost:3032`) or PowerShell equivalent (e.g., `Invoke-WebRequest http://localhost:3032`).
- If you need control of the terminal, ask the user to stop the session and let you have it.

Note on local checks

- Don't run the full linting/typecheck suite on every small change. Prefer the feature-first approach described in the Testing philosophy: implement the feature, run focused unit or integration tests locally if needed, then run `npm run build` or CI-based checks before merging. Running the entire repo lint/tsc frequently is noisy and slows iteration; use targeted checks (single file or package) during development.

	Files to read first (highest signal):

	- `app/actions.ts` — canonical server actions and examples for auth, ownership, revalidation, and error logging.
	- `utils/db.ts`, `utils/storage.ts`, `utils/password.ts` — small utilities used throughout.
	- `app/api/auth/[...nextauth]/route.ts` — Next-Auth v5 wiring and session shape.
	- `prisma/schema.prisma` and `generated/prisma/` — DB schema and generated client.

	Project-specific gotchas:

	- Server actions are the primary write path — don't introduce parallel REST endpoints unless justified.
	- Error-handling convention: log with `console.error(...)` and then `throw new Error('user-friendly message')`.
	- The extractor service must be present in envs for `extractClaims` to work; prefer failing fast and documenting missing envs.

	Important env vars:

	- `DATABASE_URL` — Postgres for Prisma.
	- `EXTRACTOR_API_URL`, `EXTRACTOR_API_KEY` — claim-extractor service.
	- AWS creds used by `utils/storage.ts` (check that file for exact names).
	- `NEXTAUTH_SECRET` and any Next-Auth redirect/callback config in `app/api/auth`.

	Stripe env vars (payments)

	- `STRIPE_SECRET_KEY` — server-side secret key for Stripe API calls.
	- `STRIPE_WEBHOOK_SECRET` — webhook secret to verify incoming Stripe events.
	- When integrating Stripe, prefer using Stripe Billing for subscriptions and Stripe Invoicing for enterprise invoicing flows. Store secrets securely and add them to your deployment environment.

	When changing database models:

	- Create a migration (e.g. `npx prisma migrate dev --name <desc>`), run it locally, and regenerate the client. Keep `generated/prisma` in sync.

	Notes after schema changes:

	- After editing `prisma/schema.prisma`, run:

	```bash
	npx prisma migrate dev --name add-billing
	```

	- Then regenerate the client (if your repo commits generated client files, update them):

	```bash
	npx prisma generate
	```

	If `generated/prisma` is committed in your repo, ensure the generated client is updated and checked in after the migration.

	When in doubt:

	- Follow `app/actions.ts` patterns. If an external service or env isn't available, add a clear error message and a short comment describing required envs.

	If you'd like both the tick list and a short examples section with 2–3 code snippets extracted from `app/actions.ts`, reply with which topics to expand: auth, prisma, extractor, or storage.

	```
