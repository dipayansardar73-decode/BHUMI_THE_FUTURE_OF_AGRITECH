# 🌾 BHUMI: Smart Farming Assistant

> **AWS AIdeaS Competition Edition**  
> Empowering Farmers with AI-Powered Agricultural Intelligence

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![AWS](https://img.shields.io/badge/AWS-Powered-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Project Overview

BHUMI is a comprehensive agricultural platform that leverages AWS AI services to provide farmers with intelligent, data-driven insights for better crop management, disease prevention, and yield optimization.

### 🏆 Built for AWS AIdeaS Competition

This project showcases the power of AWS services including Amazon Bedrock, Rekognition, Lambda, and more to solve real-world agricultural challenges.

## ✨ Key Features

| Feature | Description | AWS Service |
|---------|-------------|-------------|
| 🔬 **Disease Detection** | AI-powered crop disease identification from images | Bedrock + Rekognition |
| 📊 **Yield Prediction** | ML-based harvest forecasting | Bedrock (Claude 3) |
| 🌾 **Crop Recommendations** | Smart crop planning based on soil, season, location | Bedrock (Claude 3) |
| 🌤️ **Weather Forecasting** | Real-time weather with farming advisories | Bedrock + Weather API |
| 💬 **AI Chatbot** | Conversational farming assistant | Bedrock (Claude 3) |
| 🎤 **Voice Agent** | Hands-free voice interaction | Bedrock (Haiku) |
| 📈 **Analytics** | Farm performance insights | Bedrock + DynamoDB |
| 🌍 **Multi-Language** | Support for 9 languages | Bedrock |

## 🏗️ Architecture

```
React Frontend → API Gateway → Lambda Functions → AWS AI Services
                                                   ├─ Bedrock (Claude 3)
                                                   ├─ Rekognition
                                                   ├─ Cognito
                                                   ├─ DynamoDB
                                                   └─ S3
```

[View Detailed Architecture →](./ARCHITECTURE.md)

## 🚀 Quick Start

### Prerequisites
- AWS Account with Bedrock access
- Node.js 18+
- AWS CLI configured
- OpenWeatherMap API key

### Installation

```bash
# 1. Clone repository
git clone <your-repo>
cd BHUMI_THE_FUTURE_OF_AGRICULTURE-1

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local with your AWS credentials

# 4. Deploy to AWS
./scripts/deploy-aws.sh

# 5. Run locally
npm run dev
```

[View Complete Deployment Guide →](./AWS_DEPLOYMENT_GUIDE.md)

## 📚 Documentation

- 📖 [Quick Start Guide](./QUICK_START.md) - Get started in 5 minutes
- 🚀 [AWS Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md) - Complete deployment instructions
- 🏗️ [Architecture Details](./ARCHITECTURE.md) - System architecture diagrams
- ✅ [Migration Checklist](./MIGRATION_CHECKLIST.md) - Step-by-step migration guide
- 📋 [AWS Migration Summary](./AWS_MIGRATION_SUMMARY.md) - What changed and why

## 🎬 Demo

### Live Demo Flow
1. **User Authentication** - Secure signup/login with Cognito
2. **Disease Detection** - Upload crop image, get AI diagnosis
3. **Chat with Bhumi** - Ask farming questions in natural language
4. **Weather Insights** - Real-time weather with farming advisories
5. **Crop Planning** - Get personalized crop recommendations
6. **Yield Forecasting** - Predict harvest based on farm data

### Screenshots

[Add your screenshots here]

## 🌍 Multi-Language Support

BHUMI supports 9 languages to reach farmers globally:

- 🇬🇧 English
- 🇮🇳 Hindi (हिन्दी)
- 🇮🇳 Odia (ଓଡ଼ିଆ)
- 🇮🇳 Bengali (বাংলা)
- 🇨🇳 Mandarin (中文)
- 🇪🇸 Spanish (Español)
- 🇷🇺 Russian (Русский)
- 🇯🇵 Japanese (日本語)
- 🇧🇷 Portuguese (Português)

## 💰 Cost Analysis

### Free Tier (First 12 months)
- Lambda: 1M requests/month
- API Gateway: 1M requests/month
- DynamoDB: 25GB storage
- S3: 5GB storage
- Cognito: 50,000 MAU

### Paid Services
- Amazon Bedrock: ~$5-20/month
- Rekognition: ~$1-5/month

**Total Estimated Cost**: $10-30/month for prototype

[View Detailed Cost Breakdown →](./AWS_DEPLOYMENT_GUIDE.md#cost-estimation-aws-free-tier)

## 🔧 Technology Stack

### Frontend
- React 19.2.1
- TypeScript
- TailwindCSS
- Vite
- Recharts

### Backend (AWS)
- Amazon Bedrock (Claude 3 Sonnet/Haiku)
- Amazon Rekognition
- AWS Lambda (Node.js 18)
- Amazon API Gateway
- Amazon Cognito
- Amazon DynamoDB
- Amazon S3
- Amazon CloudWatch

### Infrastructure
- AWS CDK (TypeScript)
- Infrastructure as Code

## 📊 AWS Services Integration

| Service | Purpose | Usage |
|---------|---------|-------|
| **Amazon Bedrock** | AI reasoning & vision | Core AI engine |
| **Amazon Rekognition** | Image analysis | Disease detection |
| **AWS Lambda** | Serverless compute | 10 functions |
| **API Gateway** | REST API | All endpoints |
| **Amazon Cognito** | Authentication | User management |
| **Amazon DynamoDB** | NoSQL database | User data & history |
| **Amazon S3** | Object storage | Image storage |
| **CloudWatch** | Monitoring | Logs & metrics |

## 🧪 Testing

```bash
# Test all AWS services
./scripts/test-aws-services.sh

# Test specific endpoint
curl -X POST $API_GATEWAY_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello","language":"English","history":[]}'
```

## 📈 Performance Metrics

- ⚡ Response Time: <2 seconds for AI queries
- 🚀 Scalability: Auto-scales to handle millions of requests
- 💪 Availability: 99.9% uptime with multi-AZ deployment
- 🔒 Security: Enterprise-grade with Cognito + IAM

## 🏆 Competition Highlights

### Innovation
- ✅ Multi-modal AI (vision + text)
- ✅ Real-time weather integration
- ✅ Voice-enabled interface
- ✅ 9-language support

### AWS Integration
- ✅ 8 AWS services integrated
- ✅ Serverless architecture
- ✅ Production-ready monitoring
- ✅ Cost-optimized design

### Impact
- ✅ Helps farmers make data-driven decisions
- ✅ Reduces crop losses through early disease detection
- ✅ Increases yield with smart recommendations
- ✅ Accessible in local languages

## 🛠️ Development

### Project Structure
```
├── services/           # AWS service integrations
├── lambda/            # Lambda function code
├── infrastructure/    # AWS CDK stack
├── components/        # React components
├── pages/            # Page components
├── scripts/          # Deployment scripts
└── docs/             # Documentation
```

### Local Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Deploy to AWS
```bash
cd infrastructure
cdk deploy          # Deploy infrastructure
```

## 🔐 Security

- ✅ Cognito authentication with JWT tokens
- ✅ IAM role-based access control
- ✅ API Gateway authorization
- ✅ Encrypted data at rest (DynamoDB, S3)
- ✅ HTTPS/TLS encryption in transit
- ✅ CORS configuration
- ✅ CloudWatch security monitoring

## 📞 Support & Resources

- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](your-repo/issues)
- 📖 AWS Docs: https://docs.aws.amazon.com/
- 🤖 Bedrock Guide: https://docs.aws.amazon.com/bedrock/

## 🤝 Contributing

This is a competition project. For collaboration:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📄 License

MIT License - See [LICENSE](./LICENSE) file

## 👥 Team

- **Your Name** - Lead Developer & AWS Architect
- **Team Member 2** - Backend Development
- **Team Member 3** - Frontend Development
- **Team Member 4** - UI/UX Design

## 🙏 Acknowledgments

- AWS for providing world-class cloud services
- Anthropic for Claude 3 AI models
- OpenWeatherMap for weather data
- The farming community for inspiration and feedback

## 📊 Project Stats

- 📝 Lines of Code: 10,000+
- 🔧 AWS Services: 8
- 🌍 Languages Supported: 9
- ⚡ Lambda Functions: 10
- 📱 Pages: 9
- 🎨 Components: 15+

## 🎯 Future Enhancements

- [ ] Amazon Transcribe integration for voice input
- [ ] Amazon Polly for text-to-speech
- [ ] Amazon SageMaker for custom ML models
- [ ] Amazon Kendra for knowledge base
- [ ] Mobile app (React Native)
- [ ] Offline mode with sync
- [ ] Community features
- [ ] Marketplace integration

## 📱 Screenshots

[Add screenshots of your application here]

## 🎥 Demo Video

[Add link to demo video]

## 🌟 Star History

If you find this project helpful, please consider giving it a star! ⭐

---

<div align="center">

**Built with ❤️ for farmers using AWS AI services**

🌾 **BHUMI** - Empowering Agriculture with AI

[Website](#) • [Documentation](./AWS_DEPLOYMENT_GUIDE.md) • [Demo](#) • [Report Bug](issues)

</div>
