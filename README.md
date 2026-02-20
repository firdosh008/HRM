# HRMS Lite

A lightweight Human Resource Management System for managing employee records and daily attendance. Single-admin use; no authentication required.

---

## What's Implemented

- **Employee management:** Add (ID, Full Name, Email, Department), list all, delete.
- **Attendance:** Mark attendance (date, Present/Absent), view records per employee.
- **REST APIs** for all actions; data stored in Supabase (PostgreSQL).
- **Validation:** Required fields, valid email, duplicate employee ID/email handling (409).
- **UI:** Dashboard, Employees, Attendance pages; loading, empty, and error states; reusable components.
- **Bonus:** Filter attendance by date; total present days per employee; dashboard summary (counts + table).

---

## Submission

**Live Application URL**

https://hrm-five-ebon.vercel.app/


**GitHub Repository Link**

https://github.com/firdosh008/HRM


---

## Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind CSS, Radix UI (shadcn/ui)
- **Backend:** Next.js API Routes (REST)
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel (frontend + API); Supabase (hosted DB)

---

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

3. In Supabase SQL Editor, run the schema in `supabase/schema.sql` to create `employees` and `attendance` tables.

4. Run the app:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000). You are taken to the dashboard (no login).

---

## Assumptions / Limitations

- Single admin user; no login or sign-up.
- Leave management, payroll, and advanced HR features are out of scope.
