# Real Estate App

A full-stack property listing platform with real-time map visualization, chat, JWT auth, and AWS cloud deployment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite 6, Tailwind CSS, Zustand, React Router v6, shadcn/ui (New York), react-hook-form + zod, Leaflet, Socket.io, Framer Motion |
| **Backend** | Node.js, NestJS, Prisma ORM, MongoDB, Passport JWT |
| **Cloud** | AWS App Runner, S3, CloudFront, ECR, Route 53, ACM |
| **Testing** | Vitest (unit), Cypress (E2E) |
| **Package Manager** | pnpm (client), npm (api) |

## Architecture

- **Frontend** — `pnpm` monolith in `client/` with vendored shadcn/ui, Zustand stores, React Router loaders, and a dark luxury theme (gold accent, Playfair Display + Inter fonts).
- **Backend** — NestJS API in `api/` with Prisma (MongoDB), JWT cookies, Socket.io chat gateway.
- **Infrastructure** — Terraform-managed AWS (App Runner for API, S3 + CloudFront for frontend).

## Quick Start

```bash
# Backend
cd api && npm install && npx prisma generate && npx prisma db push && npm run dev

# Frontend
cd client && pnpm install && pnpm dev
```

## Scripts

| Command | Dir | Description |
|---------|-----|-------------|
| `npm run dev` | `api/` | Start NestJS dev server (:8800) |
| `npm test` | `api/` | Vitest (103 tests) |
| `pnpm dev` | `client/` | Start Vite dev server (:5173) |
| `pnpm build` | `client/` | `tsc && vite build` |
| `pnpm check` | `client/` | TypeScript type-check |
| `pnpm lint` | `client/` | ESLint 9 flat config |
| `pnpm test` | `client/` | Vitest (59 tests) |
| `pnpm test:e2e` | `client/` | Cypress E2E |

## Deployment

```bash
./deploy.sh backend     # App Runner + Docker → ECR
./deploy.sh frontend    # Build + S3 sync + CloudFront
./deploy.sh all         # Both services
```

CloudFront cache invalidate: `aws cloudfront create-invalidation --distribution-id E91ZVARK7AH7Z --paths "/*"`

## Project Structure

```
api/          NestJS backend (Prisma, JWT, Socket.io)
client/       React frontend (Vite 6, shadcn/ui, Zustand)
  src/vendor/ui/      Vendored shadcn/ui components
  src/lib/api/        Typed API service layer + error classes
  src/store/          Zustand: auth (persisted), search
  src/components/     Layout, search, property, map, chat, upload, shared
  src/page/           10 pages (lazy-loaded)
  src/router/         createBrowserRouter with loaders + auth guards
terraform/    AWS infrastructure (App Runner, S3, CloudFront, ECR, IAM, ACM)
deploy.sh     Unified deploy script
```

## Design

**Bold & Luxurious** theme — dark `#0f0f0f`, gold `#d4af37`, serif headings (Playfair Display), clean body (Inter). Full spec at `.opencode/plans/frontend-redesign-design.md`.
