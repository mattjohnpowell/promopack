# Coding Standards for Promopack

This document outlines the coding standards and best practices to follow for the Promopack project. These standards ensure consistency, maintainability, and quality across the codebase. All team members must adhere to these guidelines for every code change.

## General Principles

- **Consistency**: Follow the established patterns in the codebase.
- **Readability**: Code should be self-documenting. Use clear variable names, comments where necessary, and logical structure.
- **Maintainability**: Write code that is easy to modify, extend, and debug.
- **Performance**: Optimize for performance without sacrificing readability.
- **Security**: Prioritize security, especially in authentication and data handling.

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js (v5 beta)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Zod
- **Password Hashing**: bcryptjs

## Code Style

### TypeScript

- Use TypeScript for all new code. Avoid `any` types; use proper typing.
- Define interfaces and types for complex objects.
- Use strict mode in `tsconfig.json`.

### ESLint and Prettier

- Run ESLint and Prettier before committing.
- Follow the project's ESLint configuration.
- Use Prettier for consistent formatting.

### Naming Conventions

- **Variables and Functions**: camelCase (e.g., `userEmail`, `getUserData`)
- **Components**: PascalCase (e.g., `SignInForm`)
- **Files**: kebab-case for components (e.g., `sign-in-form.tsx`), camelCase for utilities (e.g., `passwordUtils.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_ATTEMPTS`)

### File Structure

- Use the App Router structure under `app/`.
- Place reusable components in `components/`.
- Utilities in `utils/`.
- Library configurations in `lib/`.
- Authentication config in root `auth.ts`.

## Authentication

- Use NextAuth.js for all authentication logic.
- Store sensitive data securely; never log passwords or tokens.
- Validate inputs using Zod schemas.
- Handle errors gracefully without exposing sensitive information.

## Database

- **Migrations Only**: We should only ever migrate the database. Never make direct schema changes outside of Prisma migrations. Always use `prisma migrate dev` or `prisma db push` for development, and proper migrations for production.
- Use Prisma Client for all database interactions.
- Define models clearly in `schema.prisma`.
- Use transactions for multi-step operations.
- Avoid raw SQL unless necessary; prefer Prisma's query methods.

## Components

- Use functional components with hooks.
- Keep components small and focused on a single responsibility.
- Use Tailwind for styling; avoid inline styles.
- Handle loading and error states appropriately.

## API Routes

- Use App Router API routes under `app/api/`.
- Validate request bodies with Zod.
- Return consistent response formats (e.g., JSON with status codes).
- Use middleware for authentication checks.

## Testing

- Write unit tests for utilities and components.
- Use integration tests for API routes.
- Aim for good test coverage.
- Run tests before committing.

## Git Practices

- Use descriptive commit messages.
- Create feature branches for new work.
- Use pull requests for code reviews.
- Squash commits when merging.

## Security

- Sanitize user inputs.
- Use HTTPS in production.
- Store secrets in environment variables.
- Regularly update dependencies for security patches.

## Performance

- Optimize images and assets.
- Use Next.js optimizations like `Image` component.
- Minimize bundle size.
- Profile and monitor performance.

## Documentation

- Document complex logic with comments.
- Update this standards document as needed.
- Maintain a README.md for project setup and usage.

## Enforcement

- Code reviews will check adherence to these standards.
- Automated tools (ESLint, Prettier) will enforce style.
- Violations should be addressed promptly.

This document will be updated as the project evolves. Contributions to improve these standards are welcome.