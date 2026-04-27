# Real Estate App - Backend (API)

This is the backend of the Real Estate application, built with Node.js, Express, and Prisma.

## Tech Stack
- **Framework:** Express.js
- **Runtime:** Node.js (ES Modules)
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** JWT (JSON Web Tokens) with Cookies
- **Password Hashing:** Bcrypt

## Key Directories
- `controllers/`: Contains the logic for handling requests and interacting with the database.
- `routes/`: Defines the API endpoints.
- `prisma/`: Contains the database schema (`schema.prisma`).
- `middleware/`: Contains custom middleware (e.g., token verification).
- `lib/`: Contains utility libraries like the Prisma client instance.

## Environment Variables
Create a `.env` file in the `api/` directory with the following variables:
```env
DATABASE_URL="mongodb+srv://..."
JWT_SECRET_KEY="your_secret_key"
CLIENT_URL="http://localhost:5173"
```

## Database Schema
The database uses MongoDB with the following main models:
- **User**: Stores user information and relations to posts and saved posts.
- **Post**: Stores real estate listing details.
- **PostDetail**: Stores additional details for a specific post.
- **SavedPost**: Junction model for users to save listings.

## Common Commands
- `npm install`: Install dependencies.
- `npx prisma generate`: Generate the Prisma client after schema changes.
- `npx prisma db push`: Sync the schema with the MongoDB database.
- `npx prisma studio`: Open the Prisma Studio GUI to view/edit data.
- `node app.js`: Start the server (runs on port 8800 by default).

## Deployment (AWS ECS Fargate)

The backend is configured for deployment to AWS ECS Fargate using Terraform.

### 1. Prerequisites
- Docker installed.
- AWS CLI configured with your credentials.
- Terraform installed.

### 2. Infrastructure Setup
1. Navigate to the `terraform/` directory.
2. Run `terraform init`.
3. Create a `terraform.tfvars` file with your secrets:
   ```hcl
   database_url   = "your_mongodb_url"
   jwt_secret_key = "your_secret_key"
   client_url     = "your_frontend_url"
   ```

### 3. Container Image
1. Authenticate Docker with ECR:
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <your_account_id>.dkr.ecr.us-east-1.amazonaws.com
   ```
2. Build the image from the project root:
   ```bash
   docker build -t real-estate-api ./api
   ```
3. Tag and Push:
   ```bash
   docker tag real-estate-api:latest <ecr_repository_url>:latest
   docker push <ecr_repository_url>:latest
   ```

### 4. Apply Terraform
1. Run `terraform apply`.
2. Access your API via the `alb_dns_name` provided in the outputs.
