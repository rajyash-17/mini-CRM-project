


# Mini CRM

A simple internal CRM for managing leads, follow-ups, notes, and sales pipeline stages.

## Thought Process
![Though process](<public/Screenshot 2026-09-12 124252.png>)


## Features

- User registration, login, and logout
- Protected CRM routes
- Create, view, edit, and delete leads
- Lead name, email, phone, source, status, notes, and follow-up date/time
- Search and filter leads by name, email, phone, status, and source
- Lead details page
- Pipeline: New → Contacted → Negotiating → Closed
- Instant pipeline status updates
- Dashboard with lead statistics and recent leads
- Responsive and clean UI

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- PostgreSQL
- Prisma
- React Hook Form
- Zod
- bcryptjs
- jose (JWT)
- Neon PostgreSQL
- Vercel

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/rajyash-17/mini-CRM-project.git
cd mini-crm
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file:

DATABASE_URL="your-postgresql-connection-string"
JWT_SECRET="your-secret-key"
4. Set up the database
npx prisma migrate dev
npx prisma generate
5. Start the development server
npm run dev

Open http://localhost:3000

Scripts
npm run dev      # Start development server
npm run lint     # Run ESLint
npm run build    # Create production build
npm start        # Start production server
Project Structure
src/
├── app/
│   ├── (crm)/          # Protected CRM pages
│   ├── api/             # Authentication and lead APIs
│   ├── login/
│   └── register/
├── components/          # UI and CRM components
├── lib/
│   ├── auth/            # Password and JWT session handling
│   └── prisma.ts        # Prisma client
└── generated/           # Generated Prisma client

prisma/
├── migrations/
├── schema.prisma
└── prisma7.config.ts
Authentication
Passwords are hashed using bcrypt.
JWT sessions are stored in HTTP-only cookies.
CRM routes require authentication.
Database

The application uses PostgreSQL with Prisma.

Main models:

User
Lead

Each lead stores its contact details, source, status, notes, follow-up information, and creator.

Scope

The CRM is intentionally focused on the core requirements of an internal lead-management system without unnecessary complexity.

Future Improvements
Lead activity history
Advanced permissions
Email/calendar integrations
Reporting and analytics
Pagination for larger datasets

