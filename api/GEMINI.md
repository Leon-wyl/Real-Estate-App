# Real Estate App - Backend (API)

This is the backend of the Real Estate application, built with NestJS and Prisma.

## Tech Stack
- **Framework:** NestJS (CommonJS)
- **Runtime:** Node.js
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** Passport JWT with Cookies
- **Infrastructure:** AWS App Runner
- **Provisioning:** Terraform

## Key Directories
- `src/`: Application source code (controllers, services, modules, guards, DTOs)
- `src/prisma/`: Prisma module and service
- `test/`: Unit and e2e tests
- `prisma/`: Database schema (`schema.prisma`)

## Environment Variables
Create a `.env` file in the `api/` directory for local development:
```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET_KEY="your_secret_key"
CLIENT_URL="https://leonrealestate.uk"
```

## Local Development
1. `npm install`
2. `npx prisma generate`
3. `npx prisma db push`
4. `npm run dev` (Server runs on port 8800)

## Testing
- `npm test` — Run all tests
- `npm run test:unit` — Unit tests only
- `npm run test:e2e` — E2E tests only

## Deployment (AWS App Runner)
Managed via the root `deploy.sh` script or Terraform in the `/terraform` directory.
- **Service:** AWS App Runner
- **Registry:** AWS ECR
