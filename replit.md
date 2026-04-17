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
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- **Build**: esbuild (CJS bundle)
- **Session auth**: express-session (admin auth via bcryptjs)
- **File storage**: Object Storage (Replit) — paths start with `/objects/`, served at `/api/storage{path}`

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Fredora Multiconcept (`artifacts/fredora`)
Full corporate website for Fredora Multiconcept, a Nigerian multi-division company.
- **Preview path**: `/`
- **Pages**: Homepage, About, Contact, 5 Division pages (each with gallery + products + services), Admin dashboard
- **Admin credentials**: username: `manager`, password: `isaac`

### API Server (`artifacts/api-server`)
Express 5 REST API server.
- **Preview path**: `/api`
- **Routes**: /homepage, /divisions, /divisions/:slug, /messages, /products, /gallery, /testimonials, /newsletter, /hero-slides, /services/:id, /admin/login, /admin/logout, /admin/me, /admin/stats, /api/storage/*

## Database Schema

- `homepage` — Hero text, motto, mission/vision/values, social URLs, SEO meta, Google Analytics ID, WhatsApp number
- `divisions` — 5 business divisions (foods, eduservices, chems, scents, transport), each with imageUrl, bannerColor, comingSoon flag
- `services` — Products/services linked to each division (with imageUrl added)
- `messages` — Contact form submissions (with `read` flag)
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

## Code Conventions

- Express 5: use `/*splat` wildcards, `res.status(N).json({}); return;`, async handlers typed as `Promise<void>`
- Date serialization: DB Date objects → call `.toISOString()` before Zod parse
- Image URLs: if `imageUrl.startsWith("/objects/")` → serve at `/api/storage${imageUrl}`
- Generated API types are in `lib/api-zod/src/generated/` and `lib/api-client-react/src/generated/` — manually update when adding fields if orval codegen is not available
