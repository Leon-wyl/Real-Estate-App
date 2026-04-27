# Real Estate App - Backend (API)

This is the backend of the Real Estate application, built with Node.js, Express, and Prisma.

## Tech Stack
- **Framework:** Express.js
- **Runtime:** Node.js (ES Modules)
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) with Cookies
- **Infrastructure:** AWS App Runner
- **Provisioning:** Terraform

## Key Directories
- `controllers/`: Contains the logic for handling requests and interacting with the database.
- `routes/`: Defines the API endpoints.
- `prisma/`: Contains the database schema (`schema.prisma`).
- `middleware/`: Contains custom middleware (e.g., token verification).
- `lib/`: Contains utility libraries like the Prisma client instance.

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
4. `node app.js` (Server runs on port 8800)

## Deployment (AWS App Runner)
Managed via the root `deploy.sh` script or Terraform in the `/terraform` directory.
- **Service:** AWS App Runner
- **Registry:** AWS ECR
