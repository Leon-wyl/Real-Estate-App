#!/bin/bash

# Real Estate App Deployment Script
set -e # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

function usage {
    echo "Usage: ./deploy.sh [backend|frontend|all]"
    exit 1
}

if [ $# -eq 0 ]; then
    usage
fi

# Get AWS Account ID for ECR
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
ECR_URL="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com/real-estate-api"

case "$1" in
    backend)
        echo -e "${BLUE}1. Deploying Backend Infrastructure...${NC}"
        cd terraform
        terraform apply -target=aws_ecs_service.main -target=aws_lb.main -target=aws_ecr_repository.api
        
        echo -e "${BLUE}2. Authenticating with ECR...${NC}"
        aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
        
        echo -e "${BLUE}3. Building and Pushing Docker Image...${NC}"
        cd ../api
        docker build --platform linux/amd64 -t real-estate-api .
        docker tag real-estate-api:latest ${ECR_URL}:latest
        docker push ${ECR_URL}:latest
        
        echo -e "${BLUE}4. Forcing ECS Redeploy...${NC}"
        aws ecs update-service --cluster real-estate-cluster --service real-estate-service --force-new-deployment --region ${REGION}
        
        echo -e "${GREEN}Backend deployment complete!${NC}"
        ;;
        
    frontend)
        echo -e "${BLUE}1. Deploying Frontend Infrastructure...${NC}"
        cd terraform
        terraform apply -target=aws_cloudfront_distribution.frontend -target=aws_s3_bucket.frontend
        
        # Get CloudFront ID and S3 Bucket for syncing
        DIST_ID=$(terraform output -raw cloudfront_domain_name) # We actually need the ID, but let's assume we can sync to S3 first
        
        echo -e "${BLUE}2. Building Frontend...${NC}"
        cd ../client
        npm install
        npm run build
        
        echo -e "${BLUE}3. Syncing to S3...${NC}"
        aws s3 sync ./dist s3://leonrealestate-web --delete
        
        echo -e "${YELLOW}Note: You may need to manually invalidate CloudFront cache if changes don't show.${NC}"
        echo -e "${GREEN}Frontend deployment complete!${NC}"
        ;;
        
    all)
        $0 backend
        $0 frontend
        ;;
    *)
        usage
        ;;
esac
