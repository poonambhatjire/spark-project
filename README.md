# SPARC Calculator

A Next.js application for tracking antimicrobial stewardship activities with secure user authentication and admin management.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## ✨ Features

- **🔐 Secure Authentication** - Supabase-powered user management
- **⏱️ Time Tracking** - Log antimicrobial stewardship activities
- **👥 Admin Panel** - User management and analytics
- **📊 Analytics** - Activity tracking and reporting
- **🎨 Modern UI** - Built with Tailwind CSS and Next.js 15
- **♿ Accessibility** - WCAG compliant with automated testing

## 🔐 Authentication

**Supabase Authentication** with the following features:

- ✅ **Email/Password Authentication** - Secure user registration and login
- ✅ **No Email Verification** - Users can sign up and immediately sign in
- ✅ **Session Management** - Secure JWT-based sessions with automatic refresh
- ✅ **Password Security** - Built-in password hashing and validation
- ✅ **Role-based Access** - Admin and regular user roles
- ✅ **Row Level Security** - Users can only access their own data

### Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 🗄️ Database

**Supabase PostgreSQL** with the following tables:
- `profiles` - User profile information with role-based access
- `time_entries` - Time tracking data with user isolation
- `telemetry_events` - Usage analytics
- `contact_submissions` - Contact form submissions

### Database Setup

1. **Run the database scripts** in Supabase SQL Editor:
   - `database/add-datetime-timezone-support.sql` - Timezone and datetime support
   - `database/add-additional-survey-table.sql` - Time-in-motion survey
   - `database/add-burnout-survey-table.sql` - Burnout survey

2. **Set up your admin user** by updating the role in the profiles table

## 🚀 Deployment

Ready for deployment to Vercel, Netlify, or any Next.js-compatible platform:

1. **Set up Supabase project** and configure environment variables
2. **Deploy to your platform** (Vercel recommended)
3. **Configure custom domain** in Supabase settings
4. **Set `NEXT_PUBLIC_SITE_URL`** environment variable

See `PRODUCTION_CONFIG.md` for detailed deployment instructions.

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

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── admin/             # Admin panel
│   ├── dashboard/         # Main dashboard
│   ├── components/        # Reusable UI components
│   └── lib/               # Utility functions
├── lib/                   # Shared libraries
│   ├── actions/           # Server actions
│   ├── auth/              # Authentication logic
│   └── supabase/          # Supabase client configuration
└── tests/                 # Test files
```

## 📚 Documentation

- `PRODUCTION_CONFIG.md` - Production deployment guide
- `DISABLE_EMAIL_VERIFICATION.md` - Email verification configuration

## 🛠️ Development

```bash
# Run all checks (lint, typecheck, tests)
npm run check

# Run tests only
npm test

# Run accessibility tests
npm run test:a11y

# Clean test data
npm run clean:testdata
```

## 📄 License

This project is private and proprietary.
