# 🔒 Security & Configuration

## ✅ Security Measures Implemented

This repository has been sanitized to remove all sensitive information before being made public.

### Removed Sensitive Data:
- ❌ Weather API keys
- ❌ AWS Account IDs
- ❌ API Gateway URLs
- ❌ Cognito User Pool IDs
- ❌ Cognito Client IDs
- ❌ S3 Bucket names with account IDs
- ❌ CDK deployment artifacts
- ❌ Environment variable files (.env.local)

### Protected Files:
The following files are excluded from version control via `.gitignore`:
- `.env.local` - Your actual environment variables
- `infrastructure/cdk.out/` - CDK deployment artifacts
- `response.json` - Test response files
- `test-bedrock.js` - Test scripts with credentials

---

## 🔧 Setup Instructions

### 1. Create Your Environment File

Copy the example file and add your actual credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual values:

```bash
# AWS Configuration (Get from CDK deployment outputs)
VITE_AWS_REGION=us-east-1
VITE_API_GATEWAY_URL=https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod
VITE_COGNITO_USER_POOL_ID=us-east-1_YOUR_POOL_ID
VITE_COGNITO_CLIENT_ID=YOUR_CLIENT_ID_HERE
VITE_S3_BUCKET=bhumi-crop-images-YOUR_ACCOUNT_ID

# Weather API (Get from https://openweathermap.org/api)
VITE_WEATHER_API_KEY=YOUR_WEATHER_API_KEY_HERE

# Google Gemini API (Optional)
VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

### 2. Get Your API Keys

#### Weather API (OpenWeatherMap)
1. Go to https://openweathermap.org/api
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to `.env.local` as `VITE_WEATHER_API_KEY`

#### Google Gemini API (Optional)
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to `.env.local` as `VITE_GEMINI_API_KEY`

### 3. Deploy AWS Infrastructure

```bash
# Install dependencies
cd infrastructure
npm install

# Configure AWS CLI
aws configure

# Bootstrap CDK (first time only)
npx cdk bootstrap

# Deploy
export WEATHER_API_KEY=your-weather-api-key
npx cdk deploy
```

### 4. Update Environment Variables

After CDK deployment, copy the outputs to your `.env.local`:
- API Gateway URL
- Cognito User Pool ID
- Cognito Client ID
- S3 Bucket name

---

## 🚨 Security Best Practices

### Never Commit:
- ❌ `.env.local` files
- ❌ API keys or secrets
- ❌ AWS credentials
- ❌ CDK deployment artifacts
- ❌ Any file containing sensitive data

### Always:
- ✅ Use `.env.example` as a template
- ✅ Keep `.gitignore` updated
- ✅ Review commits before pushing
- ✅ Use environment variables for secrets
- ✅ Rotate API keys regularly

### AWS Security:
- ✅ Use IAM roles with least privilege
- ✅ Enable MFA on AWS account
- ✅ Use AWS Secrets Manager for production
- ✅ Enable CloudTrail for audit logs
- ✅ Set up billing alerts

---

## 🔐 Environment Variables Reference

### Required for AWS Mode:
- `VITE_AWS_REGION` - AWS region (e.g., us-east-1)
- `VITE_API_GATEWAY_URL` - Your API Gateway endpoint
- `VITE_COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID` - Cognito Client ID
- `VITE_S3_BUCKET` - S3 bucket for images
- `VITE_WEATHER_API_KEY` - OpenWeatherMap API key

### Required for Gemini Mode:
- `VITE_GEMINI_API_KEY` - Google Gemini API key
- `VITE_WEATHER_API_KEY` - OpenWeatherMap API key

---

## 📞 Reporting Security Issues

If you discover a security vulnerability, please email:
- **Email**: [your-email@example.com]
- **Subject**: [SECURITY] BHUMI Vulnerability Report

Do not create public GitHub issues for security vulnerabilities.

---

## 📚 Additional Resources

- [AWS Security Best Practices](https://aws.amazon.com/security/best-practices/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [GitHub Security Guide](https://docs.github.com/en/code-security)

---

**Last Updated**: March 4, 2026  
**Status**: All sensitive data removed from repository
