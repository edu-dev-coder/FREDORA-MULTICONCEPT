# Workspace

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
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Session auth**: express-session (admin auth via bcryptjs)

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
- **Pages**: Homepage, About, Contact, 5 Division pages, Admin dashboard
- **Admin credentials**: username: `admin`, password: `admin123`

### API Server (`artifacts/api-server`)
Express 5 REST API server.
- **Preview path**: `/api`
- **Routes**: /homepage, /divisions, /messages, /admin/*

## Database Schema

- `homepage` — Hero text, motto, mission/vision/values
- `divisions` — 5 business divisions (foods, eduservices, chems, scents, transport)
- `services` — Products/services linked to each division
- `messages` — Contact form submissions
- `admins` — Admin users for the dashboard

## Divisions

1. **Fredora Foods** — Natural honey, zobo drinks, smoothies, organic food
2. **Fredora EduServices** — Tutoring, coaching, career development
3. **Fredora Chems** — Liquid soap, detergents, antiseptics, cleaners
4. **Fredora Scents** — Body perfumes, oil perfumes, custom blends
5. **Fredora Transport & Logistics** — Coming Soon: procurement, delivery, errands
