# Real Estate App

A full-stack property listing application featuring real-time map visualization, user authentication, and secure cloud deployment.

## Overview

This project is a modern real estate platform that allows users to search for properties, filter by criteria (buy/rent), view detailed property information, and save their favorite listings.

## Architecture

### Frontend
- **Framework:** React with Vite
- **Styling:** SCSS
- **Maps:** React Leaflet
- **Deployment:** Hosted on **AWS S3** and distributed globally via **AWS CloudFront**.

### Backend
- **Runtime:** Node.js (Express)
- **Database:** MongoDB with **Prisma ORM**
- **Authentication:** JWT with HTTP-only cookies
- **Deployment:** Containerized service on **AWS App Runner**.

### Infrastructure
- **IaC:** Fully managed via **Terraform**.
- **DNS/SSL:** Managed through **Cloudflare** with AWS-provisioned SSL certificates (ACM).
- **CI/CD:** Automated via a custom `deploy.sh` script.

## Project Structure

- `/api`: Express.js backend.
- `/client`: React frontend.
- `/terraform`: AWS infrastructure configuration files.

## Getting Started

### Prerequisites
- Node.js (v20+)
- Docker
- AWS CLI & Terraform installed/configured.

### Running Locally
1. **Backend:**
   ```bash
   cd api
   npm install
   # Configure .env
   node app.js
   ```
2. **Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Deployment
This project uses a unified deployment script:
- `./deploy.sh backend`: Deploys API to App Runner.
- `./deploy.sh frontend`: Deploys React app to S3/CloudFront.
- `./deploy.sh all`: Deploys both services.

---
*For detailed module documentation, see [api/GEMINI.md](./api/GEMINI.md) and [client/GEMINI.md](./client/GEMINI.md).*
