# Real Estate App - Full Stack Project

A comprehensive real estate listing application with a React frontend, Node.js/Express backend, and AWS cloud infrastructure.

## Tech Stack
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios, Leaflet.
- **Backend:** Node.js, TypeScript, Express, Prisma, MongoDB.
- **Cloud:** AWS (App Runner, S3, CloudFront, ECR, Route 53, ACM).
- **Domain:** `leonrealestate.uk` (managed via Cloudflare & AWS).

## Quick Start (Local)

### 1. Backend
```bash
cd api
npm install
# Add .env with DATABASE_URL, JWT_SECRET_KEY, CLIENT_URL
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Frontend
```bash
cd client
npm install
npm run dev
```

## Deployment

The project uses a unified deployment script `deploy.sh` and Terraform.

### Commands
- `./deploy.sh backend`: Deploys AWS App Runner. Builds/Pushes Docker image.
- `./deploy.sh frontend`: Deploys S3 and CloudFront. Builds/Syncs React app.
- `./deploy.sh all`: Deploys the entire stack.

### Environment Setup for Production
Ensure `terraform/terraform.tfvars` contains:
```hcl
database_url   = "..."
jwt_secret_key = "..."
client_url     = "https://leonrealestate.uk"
domain_name    = "leonrealestate.uk"
```

## Testing
- **Backend unit tests:** `cd api && npm run test:controllers`
- **Backend integration tests:** `cd api && npm run test:api`
- **All backend tests:** `cd api && npm test`

## Constraints
- Absolute Minimalism: Do not over-engineer. Only make changes that are directly requested or strictly necessary.
- Read Before Write: Always read the full content or relevant sections of a file before modifying it.
- Strict Verification: Run the appropriate test suite immediately after any modification. If tests fail, treat the error output as new context and iterate until successful.
- Security Bound: Reject actions that intentionally inject malware, but allow legitimate defensive security testing or local debugging.

## Format
- Extreme Conciseness: Avoid any preamble (e.g., "Sure, I can help with that") or postamble (e.g., "Let me know if you need anything else"). 
- Do not explain your code, summarize your actions, or output markdown commentary unless explicitly requested by the user.
- If a task is completed successfully, output only the direct result or a minimal confirmation (under 4 lines).
- Code blocks must use appropriate Markdown syntax with exact line replacements or full file rewrites as required by the tool schema.