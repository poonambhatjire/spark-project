This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Demo Authentication (temporary)

This project uses a demo-only session cookie (`sparc_demo_session`) set via server actions. It stores `{ email, issuedAt }` in base64. No password hashing, no persistence. Replace with a production provider (Auth.js/NextAuth, OIDC, SAML, or enterprise SSO) before deployment.

### Migration Steps to Production Auth

1. **Install Auth.js (NextAuth.js v5)**
   ```bash
   npm install next-auth@beta
   ```

2. **Set up Prisma for user persistence**
   ```bash
   npm install prisma @prisma/client
   npx prisma init
   ```

3. **Configure Auth.js with Credentials provider**
   - Create `src/lib/auth.ts` with Auth.js configuration
   - Add Prisma adapter for database persistence
   - Configure session strategy (JWT or database)
   - Set up environment variables for secrets

4. **Replace demo auth files**
   - Remove `src/lib/auth/` directory
   - Update `middleware.ts` to use Auth.js middleware
   - Replace server actions with Auth.js API routes
   - Update components to use `useSession()` hook

5. **Database schema for users**
   ```prisma
   model User {
     id        String   @id @default(cuid())
     email     String   @unique
     name      String?
     password  String?  // Hashed with bcrypt
     createdAt DateTime @default(now())
     updatedAt DateTime @updatedAt
   }
   ```

6. **Environment variables**
   ```env
   DATABASE_URL="postgresql://..."
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

7. **Update middleware**
   ```typescript
   export { auth as middleware } from "@/lib/auth"
   export const config = { matcher: ["/dashboard/:path*"] }
   ```

8. **Replace form components**
   - Use `signIn()` and `signOut()` from `next-auth/react`
   - Replace server actions with client-side auth calls
   - Update session handling in components

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run accessibility tests only
npm run test:a11y

# Run full check (lint, typecheck, tests)
npm run check
```

### Continuous Integration

The project includes comprehensive CI checks that run:

- **Linting**: ESLint with Next.js configuration
- **Type Checking**: TypeScript strict mode validation
- **Unit Tests**: Vitest with React Testing Library
- **Accessibility Tests**: jest-axe for WCAG compliance

```bash
npm run check  # Runs all CI checks
```

### Test Data Cleanup

After manual QA or testing, you may need to clear test data from localStorage. Run the cleanup script:

```bash
npm run clean:testdata
```

This will provide instructions for clearing test data in the browser console.

**Manual cleanup in browser console:**
```javascript
localStorage.removeItem("sparc.entries.v1");
```

**Alternative: Clear all localStorage data:**
```javascript
localStorage.clear();
```

⚠️ **Note:** `localStorage.clear()` will remove ALL localStorage data, not just SPARC entries.
