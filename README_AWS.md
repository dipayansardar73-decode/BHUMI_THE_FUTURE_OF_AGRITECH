# BHUMI: Smart Farming Assistant - AWS Edition

> **AWS AIdeaS Competition Version**  
> Powered by Amazon Bedrock, Rekognition, and AWS Serverless Architecture

![BHUMI Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## 🌟 Overview

BHUMI is a production-grade agricultural platform that leverages AWS AI services to help farmers with:
- 🔬 **Disease Detection** - AI-powered crop disease identification
- 📊 **Yield Prediction** - ML-based harvest forecasting
- 🌾 **Crop Recommendations** - Smart crop planning
- 🌤️ **Weather Forecasting** - Real-time weather with farming advisories
- 💬 **AI Chatbot** - Conversational farming assistant
- 🎤 **Voice Agent** - Hands-free voice interaction

## 🏗️ AWS Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│                  Hosted on AWS Amplify                       │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              Amazon API Gateway (REST API)                   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────┐  ┌──────────┐  ┌──────────┐
│  Lambda  │  │  Lambda  │  │  Lambda  │  ... (10 functions)
│ Disease  │  │   Chat   │  │  Weather │
└────┬─────┘  └────┬─────┘  └────┬─────┘
     │             │             │
     ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                      AWS Services                            │
├─────────────────────────────────────────────────────────────┤
│  • Amazon Bedrock (Claude 3 Sonnet/Haiku) - AI Reasoning   │
│  • Amazon Rekognition - Image Analysis                      │
│  • Amazon Cognito - Authentication                          │
│  • Amazon DynamoDB - User Data & History                    │
│  • Amazon S3 - Image Storage                                │
│  • Amazon CloudWatch - Monitoring & Logging                 │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- AWS Account with Bedrock access
- Node.js 18+
- AWS CLI configured
- OpenWeatherMap API key (free)

### 1. Clone & Install

```bash
git clone <your-repo>
cd BHUMI_THE_FUTURE_OF_AGRICULTURE-1
npm install
```

### 2. Configure AWS

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your AWS credentials
# Get OpenWeatherMap key from: https://openweathermap.org/api
```

### 3. Deploy to AWS

```bash
# Automated deployment
./scripts/deploy-aws.sh

# Or manual deployment
cd infrastructure
npm install
cdk bootstrap
cdk deploy
```

### 4. Update Frontend Config

After CDK deployment, update `.env.local` with the outputs:
- API_GATEWAY_URL
- COGNITO_USER_POOL_ID
- COGNITO_CLIENT_ID

### 5. Run Locally

```bash
npm run dev
```

Visit http://localhost:3000

## 📦 AWS Services Used

| Service | Purpose | Cost (Est.) |
|---------|---------|-------------|
| **Amazon Bedrock** | AI reasoning with Claude 3 | $5-20/month |
| **Amazon Rekognition** | Image analysis | $1-5/month |
| **AWS Lambda** | Serverless compute | Free tier |
| **API Gateway** | REST API | Free tier |
| **Amazon Cognito** | User authentication | Free tier |
| **Amazon DynamoDB** | NoSQL database | Free tier |
| **Amazon S3** | Object storage | Free tier |
| **CloudWatch** | Monitoring | Free tier |

**Total Estimated Cost**: $10-30/month for prototype

## 🎯 Key Features

### 1. Disease Detection
- Upload crop images
- AI-powered analysis using Bedrock + Rekognition
- Treatment recommendations
- Preventative measures

### 2. Yield Prediction
- Input farm parameters
- ML-based yield forecasting
- Confidence scoring
- Agronomic suggestions

### 3. Smart Advisory
- Irrigation management
- Fertilizer recommendations
- Pest control guidance
- Stage-specific advice

### 4. Weather Integration
- Real-time weather data
- 5-day forecast
- Farming advisories
- Location-based insights

### 5. AI Chatbot
- Natural language conversations
- Multi-language support (9 languages)
- Context-aware responses
- Voice input/output

## 🌍 Multi-Language Support

- 🇬🇧 English
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Odia (ଓଡ଼ିଆ)
- 🇮🇳 Bengali (বাংলা)
- 🇨🇳 Mandarin (中文)
- 🇪🇸 Spanish (Español)
- 🇷🇺 Russian (Русский)
- 🇯🇵 Japanese (日本語)
- 🇧🇷 Portuguese (Português)

## 🧪 Testing

```bash
# Test all AWS services
./scripts/test-aws-services.sh

# Test specific endpoint
curl -X POST $API_GATEWAY_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello Bhumi", "language": "English"}'
```

## 📊 Monitoring

### CloudWatch Dashboards
- Lambda execution metrics
- API Gateway requests
- Error rates
- Response times

### Logs
```bash
# View Lambda logs
aws logs tail /aws/lambda/bhumi-disease-detection --follow

# View all errors
aws logs tail --follow --filter-pattern "ERROR"
```

## 🔒 Security

- ✅ Cognito authentication
- ✅ IAM role-based access
- ✅ API Gateway authorization
- ✅ Encrypted data at rest (DynamoDB, S3)
- ✅ HTTPS/TLS encryption
- ✅ CORS configuration

## 📈 Scalability

- **Auto-scaling**: Lambda scales automatically
- **Global**: CloudFront CDN for worldwide access
- **High Availability**: Multi-AZ deployment
- **Performance**: <2s response time for AI queries

## 💰 Cost Optimization

- Serverless architecture (pay-per-use)
- Free tier eligible services
- DynamoDB on-demand pricing
- S3 lifecycle policies
- Lambda memory optimization

## 🛠️ Development

### Project Structure

```
├── services/
│   ├── awsService.ts          # AWS service layer
│   ├── awsCognito.ts          # Cognito auth
│   ├── geminiService.ts       # Original Gemini (for comparison)
│   └── index.ts               # Service switcher
├── lambda/                     # Lambda functions
│   ├── disease-detection/
│   ├── chat/
│   ├── crop-recommendations/
│   └── ...
├── infrastructure/
│   └── cdk-stack.ts           # AWS CDK infrastructure
├── components/                 # React components
├── pages/                      # Page components
└── scripts/                    # Deployment scripts
```

### Switch Between Gemini and AWS

Edit `services/index.ts`:
```typescript
const USE_AWS = true;  // true for AWS, false for Gemini
```

## 📚 Documentation

- [AWS Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- [Migration Checklist](./MIGRATION_CHECKLIST.md)
- [API Documentation](./API_DOCS.md)

## 🏆 Competition Highlights

### Innovation
- Multi-modal AI (vision + text)
- Real-time weather integration
- Voice-enabled interface
- 9-language support

### AWS Integration
- 8 AWS services integrated
- Serverless architecture
- Production-ready monitoring
- Cost-optimized design

### Impact
- Helps farmers make data-driven decisions
- Reduces crop losses
- Increases yield
- Accessible in local languages

## 🤝 Contributing

This is a competition project. For collaboration:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - See LICENSE file

## 👥 Team

- **Your Name** - Lead Developer
- **Team Member 2** - AWS Infrastructure
- **Team Member 3** - Frontend Development

## 🙏 Acknowledgments

- AWS for Bedrock and cloud services
- Anthropic for Claude 3 models
- OpenWeatherMap for weather data
- The farming community for inspiration

## 📞 Support

- Email: your-email@example.com
- GitHub Issues: [Link]
- AWS Support: https://console.aws.amazon.com/support/

---

**Built with ❤️ for farmers using AWS AI services**

🌾 **BHUMI** - Empowering Agriculture with AI
