# ⚡ BHUMI AWS - Quick Start Guide

## 🎯 Goal
Deploy BHUMI on AWS in under 30 minutes for the AWS AIdeaS Competition.

## ✅ Prerequisites Checklist

- [ ] AWS Account (with Bedrock access)
- [ ] Node.js 18+ installed
- [ ] AWS CLI installed and configured
- [ ] Git installed
- [ ] OpenWeatherMap API key (free from https://openweathermap.org/api)

## 🚀 5-Step Deployment

### Step 1: Clone & Setup (2 min)
```bash
git clone <your-repo>
cd BHUMI_THE_FUTURE_OF_AGRICULTURE-1
npm install
```

### Step 2: Configure Environment (3 min)
```bash
# Copy template
cp .env.example .env.local

# Edit .env.local and add:
# - AWS_REGION=us-east-1
# - WEATHER_API_KEY=your-key-here
```

### Step 3: Enable Bedrock (5 min)
1. Go to AWS Console → Amazon Bedrock
2. Click "Model access" in left sidebar
3. Click "Manage model access"
4. Enable:
   - ✅ Anthropic Claude 3 Sonnet
   - ✅ Anthropic Claude 3 Haiku
5. Click "Save changes"
6. Wait for "Access granted" status

### Step 4: Deploy Infrastructure (10 min)
```bash
# Install dependencies
cd lambda && npm install && cd ..
cd infrastructure && npm install && cd ..

# Bootstrap CDK (first time only)
cd infrastructure
cdk bootstrap

# Deploy
export WEATHER_API_KEY=your-key-here
cdk deploy

# Save the outputs!
```

### Step 5: Configure & Test (5 min)
```bash
# Update .env.local with CDK outputs:
# API_GATEWAY_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
# COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
# COGNITO_CLIENT_ID=your-client-id

# Test locally
npm run dev

# Visit http://localhost:3000
```

## 🧪 Quick Test

```bash
# Test all services
./scripts/test-aws-services.sh

# Or test manually
curl -X POST $API_GATEWAY_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","language":"English","history":[]}'
```

## 📊 Verify Deployment

### Check Lambda Functions
```bash
aws lambda list-functions --query 'Functions[?starts_with(FunctionName, `bhumi`)].FunctionName'
```

### Check API Gateway
```bash
aws apigateway get-rest-apis --query 'items[?name==`bhumi-api`]'
```

### Check DynamoDB Tables
```bash
aws dynamodb list-tables --query 'TableNames[?starts_with(@, `bhumi`)]'
```

## 🎬 Demo Checklist

- [ ] User signup works
- [ ] User login works
- [ ] Disease detection works (upload image)
- [ ] Chat responds correctly
- [ ] Weather shows real data
- [ ] Crop recommendations appear
- [ ] Yield prediction calculates
- [ ] Voice agent responds
- [ ] Multi-language works

## 🐛 Quick Fixes

### Issue: "Access Denied" on Bedrock
```bash
# Check model access
aws bedrock list-foundation-models --region us-east-1
```
**Fix**: Enable models in Bedrock console

### Issue: Lambda Timeout
```bash
# Increase timeout in infrastructure/cdk-stack.ts
timeout: cdk.Duration.seconds(60)  # Change from 30 to 60
cdk deploy
```

### Issue: CORS Error
**Fix**: Already configured in CDK stack, redeploy if needed

### Issue: Environment Variables Not Working
```bash
# Check .env.local exists
cat .env.local

# Restart dev server
npm run dev
```

## 💰 Cost Check

```bash
# Check current month costs
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity MONTHLY \
  --metrics BlendedCost
```

## 🎯 Competition Day Checklist

### Before Demo
- [ ] AWS account accessible
- [ ] All services running
- [ ] Test data ready
- [ ] Backup demo video ready
- [ ] Slides ready
- [ ] Internet connection tested

### During Demo
- [ ] Show architecture diagram
- [ ] Live demo (5 min)
- [ ] Show AWS Console
- [ ] Explain cost benefits
- [ ] Answer questions confidently

### After Demo
- [ ] Collect feedback
- [ ] Note improvements
- [ ] Thank judges

## 📞 Emergency Contacts

- **AWS Support**: https://console.aws.amazon.com/support/
- **Bedrock Issues**: Check model access
- **Lambda Issues**: Check CloudWatch logs
- **API Issues**: Check API Gateway logs

## 🎓 Key Talking Points

1. **"We use Amazon Bedrock with Claude 3"** - Latest AI models
2. **"Serverless architecture"** - Auto-scaling, cost-effective
3. **"Multi-modal AI"** - Vision + Text capabilities
4. **"Production-ready"** - Monitoring, logging, security
5. **"Real impact"** - Helping farmers make better decisions
6. **"Cost-optimized"** - Only $10-30/month
7. **"Global scale"** - 9 languages, worldwide deployment
8. **"AWS native"** - Built specifically for AWS ecosystem

## 🏆 Success Formula

```
AWS Services (8) + 
AI Models (Claude 3) + 
Real Problem (Farming) + 
Production Ready (Monitoring) + 
Cost Effective ($10-30/mo) = 
WINNING SOLUTION! 🎉
```

## 📚 Quick Links

- [Full Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- [Migration Checklist](./MIGRATION_CHECKLIST.md)
- [Architecture Details](./README_AWS.md)
- [Troubleshooting](./AWS_MIGRATION_SUMMARY.md)

## ⚡ One-Line Deploy

```bash
./scripts/deploy-aws.sh && npm run dev
```

---

**You're ready! Go win that competition! 🚀🏆**

*Questions? Check the full guides or AWS documentation.*
