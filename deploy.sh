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
        echo -e "${BLUE}1. Deploying Backend Infrastructure (App Runner)...${NC}"
        cd terraform
        terraform apply -target=aws_apprunner_service.api -target=aws_ecr_repository.api -target=aws_iam_role.apprunner_access_role -target=aws_iam_role.apprunner_instance_role -target=aws_iam_role_policy_attachment.apprunner_access_policy -auto-approve
        
        echo -e "${BLUE}2. Authenticating with ECR...${NC}"
        aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com
        
        echo -e "${BLUE}3. Building and Pushing Docker Image...${NC}"
        cd ../api
        docker build --platform linux/amd64 -t real-estate-api .
        docker tag real-estate-api:latest ${ECR_URL}:latest
        docker push ${ECR_URL}:latest
        
        echo -e "${YELLOW}Note: App Runner is configured with auto-deployments. It will start the new version automatically.${NC}"
        echo -e "${GREEN}Backend deployment initiated!${NC}"
        ;;
        
    frontend)
        echo -e "${BLUE}1. Deploying Frontend Infrastructure...${NC}"
        cd terraform
        terraform apply -target=aws_cloudfront_distribution.frontend -target=aws_s3_bucket.frontend -auto-approve
        
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
