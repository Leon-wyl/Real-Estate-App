# Build stage
FROM --platform=linux/amd64 node:20-alpine AS builder

# Install openssl for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM --platform=linux/amd64 node:20-alpine

# Install openssl for Prisma in production
RUN apk add --no-cache openssl

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist

EXPOSE 8800

# Run the compiled code
CMD ["npm", "start"]
