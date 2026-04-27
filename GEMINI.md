# Real Estate App - Full Stack Project

A comprehensive real estate listing application with a React frontend, Node.js/Express backend, and AWS cloud infrastructure.

## Project Structure

### `/api` (Backend)
- `controllers/`: Logic for handling API requests (Auth, Posts, Users).
- `routes/`: Express route definitions for each module.
- `prisma/`: Database schema and migration settings.
- `middleware/`: Custom middleware like JWT token verification.
- `lib/`: Utility functions and shared instances (e.g., Prisma client).
- `app.js`: Application entry point and configuration.
- `Dockerfile`: Container image definition for AWS deployment.

### `/client` (Frontend)
- `src/components/`: Reusable UI components (Navbar, Sidebar, etc.).
- `src/routes/`: Page-level components and routing logic.
- `src/context/`: Global state management using React Context.
- `src/lib/`: API configuration (Axios) and helper functions.
- `public/`: Static assets like images and icons.
- `index.html`: Main HTML template.
- `vite.config.js`: Build and development configuration.

### `/terraform` (Infrastructure)
- `main.tf`: Core backend resources (App Runner, ECR).
- `frontend.tf`: Frontend hosting resources (S3, CloudFront, ACM, Route 53).
- `variables.tf`: Configuration variables for the environment.
- `outputs.tf`: Important deployment identifiers (URLs, IDs).
- `terraform.tfvars`: Local sensitive configuration (Ignored by Git).

## Tech Stack
- **Frontend:** React, Vite, SCSS, Axios, Leaflet.
- **Backend:** Node.js, Express, Prisma, MongoDB.
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
node app.js
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

## Documentation
- For detailed backend info, see [api/GEMINI.md](./api/GEMINI.md).
- For detailed frontend info, see [client/GEMINI.md](./client/GEMINI.md).
