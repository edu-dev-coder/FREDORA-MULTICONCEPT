# Fredora Multiconcept — Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4` in DB schemas; plain `zod` in `lib/api-zod`)
- **Build**: esbuild (CJS bundle for api-server)
- **Session auth**: express-session (admin auth via bcryptjs)
- **File storage**: Object Storage (Replit) — paths start with `/objects/`, served at `/api/storage{path}`
- **Email**: nodemailer (optional — set SMTP_HOST, SMTP_USER, SMTP_PASS, NOTIFICATION_EMAIL secrets)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

> **NOTE**: Orval codegen is NOT used. API types are manually edited in:
> - `lib/api-zod/src/generated/api.ts` (Zod schemas, plain `zod` not `zod/v4`)
> - `lib/api-client-react/src/generated/api.schemas.ts` (TypeScript interfaces)
> - `lib/api-client-react/src/generated/api.ts` (React Query hooks)

## Artifacts

### Fredora Multiconcept (`artifacts/fredora`)
Full corporate website for Fredora Multiconcept, a Nigerian multi-division company.
- **Preview path**: `/`
- **Pages**: Homepage, About, Contact, News, Catalogue, 5 Division pages (each with gallery + products + services + WhatsApp buttons), Admin dashboard
- **Admin credentials**: username: `manager`, password: `isaac`
- **Admin panels**: Dashboard, Divisions, Messages (with status tracking), Homepage, Testimonials, News & Blog, Newsletter

### API Server (`artifacts/api-server`)
Express 5 REST API server.
- **Preview path**: `/api`
- **Public routes**: /homepage, /divisions, /divisions/:slug, /messages (POST), /products, /gallery, /testimonials, /newsletter, /hero-slides, /services/:id, /posts, /posts/:slug, /api/storage/*
- **Admin routes**: /admin/login, /admin/logout, /admin/me, /admin/stats, /admin/posts (CRUD), /messages (GET + DELETE + PATCH for status), /admin/homepage (PATCH), etc.

## Database Schema

- `homepage` — Hero text, motto, mission/vision/values, social URLs (Facebook, Instagram, Twitter, LinkedIn, YouTube), SEO meta, Google Analytics ID, WhatsApp number
- `divisions` — 5 business divisions (foods, eduservices, chems, scents, transport), each with imageUrl, bannerColor, comingSoon flag
- `services` — Products/services linked to each division (with imageUrl)
- `messages` — Contact form submissions (with `read` flag + `status` field: pending/in_progress/resolved)
- `posts` — Blog/news posts (title, slug, excerpt, content, imageUrl, published, timestamps)
- `admins` — Admin users (bcrypt hashed passwords)
- `gallery` — Gallery photos per division (imageUrl + caption)
- `products` — Product catalog per division (name, description, price, imageUrl)
- `testimonials` — Customer testimonials (name, role, message, photoUrl)
- `newsletter` — Newsletter subscribers (email, createdAt)
- `hero_slides` — Hero slideshow images (up to 10, auto-advancing at 5s intervals)

## Divisions

1. **Fredora Foods** — Natural honey, zobo drinks, smoothies, organic food
2. **Fredora EduServices** — Tutoring, coaching, career development
3. **Fredora Chems** — Liquid soap, detergents, antiseptics, cleaners
4. **Fredora Scents** — Body perfumes, oil perfumes, custom blends
5. **Fredora Transport & Logistics** — Coming Soon: procurement, delivery, errands

## Features Implemented

1. **WhatsApp Order Buttons** — On every product and service card on division pages; uses WhatsApp number from homepage settings
2. **Email Notifications** — Contact form triggers nodemailer email to NOTIFICATION_EMAIL (silent no-op if SMTP vars absent)
3. **Message Status Tracking** — Admin Messages page has per-message status selector (Pending / In Progress / Resolved)
4. **Blog / News Section** — Public /news listing + /news/:slug detail pages; admin panel to create/edit/publish/delete posts
5. **PDF Catalogue** — /catalogue page shows all divisions + products; Print/Download PDF button triggers browser print
6. **Social Media Section** — Homepage shows social buttons (Facebook, Instagram, X, LinkedIn, YouTube) if URLs configured in admin
7. **PWA Manifest** — manifest.json + meta tags in index.html for installability
8. **Google Analytics** — Injected via gtag.js when `gaId` is set in homepage settings

## Code Conventions

- Express 5: use `/*splat` wildcards, `res.status(N).json({}); return;`, async handlers typed as `Promise<void>`
- Date serialization: DB Date objects → call `.toISOString()` before sending as JSON
- Image URLs: if `imageUrl.startsWith("/objects/")` → serve at `/api/storage${imageUrl}`
- Do NOT import `zod` directly in api-server routes — esbuild cannot resolve it. Use `@workspace/api-zod` for validation schemas, or use manual JS validation.
- Generated API types are manually maintained (no orval codegen). Edit `lib/api-zod/src/generated/api.ts` and `lib/api-client-react/src/generated/` when adding new endpoints.
