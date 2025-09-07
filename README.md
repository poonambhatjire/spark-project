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

## Authentication

This project uses **Supabase Authentication** for production-ready user management with the following features:

- ✅ **Email/Password Authentication** - Secure user registration and login
- ✅ **Email Verification** - Automatic email verification for new accounts
- ✅ **Session Management** - Secure JWT-based sessions with automatic refresh
- ✅ **Password Security** - Built-in password hashing and validation
- ✅ **Custom Domain Support** - Ready for custom domain deployment
- ✅ **Optional OAuth** - Can be extended with Google, GitHub, etc.

### Authentication Features

- **Sign Up**: Users can create accounts with email and password
- **Sign In**: Secure login with email verification
- **Protected Routes**: Dashboard and other sensitive pages require authentication
- **Session Persistence**: Users stay logged in across browser sessions
- **Automatic Redirects**: Seamless navigation between authenticated and public pages

### Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Database

The application uses Supabase PostgreSQL with the following tables:
- `profiles` - User profile information
- `time_entries` - Time tracking data
- `telemetry_events` - Usage analytics
- `contact_submissions` - Contact form submissions

### Deployment

The application is ready for deployment to Vercel, Netlify, or any other Next.js-compatible platform. Make sure to:

1. **Set up Supabase project** and configure the environment variables
2. **Deploy to your preferred platform** (Vercel recommended for Next.js)
3. **Configure custom domain** in Supabase for production use
4. **Set up email templates** in Supabase for verification emails

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
# Deployment trigger Sun Sep  7 15:31:45 PDT 2025
