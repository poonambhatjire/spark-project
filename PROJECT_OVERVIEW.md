# SPARC Calculator - Project Overview for Peers

## 📋 Table of Contents
1. [What is This Project?](#what-is-this-project)
2. [Project Background](#project-background)
3. [Technologies Used](#technologies-used)
4. [Project Architecture](#project-architecture)
5. [Database Structure](#database-structure)
6. [How It Works](#how-it-works)
7. [Where It's Running](#where-its-running)
8. [Key Features](#key-features)

---

## What is This Project?

**SPARC Calculator** (Staffing Calculator for Antimicrobial Stewardship Programs) is a web application that helps healthcare professionals track time spent on antimicrobial stewardship activities. It's designed to help hospitals and healthcare institutions understand how much time staff spend on different stewardship tasks, which helps them make informed decisions about staffing needs.

### Simple Explanation
Think of it like a time-tracking app (like what you might use to log work hours), but specifically designed for healthcare professionals working on antimicrobial stewardship - which involves managing and optimizing how antibiotics are used in hospitals.

---

## Project Background

### Why Was This Built?
Healthcare institutions need to determine the right number of staff for their Antimicrobial Stewardship Programs. To do this effectively, they need data about how much time different activities take. This application collects that time-tracking data in an organized way.

### The Problem It Solves
- **Before:** Staff might track their time on paper or spreadsheets, which is hard to analyze
- **After:** Staff log activities digitally, and administrators can see patterns, totals, and trends automatically

---

## Technologies Used

### 1. **Next.js 15** (Frontend Framework)
**What it is:** A popular framework for building web applications using React  
**Why we use it:**
- Makes building modern web pages easier and faster
- Handles routing (navigation between pages) automatically
- Supports server-side rendering for better performance
- Very popular in the industry (good for learning and getting help)

**File:** `package.json` shows `"next": "15.4.8"`

### 2. **TypeScript** (Programming Language)
**What it is:** JavaScript with type checking - catches errors before they happen  
**Why we use it:**
- Helps prevent bugs by catching mistakes while writing code
- Makes code easier to understand (you can see what data types are expected)
- Industry standard for large projects

**File:** `tsconfig.json` contains TypeScript configuration

### 3. **React 19** (UI Library)
**What it is:** A library for building user interfaces with reusable components  
**Why we use it:**
- Allows building the page as separate, reusable pieces (components)
- Very popular and well-supported
- Works seamlessly with Next.js

**File:** `package.json` shows `"react": "19.1.2"`

### 4. **Tailwind CSS** (Styling)
**What it is:** A CSS framework for quickly styling web pages  
**Why we use it:**
- Write styles directly in the code without separate CSS files
- Consistent design system
- Makes the app look modern and professional

**File:** `tailwind.config.js` contains Tailwind configuration

### 5. **Supabase** (Backend & Database)
**What it is:** A platform that provides database and authentication services  
**Why we use it:**
- **Database:** Stores all the time entries, user profiles, etc.
- **Authentication:** Handles user login, signup, and security
- **Row-Level Security:** Ensures users can only see their own data
- Much easier than setting up your own server and database

**Files:** 
- `src/lib/supabase/server.ts` - Database connection for server-side
- `src/lib/supabase/client.ts` - Database connection for browser-side

### 6. **PostgreSQL** (Database System)
**What it is:** The actual database that Supabase uses to store data  
**Why we use it:**
- Reliable and fast
- Handles complex queries well
- Industry standard for web applications

---

## Project Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User's Browser                        │
│  (Views pages, fills forms, clicks buttons)              │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP Requests
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js Application                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Frontend (React Components)                    │   │
│  │  - Landing Page                                 │   │
│  │  - Dashboard                                    │   │
│  │  - Admin Panel                                  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Server Actions (Business Logic)                │   │
│  │  - Create/Update/Delete time entries            │   │
│  │  - User authentication                          │   │
│  │  - Admin operations                             │   │
│  └─────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Supabase Platform                      │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Authentication  │  │   PostgreSQL     │            │
│  │  (User Login)    │  │   Database       │            │
│  │                  │  │   (Data Storage) │            │
│  └──────────────────┘  └──────────────────┘            │
└─────────────────────────────────────────────────────────┘
```

### Folder Structure

```
spark-project/
├── src/
│   ├── app/                      # Next.js pages (App Router)
│   │   ├── page.tsx             # Landing/home page
│   │   ├── dashboard/           # Main user dashboard
│   │   ├── admin/               # Admin panel
│   │   ├── (auth)/              # Login/signup pages
│   │   │   ├── sign-in/
│   │   │   ├── sign-up/
│   │   │   └── reset-password/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layout/         # Header, Footer
│   │   │   ├── ui/             # Buttons, forms, cards
│   │   │   └── admin/          # Admin-specific components
│   │   └── api/                # API endpoints
│   │       └── keep-alive/     # Keeps database awake
│   └── lib/                    # Shared code
│       ├── actions/            # Server actions (database operations)
│       │   ├── time-entries.ts # CRUD for time entries
│       │   ├── user-profile.ts # User profile management
│       │   └── admin.ts        # Admin operations
│       ├── supabase/           # Database connections
│       │   ├── server.ts       # Server-side client
│       │   └── client.ts       # Browser-side client
│       └── auth/               # Authentication helpers
├── database/                    # Database scripts
│   ├── backup-strategy.sql     # Backup procedures
│   └── *.sql                   # Migration scripts
├── public/                      # Static files (images, logos)
├── package.json                # Dependencies and scripts
└── next.config.ts              # Next.js configuration
```

### How Data Flows

1. **User Action:** User fills out a form to log time
2. **Server Action:** Form submits to a server action (like `createTimeEntry()`)
3. **Authentication:** Server checks if user is logged in
4. **Database Query:** Server sends query to Supabase
5. **Supabase:** Checks security rules, saves data to PostgreSQL
6. **Response:** Data sent back to browser
7. **UI Update:** Page updates to show new entry

---

## Database Structure

### Overview
All data is stored in a **PostgreSQL database** hosted by Supabase. The database uses **Row-Level Security (RLS)** which means:
- Each user can only see their own data
- Even if someone tries to access the database directly, they can't see other users' information

### Core Tables

#### 1. **`profiles`** - User Information
**Purpose:** Stores information about each registered user

**Key Columns:**
- `id` - Unique identifier (linked to authentication)
- `email` - User's email address
- `name` - User's full name
- `role` - Either "user", "admin", or "super_admin"
- `organization` - Where they work
- `department` - Their department
- `specialty` - Their medical specialty
- `timezone` - Their timezone preference
- `created_at` - When account was created

**Example Data:**
```
id: "123e4567-e89b-12d3-a456-426614174000"
email: "doctor@hospital.com"
name: "Dr. Jane Smith"
role: "user"
organization: "City Hospital"
department: "Infectious Diseases"
```

#### 2. **`time_entries`** - Time Tracking Data
**Purpose:** Stores each logged activity/time entry

**Key Columns:**
- `id` - Unique identifier for this entry
- `user_id` - Which user created this entry (links to profiles)
- `task` - Type of activity (see list below)
- `minutes` - How many minutes spent (1-480)
- `occurred_on` - Date and time when activity happened
- `comment` - Optional notes
- `created_at` - When entry was logged
- `deleted_at` - Soft delete (marks as deleted without removing)

**Activity Types (`task` field):**
- **Patient Care:**
  - Prospective Audit & Feedback
  - Authorization of Restricted Antimicrobials
  - Participating in Clinical Rounds

- **Administrative:**
  - Guidelines/EHR
  - Committee Work
  - QI projects/research
  - Emails

- **Tracking:**
  - AMU (Antimicrobial Use)
  - AMR (Antimicrobial Resistance)
  - Antibiotic Appropriateness
  - Intervention Acceptance

- **Reporting:**
  - Sharing data with prescribers/decision makers

- **Education:**
  - Providing Education
  - Receiving Education

- **Other:**
  - Other activities (with comments)

**Example Data:**
```
id: "456e7890-e89b-12d3-a456-426614174111"
user_id: "123e4567-e89b-12d3-a456-426614174000"
task: "Patient Care - Prospective Audit & Feedback"
minutes: 45
occurred_on: "2025-01-15 10:30:00"
comment: "Reviewed 12 cases this morning"
```

#### 3. **`contact_submissions`** - Contact Form Data
**Purpose:** Stores messages from the public contact form

**Key Columns:**
- `id` - Unique identifier
- `name` - Contact's name
- `email` - Contact's email
- `message` - Their message
- `created_at` - When submitted

#### 4. **`telemetry_events`** - Usage Analytics
**Purpose:** Tracks how users interact with the application

**Key Columns:**
- `id` - Unique identifier
- `user_id` - Which user (can be null for anonymous)
- `event_type` - What happened (e.g., "page_view", "button_click")
- `event_data` - Additional information (stored as JSON)
- `created_at` - When it happened

#### 5. **`admin_activities`** - Admin Action Log
**Purpose:** Records what administrators do (for audit trail)

**Key Columns:**
- `id` - Unique identifier
- `user_id` - Which admin performed the action
- `activity_type` - What they did (e.g., "user_created", "user_deleted")
- `activity_data` - Details about the action (stored as JSON)
- `created_at` - When it happened

### Database Relationships

```
profiles (1) ────< (many) time_entries
   │
   ├──< (many) telemetry_events
   │
   └──< (many) admin_activities
```

**Translation:** One user (profile) can have many time entries, many telemetry events, and many admin activity records.

---

## How It Works

### Authentication Flow

1. **User Signs Up:**
   - User visits `/sign-up` page
   - Enters email and password
   - Supabase creates account in `auth.users` table
   - A profile is automatically created in `profiles` table
   - User is logged in immediately

2. **User Signs In:**
   - User visits `/sign-in` page
   - Enters email and password
   - Supabase verifies credentials
   - A session cookie is created
   - User is redirected to dashboard

3. **Session Management:**
   - Session stored in secure HTTP-only cookies
   - Automatically refreshed before expiring
   - Protected pages check session before loading

### Time Entry Creation Flow

1. **User Action:**
   - User goes to dashboard
   - Clicks "Log Time" or fills out form
   - Selects activity type, enters minutes, picks date

2. **Submission:**
   - Form calls server action: `createTimeEntry()`
   - Located in: `src/lib/actions/time-entries.ts`

3. **Server Processing:**
   - Gets current user from session
   - Validates the data (minutes 1-480, valid date, etc.)
   - Creates Supabase database client
   - Inserts new row into `time_entries` table
   - Automatically sets `user_id` to current user's ID

4. **Security Check:**
   - Row-Level Security (RLS) policy ensures:
     - User can only insert entries with their own `user_id`
     - Even if code is wrong, database prevents unauthorized access

5. **Response:**
   - Server returns the created entry
   - Dashboard updates to show new entry
   - User sees confirmation

### Data Retrieval Flow

1. **Page Load:**
   - User visits dashboard
   - Page calls `listTimeEntries()` server action

2. **Query Building:**
   - Server gets current user from session
   - Builds database query with filters:
     - `user_id = current_user.id` (only their data)
     - Date range (if specified)
     - Exclude deleted entries (`deleted_at IS NULL`)

3. **Database Query:**
   - Supabase executes query
   - RLS policies double-check permissions
   - Returns matching rows

4. **Display:**
   - Data formatted and displayed in table/charts
   - User can filter, sort, or export

### Admin Functions Flow

1. **Access Check:**
   - Admin visits `/admin` page
   - Page checks if user has `role = 'admin'` or `'super_admin'`
   - If not admin, redirect to dashboard

2. **Admin Actions:**
   - View all users
   - Edit user profiles
   - View system analytics
   - Manage settings

3. **Audit Trail:**
   - All admin actions logged to `admin_activities` table
   - Includes who did what and when

---

## Where It's Running

### Development (Local)
- **When:** While developing/testing
- **Where:** Your computer (`localhost:3000`)
- **Command:** `npm run dev`
- **Database:** Still uses Supabase (cloud-hosted)

### Production (Live)
- **Platform:** Likely **Vercel** (recommended for Next.js) or **Netlify**
- **URL:** Your custom domain (e.g., `https://sparc-calculator.com`)
- **Database:** Supabase (cloud-hosted)
- **How to Deploy:** Push code to GitHub, Vercel auto-deploys

### Environment Variables
The application needs these secrets (stored securely, not in code):

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public key (safe to expose)
- `SUPABASE_SERVICE_ROLE_KEY` - Secret key (server-only)

**Optional:**
- `NEXT_PUBLIC_SITE_URL` - Your production domain (for email links)

### Keep-Alive System
- **Purpose:** Prevents Supabase free tier from "sleeping" (going inactive)
- **How:** Automated script runs every 6 hours
- **Location:** `src/app/api/keep-alive/route.ts`
- **Automation:** GitHub Actions (`.github/workflows/keep-alive.yml`)

---

## Key Features

### For Regular Users
1. **Time Logging:** Log activities with activity type, minutes, and date
2. **View History:** See all past entries with filtering and search
3. **Export Data:** Download data as Excel or CSV
4. **Profile Management:** Update personal information
5. **Dashboard:** Visual overview of time spent

### For Administrators
1. **User Management:** View, edit, and manage all users
2. **Analytics:** See system-wide statistics
3. **Activity Monitoring:** Track what users are doing
4. **Settings:** Configure system settings
5. **Bulk Operations:** Perform actions on multiple users

### Security Features
1. **Row-Level Security:** Database-level data isolation
2. **Authentication:** Secure login with Supabase
3. **Role-Based Access:** Different permissions for users vs admins
4. **Soft Deletes:** Data marked as deleted but preserved
5. **Audit Trail:** Admin actions are logged

---

## Quick Reference

### Important Files

**Configuration:**
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js settings
- `tsconfig.json` - TypeScript settings
- `tailwind.config.js` - Styling configuration

**Core Application:**
- `src/app/page.tsx` - Landing page
- `src/app/dashboard/page.tsx` - Main dashboard
- `src/app/admin/page.tsx` - Admin panel

**Database Operations:**
- `src/lib/actions/time-entries.ts` - Time entry CRUD
- `src/lib/actions/user-profile.ts` - User profile management
- `src/lib/supabase/server.ts` - Server database connection

**Database Scripts:**
- `database/backup-strategy.sql` - How to backup data
- `database/add-datetime-timezone-support.sql` - Migration example

### Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server (after build)
npm start

# Check for errors (lint + type check)
npm run check

# Type check only
npm run typecheck

# Lint code
npm run lint
```

---

## Summary for Your Presentation

**What it is:** A time-tracking web application for healthcare professionals working on antimicrobial stewardship

**Tech Stack:**
- **Frontend:** Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend:** Supabase (PostgreSQL database + authentication)
- **Deployment:** Vercel (or similar platform)

**Key Points:**
1. Modern, industry-standard technologies
2. Secure multi-user system with data isolation
3. Easy to maintain and extend
4. Production-ready with proper security measures

**Why These Choices:**
- Next.js: Fast, popular, great developer experience
- TypeScript: Catches errors early, makes code maintainable
- Supabase: Handles backend complexity, includes security
- Tailwind: Quick, consistent styling

---

*This document was created to help explain the project architecture and technologies to peers. For detailed technical documentation, see `DATABASE_ANALYSIS.md` and `README.md`.*

