# Finance Data Processing and Access Control Backend

## Overview
This is a backend system for a finance dashboard tailored for user and role management, financial records management, and role-based access control.

## Technology Stack
- **Node.js & Express:** Core server framework.
- **TypeScript:** Type-safe development.
- **Prisma & SQLite:** ORM with local relational database for simplicity.
- **Zod:** Schema-based input validation.
- **JSON Web Tokens (JWT) & bcryptjs:** Secured authentication.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Database:**
   Push the Prisma schema to the SQLite DB to create tables:
   ```bash
   npm run db:push
   ```
   *(If you face any issues, ensure `.env` file exists with `DATABASE_URL="file:./dev.db"`)*

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Verify Database via UI (Optional):**
   ```bash
   npm run db:studio
   ```

## Roles & Access Control
- `VIEWER`: Can only view dashboard summaries.
- `ANALYST`: Can view finance records and dashboard summaries.
- `ADMIN`: Full CRUD management on users and records.

## Default Startup
You can register an initial account via the `POST /api/auth/register` endpoint (use Postman or cURL) since `register` is openly accessible, providing the `role: "ADMIN"` in the body.
