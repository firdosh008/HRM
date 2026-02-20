# HRMS Lite

A lightweight Human Resource Management System for managing employee records and daily attendance. Single-admin use; no authentication required.

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Radix UI (shadcn/ui)
- **Backend:** Next.js API Routes (REST)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (frontend + API); Supabase (hosted DB)

## Run Locally

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```

2. Create `.env.local` with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. In Supabase (SQL Editor), ensure schema:
   - **employees:** `id` (uuid), `employee_id` (text, unique), `first_name` (text), `last_name` (text), `email` (text), `department` (text). If `employee_id` is missing, run:
     ```sql
     ALTER TABLE employees ADD COLUMN IF NOT EXISTS employee_id text UNIQUE;
     ```
   - **attendance:** `id` (uuid), `employee_id` (uuid, references employees.id), `date` (date), `status` (text: 'present' | 'absent').

4. Run the app:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000); you are taken to the dashboard (no login).

## Assumptions / Limitations

- Single admin user; no login or sign-up.
- Leave management, payroll, and advanced HR features are out of scope.
- Backend is implemented as Next.js API routes; frontend calls these REST APIs. Supabase is used only from the server (API routes) for persistence.
