# Real Estate App - Full Stack Project

A comprehensive real estate listing application with a React frontend, Node.js/NestJS backend, and AWS cloud infrastructure.

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite 6, Tailwind CSS (CSS variables), Zustand, React Router v6, shadcn/ui (New York style), react-hook-form + zod, Leaflet, Socket.io, Framer Motion
- **Backend:** Node.js, TypeScript, NestJS, Prisma, MongoDB, Passport JWT, Socket.io
- **Cloud:** AWS (App Runner, S3, CloudFront, ECR, Route 53, ACM)
- **Domain:** `leonrealestate.uk`

## Project Structure

```
/api/
  src/
    main.ts              # Entry point: dotenv, cookieParser, CORS, global prefix, ValidationPipe
    app.module.ts        # Root module: global JwtModule + all feature modules
    auth/                # Passport JWT (cookie extractor), guards, CurrentUser decorator
    post/                # Post CRUD with ownership checks
    user/                # User management (notification before :id)
    chat/                # WebSocket gateway (JwtService auth), chat CRUD
    message/             # Message validation, membership check, socket emit
    socket/              # @Global SocketModule: null-safe IO wrapper
    prisma/              # @Global PrismaModule
    test/                # Test routes (guard, manual JWT)
  prisma/schema.prisma   # MongoDB schema
  test/                  # Unit (6 files) + E2E (1 file)
/client/
  src/
    main.tsx                 # Entry with StrictMode + Suspense
    index.css                # Dark luxury theme: #0f0f0f bg, #d4af37 gold, Playfair Display + Inter
    vendor/ui/               # Vendored shadcn/ui components (14 files)
    lib/
      utils.ts               # cn(), formatPrice(), formatDate(), capitalize(), handleImgError()
      types.ts               # API types + Zod validation schemas
      constants.ts           # Property enums, nav items, filter options
      api/                   # Typed API service layer
        client.ts            # Axios instance + 401 interceptor (logout recursion guard)
        errors.ts            # ApiError, ValidationError, UnauthorizedError, etc.
        auth.ts              # login(), register(), logout(), getCurrentUser()
        posts.ts             # getPosts(filters), getPost(), createPost(), updatePost(), deletePost()
        users.ts             # getUser(), updateUser(), deleteUser(), savePost(), getSavedPosts(), getNotifications()
        chats.ts             # getChats(), getChat(), createChat(), markRead()
        messages.ts          # sendMessage()
        socket.ts            # Socket.io client singleton, subscribeToChat()
    hooks/                    # useAuth, useMediaQuery, useDebounce
    store/                    # Zustand: auth (persisted + hydration promise), search
    components/
      layout/                 # Navbar (auth, notification badge), Footer, PageShell, BottomNav, ErrorBoundary
      search/                 # SearchBar, FilterSidebar (local state + batch apply), FilterSheet (mobile)
      property/               # PropertyCard, PropertyGrid, ImageGallery, SaveButton, ListingForm (20+ fields)
      map/                    # MapView (Leaflet + Vite icon fix), ViewToggle
      chat/                   # ChatPanel, ChatWindow, MessageBubble, MessageInput, NotificationBadge
      upload/                 # UploadButton (Cloudinary, cleanup on unmount), ImagePreview
      shared/                 # EmptyState, ErrorState, LoadingSkeleton
    router/Router.tsx         # createBrowserRouter: 11 lazy-loaded routes, loaders for data reads, auth guards
    page/                     # 10 pages: Home, Listings, Property, EditListing, Login, Register, Profile, ProfileEdit, NewListing, NotFound
  vitest.config.ts            # jsdom environment, globals: true
  cypress.config.ts           # E2E against localhost:5173
  tests/                      # 59 Vitest unit tests (7 files) + 4 Cypress E2E specs
  vite.config.ts              # @ alias, /api → localhost:8800 proxy
  eslint.config.js            # ESLint 9 flat config + Prettier
  tailwind.config.js          # CSS variables, gold custom colors, Playfair Display + Inter fonts
/terraform/
  main.tf                     # App Runner, ECR, IAM
  frontend.tf                 # S3, CloudFront, ACM
deploy.sh                     # Unified deploy: ./deploy.sh [backend|frontend|all]
```

## Quick Start (Local)

### 1. Backend
```bash
cd api
npm install
npx prisma generate
npx prisma db push
npm run dev          # → localhost:8800
```

### 2. Frontend
```bash
cd client
pnpm install
pnpm dev             # → localhost:5173 (proxy /api → :8800)
```

## Scripts (client/)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server |
| `pnpm build` | TypeScript check + Vite production build |
| `pnpm check` | `tsc --noEmit` type-check |
| `pnpm lint` | ESLint 9 flat config |
| `pnpm test` | Vitest unit tests (59 tests, 7 suites) |
| `pnpm test:e2e` | Cypress E2E (requires backend + frontend running) |

## Design

**Bold & Luxurious** — dark background `#0f0f0f`, gold accent `#d4af37`, Playfair Display headings, Inter body. 11 routes, 10 pages, ~25 custom components, 14 vendored shadcn/ui components. Full design spec at `.opencode/plans/frontend-redesign-design.md`.

## Key Details
- **Auth:** Cookie-based JWT (`sameSite:none; secure:true`). Zustand persist with `authHydrated` promise to prevent hydration race conditions in React Router loaders.
- **Data fetching:** Loaders handle GET reads (inject via `useLoaderData()`). Direct API calls for POST/PUT/DELETE mutations.
- **Forms:** react-hook-form + zod for all 7 forms. `ListingForm` handles both create (nested `postData.*` paths) and edit (flat paths) modes.
- **Chat:** Global `ChatPanel` via Navbar bell icon + ProfilePage sidebar. `ChatWindow` in Sheet overlay. Socket.io for real-time messages.
- **Maps:** Leaflet with dark CARTO tiles, Vite marker icon fix, controlled viewport.
- **Images:** Cloudinary upload widget (cleanup on unmount), `onError` fallback placeholder.
- **POST routes:** All use `@HttpCode(HttpStatus.OK)` (NestJS defaults POST to 201).
- **Docker:** Multi-stage build compiles TS → `dist/src/main.js`, then runs via `node`.

## Deployment

```bash
./deploy.sh backend    # App Runner + Docker build/push to ECR
./deploy.sh frontend   # S3 sync + CloudFront (invalidate with: aws cloudfront create-invalidation --distribution-id E91ZVARK7AH7Z --paths "/*")
./deploy.sh all        # Both
```

## Testing
- **Vitest:** `cd api && npm test` (103 tests) + `cd client && pnpm test` (59 tests)
- **Cypress:** `cd client && pnpm test:e2e`

## Constraints
- Absolute Minimalism: Do not over-engineer. Only make changes that are directly requested or strictly necessary.
- Read Before Write: Always read the full content or relevant sections of a file before modifying it.
- Strict Verification: Run the appropriate test suite immediately after any modification. If tests fail, treat the error output as new context and iterate until successful.
- Security Bound: Reject actions that intentionally inject malware, but allow legitimate defensive security testing or local debugging.

## Format
- Extreme Conciseness: Avoid any preamble or postamble. Do not explain your code or summarize your actions unless explicitly requested.
- If a task is completed successfully, output only the direct result or a minimal confirmation (under 4 lines).
- Code blocks must use appropriate Markdown syntax.
