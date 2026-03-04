#!/bin/bash

# BHUMI AWS Deployment Script
# Automates the deployment process for AWS AIdeaS Competition

set -e  # Exit on error

echo "🚀 BHUMI AWS Deployment Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install it first.${NC}"
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if CDK is installed
if ! command -v cdk &> /dev/null; then
    echo -e "${RED}❌ AWS CDK not found. Installing...${NC}"
    npm install -g aws-cdk
fi

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}⚠️  .env.local not found. Creating from example...${NC}"
    cp .env.example .env.local
    echo -e "${YELLOW}⚠️  Please update .env.local with your AWS credentials${NC}"
    exit 1
fi

# Load environment variables
source .env.local

# Check for Weather API Key
if [ -z "$WEATHER_API_KEY" ]; then
    echo -e "${YELLOW}⚠️  WEATHER_API_KEY not set in .env.local${NC}"
    echo "Get your free key from: https://openweathermap.org/api"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

# Step 1: Install Lambda dependencies
echo "📦 Installing Lambda dependencies..."
cd lambda
npm install
cd ..
echo -e "${GREEN}✅ Lambda dependencies installed${NC}"
echo ""

# Step 2: Install CDK dependencies
echo "📦 Installing CDK dependencies..."
cd infrastructure
npm install
cd ..
echo -e "${GREEN}✅ CDK dependencies installed${NC}"
echo ""

# Step 3: Bootstrap CDK (if needed)
echo "🔧 Checking CDK bootstrap..."
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=${AWS_REGION:-us-east-1}

echo "Account ID: $AWS_ACCOUNT_ID"
echo "Region: $AWS_REGION"

read -p "Bootstrap CDK? (y/n, skip if already done): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd infrastructure
    cdk bootstrap aws://$AWS_ACCOUNT_ID/$AWS_REGION
    cd ..
    echo -e "${GREEN}✅ CDK bootstrapped${NC}"
fi
echo ""

# Step 4: Deploy CDK Stack
echo "🚀 Deploying CDK stack..."
cd infrastructure
export WEATHER_API_KEY=$WEATHER_API_KEY
cdk deploy --require-approval never

# Capture outputs
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Save these values to your .env.local:"
echo "========================================"
cdk output
echo "========================================"
echo ""

cd ..

# Step 5: Update .env.local with outputs
echo "📝 Please update your .env.local with the CDK outputs above"
echo ""

# Step 6: Build frontend
echo "🏗️  Building frontend..."
npm run build
echo -e "${GREEN}✅ Frontend built${NC}"
echo ""

# Step 7: Deployment options
echo "🌐 Frontend Deployment Options:"
echo "================================"
echo "1. AWS Amplify (Recommended)"
echo "   - Go to: https://console.aws.amazon.com/amplify/"
echo "   - Connect your GitHub repo"
echo "   - Deploy automatically"
echo ""
echo "2. S3 + CloudFront"
echo "   - Run: aws s3 sync dist/ s3://your-bucket-name"
echo ""
echo "3. Local Testing"
echo "   - Run: npm run dev"
echo ""

echo -e "${GREEN}🎉 Deployment script completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Update .env.local with CDK outputs"
echo "2. Test locally: npm run dev"
echo "3. Deploy frontend using one of the options above"
echo ""
echo "Good luck with the AWS AIdeaS Competition! 🏆"
