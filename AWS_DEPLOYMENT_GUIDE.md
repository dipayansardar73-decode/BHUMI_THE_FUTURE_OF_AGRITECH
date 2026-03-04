# BHUMI AWS Deployment Guide

Complete guide to deploy BHUMI Smart Farming Assistant on AWS for the AWS AIdeaS Competition.

## Architecture Overview

```
Frontend (React + Vite)
    ↓
Amazon CloudFront (Optional CDN)
    ↓
Amazon API Gateway (REST API)
    ↓
AWS Lambda Functions (Node.js 18)
    ↓
├─ Amazon Bedrock (Claude 3 Sonnet/Haiku) - AI Reasoning & Vision
├─ Amazon Rekognition - Image Analysis
├─ Amazon Cognito - Authentication
├─ Amazon DynamoDB - User Data & History
└─ Amazon S3 - Image Storage
```

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js 18+** and npm
4. **AWS CDK** installed globally: `npm install -g aws-cdk`
5. **OpenWeatherMap API Key** (free tier): https://openweathermap.org/api

## Step 1: AWS Account Setup

### Enable Amazon Bedrock Models

1. Go to AWS Console → Amazon Bedrock
2. Navigate to "Model access"
3. Request access to:
   - **Anthropic Claude 3 Sonnet** (for main AI tasks)
   - **Anthropic Claude 3 Haiku** (for fast responses)
4. Wait for approval (usually instant)

### Configure AWS CLI

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Default region: us-east-1
# Default output format: json
```

## Step 2: Install Dependencies

### Backend (Lambda Functions)

```bash
cd lambda
npm install
cd ..
```

### Infrastructure (CDK)

```bash
cd infrastructure
npm install
cd ..
```

### Frontend

```bash
npm install
```

## Step 3: Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Get OpenWeatherMap API Key:
   - Sign up at https://openweathermap.org/api
   - Get your free API key
   - Add to `.env.local`

## Step 4: Deploy Infrastructure with CDK

### Bootstrap CDK (First time only)

```bash
cd infrastructure
cdk bootstrap aws://YOUR-ACCOUNT-ID/us-east-1
```

### Deploy the Stack

```bash
# Set Weather API Key
export WEATHER_API_KEY=your-openweathermap-key

# Deploy
cdk deploy

# Confirm with 'y' when prompted
```

### Save the Outputs

After deployment, CDK will output:
- **ApiGatewayUrl**: Your API endpoint
- **UserPoolId**: Cognito User Pool ID
- **UserPoolClientId**: Cognito Client ID
- **ImagesBucketName**: S3 bucket name

**Save these values!** You'll need them for frontend configuration.

## Step 5: Configure Frontend

Update `.env.local` with the CDK outputs:

```bash
AWS_REGION=us-east-1
API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=your-client-id
```

## Step 6: Update Frontend to Use AWS Services

Replace the import in your service files:

```typescript
// In pages/*.tsx files, replace:
import { ... } from '../services/geminiService';

// With:
import { ... } from '../services/awsService';
```

Or create a service switcher:

```typescript
// services/index.ts
export * from './awsService'; // Use AWS
// export * from './geminiService'; // Use Gemini (for comparison)
```

## Step 7: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and test:
1. User signup/login
2. Disease detection (upload crop image)
3. Chat with Bhumi
4. Weather forecast
5. Crop recommendations
6. Yield prediction

## Step 8: Deploy Frontend

### Option A: AWS Amplify (Recommended)

1. Go to AWS Amplify Console
2. Click "New app" → "Host web app"
3. Connect your GitHub repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Add environment variables in Amplify Console
6. Deploy!

### Option B: S3 + CloudFront

```bash
# Build the app
npm run build

# Create S3 bucket
aws s3 mb s3://bhumi-app-frontend

# Enable static website hosting
aws s3 website s3://bhumi-app-frontend --index-document index.html

# Upload files
aws s3 sync dist/ s3://bhumi-app-frontend --acl public-read

# (Optional) Create CloudFront distribution for CDN
```

## Step 9: Testing AWS Services

### Test Disease Detection

```bash
curl -X POST https://your-api-gateway-url/disease-detection \
  -H "Content-Type: application/json" \
  -d '{
    "image": "base64-encoded-image-data",
    "language": "English"
  }'
```

### Test Chat

```bash
curl -X POST https://your-api-gateway-url/chat \
  -H "Content-Type: application/json" \
  -d '{
    "history": [],
    "message": "What is the best crop for clay soil?",
    "language": "English"
  }'
```

## Cost Estimation (AWS Free Tier)

### Free Tier Eligible:
- **Lambda**: 1M requests/month free
- **API Gateway**: 1M requests/month free (12 months)
- **DynamoDB**: 25GB storage + 25 RCU/WCU free
- **S3**: 5GB storage free (12 months)
- **Cognito**: 50,000 MAU free

### Paid Services:
- **Amazon Bedrock**: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
  - Estimated: $5-20/month for moderate usage
- **Rekognition**: $1 per 1,000 images
  - Estimated: $1-5/month

**Total Estimated Cost**: $10-30/month for demo/prototype

## Monitoring & Debugging

### CloudWatch Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/bhumi-disease-detection --follow

# View all Lambda functions
aws logs tail --follow --filter-pattern "ERROR"
```

### API Gateway Logs

Enable logging in API Gateway Console:
1. Go to API Gateway → Your API → Stages
2. Enable CloudWatch Logs
3. Set log level to INFO or ERROR

### DynamoDB Monitoring

```bash
# Check table status
aws dynamodb describe-table --table-name bhumi-users

# Scan table (for debugging)
aws dynamodb scan --table-name bhumi-users --max-items 10
```

## Troubleshooting

### Issue: Bedrock Access Denied

**Solution**: Ensure you've requested model access in Bedrock console

### Issue: CORS Errors

**Solution**: Check API Gateway CORS configuration:
```bash
cd infrastructure
# Update CORS settings in cdk-stack.ts
cdk deploy
```

### Issue: Lambda Timeout

**Solution**: Increase timeout in CDK stack:
```typescript
timeout: cdk.Duration.seconds(60) // Increase from 30
```

### Issue: Cognito Authentication Fails

**Solution**: Verify User Pool settings and client configuration

## Competition Presentation Tips

### Highlight AWS Services Used:

1. **Amazon Bedrock (Claude 3)** - Core AI reasoning
2. **Amazon Rekognition** - Image analysis
3. **Amazon Cognito** - Secure authentication
4. **AWS Lambda** - Serverless compute
5. **Amazon API Gateway** - RESTful API
6. **Amazon DynamoDB** - NoSQL database
7. **Amazon S3** - Object storage
8. **Amazon CloudWatch** - Monitoring

### Demo Flow:

1. Show architecture diagram
2. Live demo: User signup → Disease detection → Chat
3. Show AWS Console (Lambda, Bedrock, DynamoDB)
4. Explain cost optimization
5. Discuss scalability

## Cleanup (After Competition)

```bash
# Destroy all resources
cd infrastructure
cdk destroy

# Confirm with 'y'
```

**Note**: This will delete all data. Export important data first!

## Additional Resources

- [Amazon Bedrock Documentation](https://docs.aws.amazon.com/bedrock/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [Anthropic Claude API Guide](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)

## Support

For issues or questions:
- AWS Support: https://console.aws.amazon.com/support/
- AWS re:Post: https://repost.aws/
- GitHub Issues: [Your Repository]

---

**Good luck with the AWS AIdeaS Competition! 🚀**
