# Konga Coffee Platform

Production-ready full-stack Next.js application for **Konga Coffee Ltd** — Ethiopian Yirgacheffe green coffee exporter.

## Stack

- **Next.js 16** (App Router) + TypeScript + React 19
- **Tailwind CSS v4** + shadcn-style UI components
- **PostgreSQL** + **Prisma ORM**
- **Auth.js v5** (admin authentication + RBAC)
- **Framer Motion**, React Hook Form, Zod

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set your values:

```bash
cp .env.example .env
```

Required for full functionality:

- `DATABASE_URL` — hosted PostgreSQL connection string (Neon, Supabase, or Railway)
- `AUTH_SECRET` — random secure string (`openssl rand -base64 32`)
- `AUTH_URL` — e.g. `http://localhost:3000`

### 3. Set up database

```bash
npm run db:migrate
npm run db:seed
```

Default admin credentials (from seed):

- Email: `admin@kongacoffee.com`
- Password: `ChangeMe123!` (or value of `SEED_ADMIN_PASSWORD`)

### 4. Run development server

```bash
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Project Structure

```
app/
  (website)/     # Public pages
  admin/         # Admin panel + login
  api/           # Route handlers
components/      # UI, layout, forms, admin
lib/
  auth/          # Auth.js configuration
  db/            # Prisma client
  services/      # Business logic
  repositories/  # Data access
  validations/   # Zod schemas
  storage/       # File upload abstraction
  email/         # SMTP notification service
prisma/          # Schema + seed
```

## Deployment (Vercel)

1. Push to GitHub and connect to Vercel
2. Set all environment variables from `.env.example`
3. Add build command: `prisma generate && next build`
4. Run migrations: `npx prisma migrate deploy`
5. Seed production: `npm run db:seed` (once)

## Verified Company Information

Contact details seeded from [kongacoffeeplc.com](https://kongacoffeeplc.com/):

- Email: info@kongacoffee.com
- Phone: +251911210468
- Address: CMC Round About

## Features

- Premium public website (14 routes)
- Light / Dark theme toggle (public site + admin panel)
- Coffee catalog with filters and detail pages
- Traceability lot search
- B2B inquiry and sample request forms
- Journal/blog CMS
- Admin dashboard with RBAC
- SEO (metadata, JSON-LD, sitemap, robots)
- Media upload (local/S3-ready abstraction)
- Email notifications (SMTP-configurable)

## Site Imagery

Photography in `public/images/` is sourced from [Unsplash](https://unsplash.com) under the [Unsplash License](https://unsplash.com/license) (free for commercial and non-commercial use). Images depict Ethiopian coffee origin themes — highlands, farms, cherries, drying beds, and green beans — curated for the Konga Coffee brand.

| File | Subject |
|------|---------|
| `hero-highlands.jpg` | Ethiopian highland landscape |
| `origin-gedeo.jpg` | Coffee farm / highland vista |
| `processing-cherries.jpg` | Coffee cherries on branch |
| `green-coffee-beans.jpg` | Green coffee macro |
| `coffee-farm.jpg` | Coffee farm context |
| `drying-beds.jpg` | Raised drying beds |
| `harvest-hands.jpg` | Hand harvest |
| `export-beans.jpg` | Sorted green coffee |

Image paths are centralized in `lib/constants/images.ts` (`SITE_IMAGES`).
