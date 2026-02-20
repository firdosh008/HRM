# HRMS Lite - Setup Guide

Welcome to HRMS Lite, a comprehensive Human Resource Management System built with Next.js and Supabase!

## Overview

HRMS Lite provides the following features:

- **Employee Management**: Add, view, and manage employees
- **Attendance Tracking**: Check-in/check-out system with attendance records
- **Leave Management**: Request and approve leave with different types
- **Performance Reviews**: Track and manage employee performance ratings
- **Reports & Analytics**: View HR metrics and insights
- **User Authentication**: Secure authentication with email/password

## Prerequisites

Before getting started, ensure you have:

1. A Supabase project created at [supabase.com](https://supabase.com)
2. Your Supabase project URL and API key
3. Node.js 18+ installed locally (if running locally)

## Setup Instructions

### Step 1: Database Configuration

The application comes with a pre-configured SQL schema. You need to execute the setup script in your Supabase database:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `scripts/setup-database.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the script

This will create all the necessary tables with Row Level Security (RLS) policies.

### Step 2: Environment Variables

Your v0 project automatically configured the following environment variables from your Supabase integration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

These are already set in your project settings and will be used by the application.

### Step 3: Create a Company (First Time Setup)

After signing up and logging in, you'll need to create a default company to start adding employees:

1. Open the browser console (F12)
2. Run the following code:

```javascript
const supabase = window.supabase

const companyId = '550e8400-e29b-41d4-a716-446655440000' // Default UUID

// Check if company exists
const { data: existingCompany } = await supabase
  .from('companies')
  .select('id')
  .eq('id', companyId)
  .single()

if (!existingCompany) {
  // Create default company
  await supabase.from('companies').insert([
    {
      id: companyId,
      name: 'Your Company Name',
      email: 'company@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345'
    }
  ])
}
```

Or use the Supabase SQL Editor:

```sql
INSERT INTO companies (id, name, email, phone, address)
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Your Company Name', 'company@example.com', '+1 (555) 123-4567', '123 Main St, City, State 12345')
ON CONFLICT (id) DO NOTHING;
```

### Step 4: Create Test Users

You can create test users in Supabase to explore the application:

1. Go to **Authentication** → **Users** in your Supabase dashboard
2. Click **Create new user**
3. Enter an email and password
4. Use these credentials to sign in to HRMS Lite

Or use the **Sign Up** feature in the application itself (email confirmation required by default).

## Features Guide

### Authentication
- **Sign Up**: Create a new account at `/auth/sign-up`
- **Login**: Access your account at `/auth/login`
- **Protected Routes**: Authenticated users can access `/protected` and sub-routes

### Dashboard
- View key HR metrics (Total Employees, Present Today, Pending Requests, Avg Rating)
- Recent activities and quick stats
- Attendance rate and leave utilization tracking

### Employee Management
- Add new employees with details (name, email, department, position, hire date)
- View all employees in a table format
- Delete employees (with proper RLS policies)
- Track employee status (active/inactive)

### Attendance Tracking
- Check in/Check out functionality
- View attendance records with check-in/check-out times
- Duration calculation
- Status tracking (Present, Absent, Late)

### Leave Management
- Request different types of leave (Annual, Sick, Personal, Maternity)
- Submit leave requests with start/end dates and reasons
- Approve/Reject pending leave requests
- View leave request history and status

### Reports
- Overall HR statistics
- Attendance rate analysis
- Leave request summary
- Performance rating averages
- Export functionality (future enhancement)

### Settings
- Update email address
- Change password
- View last login information
- Sign out from the application

## Database Schema

The application uses the following tables:

- **companies**: Store company information
- **employees**: Employee records with department and position
- **attendance**: Daily attendance records with check-in/check-out times
- **leave_requests**: Leave request records with approval workflow
- **leave_balances**: Track leave balance for employees by year
- **performance_reviews**: Store performance ratings and feedback

All tables have Row Level Security (RLS) enabled to ensure data protection.

## Development

To run this application locally:

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Open http://localhost:3000
```

## Troubleshooting

### "RLS policy denied" error
- Ensure you've executed the SQL setup script
- Check that Row Level Security policies allow your user role
- Verify you're logged in with a confirmed email

### Employees not appearing
- First, create a default company using the SQL provided above
- Ensure you've signed up and confirmed your email
- Check that your user_id matches the employee record

### "Database connection error"
- Verify your Supabase URL and API key are correct
- Check your internet connection
- Ensure your Supabase project is active

## Next Steps

1. Explore the employee management features
2. Test the attendance tracking system
3. Try requesting and approving leave
4. Generate reports for your organization
5. Customize settings as needed

## Support

For issues or questions:
1. Check the Supabase documentation at [supabase.com/docs](https://supabase.com/docs)
2. Review the application code in the `/app` directory
3. Check the middleware configuration in `middleware.ts`

## Security Notes

- All sensitive operations are protected by Row Level Security
- Passwords are securely hashed by Supabase Auth
- Sessions are managed via secure HTTP-only cookies
- User data is isolated at the database level

Happy managing! 🚀
