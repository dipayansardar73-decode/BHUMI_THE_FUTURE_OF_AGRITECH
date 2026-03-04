# 🎯 BHUMI Setup Status

## ✅ Completed Steps

### 1. Weather API Key ✅
- **Service**: OpenWeatherMap
- **API Key**: `YOUR_WEATHER_API_KEY_HERE`
- **Status**: Configured in `.env.local`
- **Test**: https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_WEATHER_API_KEY_HERE

### 2. Code Preparation ✅
- All Lambda functions created
- AWS service layer implemented
- Frontend ready
- Claude 3 Haiku configured
- TypeScript errors fixed

### 3. Environment Configuration ✅
- `.env.local` created
- Weather API key added
- Vite configuration ready

---

## 📋 Next Steps (In Order)

### Step 1: Enable Amazon Bedrock (15 min) 🔴 **DO THIS FIRST**

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Search for "Bedrock" in the search bar
3. Click **"Model access"** in left sidebar
4. Click **"Manage model access"** button
5. Enable these models:
   - ✅ **Anthropic Claude 3 Haiku**
   - ✅ **Anthropic Claude 3 Sonnet** (optional backup)
6. Click **"Save changes"**
7. Wait for "Access granted" status

**Why this is critical**: Without Bedrock access, your Lambda functions won't work!

---

### Step 2: Configure AWS CLI (10 min)

```bash
# Check if AWS CLI is installed
aws --version

# If not installed:
# macOS: brew install awscli
# Or download from: https://aws.amazon.com/cli/

# Configure credentials
aws configure

# Enter when prompted:
# AWS Access Key ID: [Get from AWS Console → IAM → Users → Security credentials]
# AWS Secret Access Key: [From same place]
# Default region: us-east-1
# Default output format: json

# Verify it works
aws sts get-caller-identity
```

---

### Step 3: Install Dependencies (10 min)

```bash
# 1. Install frontend dependencies
npm install

# 2. Install Lambda dependencies
cd lambda
npm install
cd ..

# 3. Install CDK dependencies
cd infrastructure
npm install
cd ..

# 4. Install AWS CDK globally (if not installed)
npm install -g aws-cdk
```

---

### Step 4: Deploy to AWS (20 min)

```bash
# Set your Weather API key for deployment
export WEATHER_API_KEY=YOUR_WEATHER_API_KEY_HERE

# Bootstrap CDK (first time only)
cd infrastructure
cdk bootstrap

# Deploy the stack
cdk deploy

# IMPORTANT: Copy the outputs that appear!
# You'll see something like:
# ✅ BhumiStack
# 
# Outputs:
# BhumiStack.ApiGatewayUrl = https://abc123.execute-api.us-east-1.amazonaws.com/prod
# BhumiStack.UserPoolId = us-east-1_ABC123XYZ
# BhumiStack.UserPoolClientId = 1a2b3c4d5e6f7g8h9i0j
# BhumiStack.ImagesBucketName = bhumi-crop-images-123456789
```

**📝 SAVE THESE OUTPUTS! You need them for the next step.**

---

### Step 5: Update .env.local with CDK Outputs (5 min)

After CDK deployment, edit `.env.local`:

```bash
# Open the file
nano .env.local
# or
code .env.local
```

**Replace the placeholder values with your actual CDK outputs:**

```bash
VITE_AWS_REGION=us-east-1
VITE_API_GATEWAY_URL=https://YOUR-ACTUAL-API-ID.execute-api.us-east-1.amazonaws.com/prod
VITE_COGNITO_USER_POOL_ID=us-east-1_YOUR-ACTUAL-POOL-ID
VITE_COGNITO_CLIENT_ID=YOUR-ACTUAL-CLIENT-ID
VITE_COGNITO_IDENTITY_POOL_ID=us-east-1:your-actual-identity-pool-id

WEATHER_API_KEY=YOUR_WEATHER_API_KEY_HERE
```

---

### Step 6: Test Locally (15 min)

```bash
# Start the development server
npm run dev

# Open browser to http://localhost:3000

# Test these features:
# 1. Sign up with a new account
# 2. Log in
# 3. Upload a crop image (Disease Detection)
# 4. Chat with Bhumi
# 5. Check weather forecast
# 6. Get crop recommendations
```

---

### Step 7: Deploy Frontend (15 min)

#### Option A: AWS Amplify (Recommended)

1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click **"New app"** → **"Host web app"**
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Add environment variables:
   ```
   VITE_AWS_REGION=us-east-1
   VITE_API_GATEWAY_URL=your-api-gateway-url
   VITE_COGNITO_USER_POOL_ID=your-pool-id
   VITE_COGNITO_CLIENT_ID=your-client-id
   VITE_COGNITO_IDENTITY_POOL_ID=your-identity-pool-id
   ```
6. Deploy!

#### Option B: S3 Static Website

```bash
# Build the app
npm run build

# Create S3 bucket
aws s3 mb s3://bhumi-app-$(date +%s)

# Upload files
aws s3 sync dist/ s3://your-bucket-name --acl public-read

# Enable static website hosting
aws s3 website s3://your-bucket-name --index-document index.html
```

---

## 🧪 Quick Tests

### Test Weather API (Right Now!)

```bash
# Test your Weather API key
curl "https://api.openweathermap.org/data/2.5/weather?q=Bhubaneswar&appid=YOUR_WEATHER_API_KEY_HERE&units=metric"

# You should see weather data for Bhubaneswar!
```

### Test AWS Configuration

```bash
# Check AWS credentials
aws sts get-caller-identity

# Check Bedrock models (after enabling access)
aws bedrock list-foundation-models --region us-east-1 | grep claude-3-haiku
```

### Test Lambda Functions (After Deployment)

```bash
# Test chat endpoint
curl -X POST $VITE_API_GATEWAY_URL/chat \
  -H "Content-Type: application/json" \
  -d '{
    "history": [],
    "message": "What is the best crop for clay soil?",
    "language": "English"
  }'
```

---

## 📊 Progress Tracker

```
Setup Progress: ████████░░░░░░░░░░░░ 40%

✅ Weather API configured
✅ Code prepared
✅ Environment file created
⏳ Bedrock access (DO THIS NEXT!)
⏳ AWS CLI configured
⏳ Dependencies installed
⏳ CDK deployed
⏳ Frontend configured
⏳ Local testing
⏳ Frontend deployed
```

---

## 🎯 Your Current Status

### ✅ What You Have
- Weather API key: `YOUR_WEATHER_API_KEY_HERE`
- `.env.local` file created
- All code ready
- Claude 3 Haiku configured

### 🔴 What You Need (Priority Order)
1. **Enable Bedrock access** (15 min) - CRITICAL!
2. **Configure AWS CLI** (10 min)
3. **Install dependencies** (10 min)
4. **Deploy CDK** (20 min)
5. **Update .env.local** (5 min)
6. **Test locally** (15 min)
7. **Deploy frontend** (15 min)

**Total Time Remaining: ~90 minutes**

---

## 🚀 Quick Start Command

Once you have Bedrock access and AWS CLI configured:

```bash
# One command to install everything
npm install && \
cd lambda && npm install && cd .. && \
cd infrastructure && npm install && cd ..

# Then deploy
export WEATHER_API_KEY=YOUR_WEATHER_API_KEY_HERE
cd infrastructure
cdk bootstrap
cdk deploy
```

---

## 💡 Pro Tips

### 1. Enable Bedrock First!
Don't skip this step. Your Lambda functions need Claude 3 Haiku access.

### 2. Save CDK Outputs
Copy them to a text file immediately. You'll need them multiple times.

### 3. Test Weather API Now
Run the curl command above to verify your API key works.

### 4. Use AWS Amplify
It's the easiest way to deploy the frontend with automatic CI/CD.

### 5. Check CloudWatch Logs
If something doesn't work, check Lambda logs:
```bash
aws logs tail /aws/lambda/bhumi-chat --follow
```

---

## 🆘 Common Issues

### Issue: "Access Denied" on Bedrock
**Fix**: Go to Bedrock console → Model access → Enable Claude 3 Haiku

### Issue: "No credentials found"
**Fix**: Run `aws configure` and enter your credentials

### Issue: Weather API returns 401
**Fix**: Check your API key is correct (it is: `YOUR_WEATHER_API_KEY_HERE`)

### Issue: CDK deploy fails
**Fix**: Make sure you ran `cdk bootstrap` first

---

## 📞 Need Help?

- AWS Documentation: https://docs.aws.amazon.com/
- Bedrock Guide: https://docs.aws.amazon.com/bedrock/
- OpenWeatherMap Docs: https://openweathermap.org/api
- Your deployment guides: Check `QUICK_START.md` and `AWS_DEPLOYMENT_GUIDE.md`

---

## 🎉 You're 40% Done!

Next step: **Enable Bedrock access** (15 minutes)

Then you'll be ready to deploy! 🚀

---

**Last Updated**: March 3, 2026  
**Weather API**: ✅ Configured  
**Next Action**: Enable Bedrock access in AWS Console
