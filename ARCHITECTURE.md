# 🏗️ BHUMI AWS Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                               │
│                                                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  React Frontend (Vite + TypeScript + TailwindCSS)            │  │
│  │  • Disease Detection UI    • Weather Dashboard               │  │
│  │  • Chat Interface          • Crop Recommendations            │  │
│  │  • Yield Prediction        • Smart Advisory                  │  │
│  │  • Voice Agent             • Analytics                       │  │
│  │  • Multi-language (9 languages)                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Hosted on: AWS Amplify / S3 + CloudFront                           │
└───────────────────────────┬───────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AMAZON API GATEWAY                                │
│  • REST API Endpoints                                                │
│  • CORS Configuration                                                │
│  • Request/Response Transformation                                   │
│  • Throttling & Rate Limiting                                        │
└───────────────────────────┬───────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Lambda     │    │   Lambda     │    │   Lambda     │
│   Disease    │    │    Chat      │    │   Weather    │
│  Detection   │    │              │    │   Forecast   │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       │                   │                   │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Lambda     │    │   Lambda     │    │   Lambda     │
│    Crop      │    │    Yield     │    │    Smart     │
│    Recs      │    │  Prediction  │    │   Advisory   │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       │                   │                   │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Lambda     │    │   Lambda     │    │   Lambda     │
│  Analytics   │    │    Voice     │    │     Auth     │
│   Insight    │    │    Chat      │    │  (Signup/    │
└──────┬───────┘    └──────┬───────┘    │   Login)     │
       │                   │             └──────┬───────┘
       │                   │                    │
       └───────────────────┼────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        AWS AI & DATA SERVICES                        │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AMAZON BEDROCK (AI Reasoning)                              │    │
│  │  • Claude 3 Sonnet (Main AI - Complex reasoning)            │    │
│  │  • Claude 3 Haiku (Fast AI - Quick responses)               │    │
│  │  • Vision capabilities (Image analysis)                     │    │
│  │  • Multi-language support                                   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AMAZON REKOGNITION (Computer Vision)                       │    │
│  │  • Label Detection                                           │    │
│  │  • Object Recognition                                        │    │
│  │  • Scene Analysis                                            │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AMAZON COGNITO (Authentication)                            │    │
│  │  • User Pool (User management)                              │    │
│  │  • User Pool Client (App integration)                       │    │
│  │  • Custom attributes (Farm data)                            │    │
│  │  • JWT tokens                                                │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AMAZON DYNAMODB (NoSQL Database)                           │    │
│  │  • bhumi-users (User profiles)                              │    │
│  │  • bhumi-disease-history (Analysis history)                 │    │
│  │  • On-demand billing                                         │    │
│  │  • Point-in-time recovery                                    │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AMAZON S3 (Object Storage)                                 │    │
│  │  • Crop images storage                                       │    │
│  │  • CORS enabled                                              │    │
│  │  • Lifecycle policies                                        │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  AMAZON CLOUDWATCH (Monitoring & Logging)                   │    │
│  │  • Lambda logs                                               │    │
│  │  • API Gateway logs                                          │    │
│  │  • Metrics & Alarms                                          │    │
│  │  • Dashboards                                                │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
│  • OpenWeatherMap API (Weather data)                                │
│  • Future: Amazon Transcribe (Voice-to-text)                        │
│  • Future: Amazon Polly (Text-to-speech)                            │
└─────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### 1. Disease Detection Flow

```
User uploads image
       │
       ▼
Frontend (React)
       │
       ▼
API Gateway (/disease-detection)
       │
       ▼
Lambda Function
       │
       ├─► Amazon Rekognition
       │   (Label detection)
       │   └─► Returns: Labels
       │
       └─► Amazon Bedrock (Claude 3 + Vision)
           (Disease analysis)
           └─► Returns: {disease, confidence, treatment, preventative}
                   │
                   ▼
           Store in DynamoDB (history)
                   │
                   ▼
           Return to Frontend
                   │
                   ▼
           Display results to user
```

### 2. Chat Flow

```
User sends message
       │
       ▼
Frontend (React)
       │
       ▼
API Gateway (/chat)
       │
       ▼
Lambda Function
       │
       ▼
Amazon Bedrock (Claude 3 Sonnet)
  • System prompt (Bhumi personality)
  • Conversation history
  • User message
  • Language preference
       │
       ▼
AI generates response
       │
       ▼
Return to Frontend
       │
       ▼
Display in chat interface
```

### 3. Authentication Flow

```
User signs up
       │
       ▼
Frontend (React)
       │
       ▼
API Gateway (/auth/signup)
       │
       ▼
Lambda Function
       │
       ├─► Amazon Cognito
       │   (Create user)
       │   └─► Returns: User ID, Tokens
       │
       └─► Amazon DynamoDB
           (Store profile)
           └─► Returns: User profile
                   │
                   ▼
           Return tokens to Frontend
                   │
                   ▼
           Store in localStorage
                   │
                   ▼
           Redirect to Dashboard
```

## Component Architecture

### Frontend Components

```
App.tsx (Root)
    │
    ├─► Layout.tsx
    │   ├─► Sidebar Navigation
    │   ├─► Mobile Menu
    │   └─► Theme Toggle
    │
    ├─► Dashboard.tsx
    │   ├─► Weather Cards
    │   ├─► Quick Actions
    │   ├─► Yield Trends Chart
    │   └─► Active Alerts
    │
    ├─► DiseaseDetection.tsx
    │   ├─► Image Upload
    │   ├─► Analysis Results
    │   └─► Treatment Recommendations
    │
    ├─► Chatbot.tsx
    │   ├─► Message List
    │   ├─► Input Field
    │   └─► Voice Input
    │
    ├─► Weather.tsx
    │   ├─► Current Weather
    │   ├─► 5-Day Forecast
    │   └─► Farming Advisory
    │
    ├─► CropRecommendation.tsx
    │   ├─► Input Form
    │   └─► Recommendation Cards
    │
    ├─► YieldPrediction.tsx
    │   ├─► Farm Details Form
    │   └─► Prediction Results
    │
    ├─► SmartAdvisory.tsx
    │   ├─► Advisory Tabs
    │   └─► Recommendations
    │
    ├─► Analytics.tsx
    │   ├─► Charts (Recharts)
    │   └─► AI Insights
    │
    ├─► Profile.tsx
    │   ├─► User Info
    │   └─► Farm Details
    │
    ├─► ChatWidget.tsx (Floating)
    │   └─► Mini Chat Interface
    │
    └─► VoiceAgent.tsx (Modal)
        └─► Voice Interaction UI
```

### Backend Services

```
services/
    │
    ├─► awsService.ts
    │   ├─► analyzeCropDisease()
    │   ├─► getCropRecommendations()
    │   ├─► chatWithBhumi()
    │   ├─► voiceAgentChat()
    │   ├─► getYieldPrediction()
    │   ├─► getSmartAdvisory()
    │   ├─► getWeatherForecast()
    │   └─► getAnalyticsInsight()
    │
    ├─► awsCognito.ts
    │   ├─► signup()
    │   ├─► login()
    │   ├─► logout()
    │   ├─► getCurrentUser()
    │   └─► updateProfile()
    │
    └─► index.ts (Switcher)
        └─► Toggle between AWS/Gemini
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                           │
│                                                               │
│  1. HTTPS/TLS Encryption                                     │
│     └─► All traffic encrypted in transit                     │
│                                                               │
│  2. Amazon Cognito                                           │
│     ├─► User authentication                                  │
│     ├─► JWT tokens                                           │
│     └─► Password policies                                    │
│                                                               │
│  3. API Gateway                                              │
│     ├─► Request validation                                   │
│     ├─► Rate limiting                                        │
│     └─► CORS configuration                                   │
│                                                               │
│  4. IAM Roles & Policies                                     │
│     ├─► Lambda execution role                                │
│     ├─► Least privilege access                               │
│     └─► Service-to-service auth                              │
│                                                               │
│  5. DynamoDB & S3                                            │
│     ├─► Encryption at rest                                   │
│     ├─► Access control                                       │
│     └─► Backup & recovery                                    │
│                                                               │
│  6. CloudWatch                                               │
│     ├─► Audit logs                                           │
│     ├─► Security monitoring                                  │
│     └─► Anomaly detection                                    │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  SCALABILITY FEATURES                        │
│                                                               │
│  1. Serverless Lambda                                        │
│     └─► Auto-scales from 0 to 1000s of concurrent requests  │
│                                                               │
│  2. API Gateway                                              │
│     └─► Handles millions of requests per second             │
│                                                               │
│  3. DynamoDB                                                 │
│     └─► On-demand scaling, unlimited throughput             │
│                                                               │
│  4. S3                                                       │
│     └─► Unlimited storage, 99.999999999% durability         │
│                                                               │
│  5. CloudFront (Optional)                                    │
│     └─► Global CDN, edge caching                             │
│                                                               │
│  6. Multi-AZ Deployment                                      │
│     └─► High availability across availability zones         │
└─────────────────────────────────────────────────────────────┘
```

## Cost Optimization

```
┌─────────────────────────────────────────────────────────────┐
│                  COST OPTIMIZATION                           │
│                                                               │
│  1. Serverless = Pay-per-use                                 │
│     └─► No idle costs, only pay for actual usage            │
│                                                               │
│  2. Free Tier Eligible                                       │
│     ├─► Lambda: 1M requests/month                            │
│     ├─► API Gateway: 1M requests/month                       │
│     ├─► DynamoDB: 25GB storage                               │
│     └─► S3: 5GB storage                                      │
│                                                               │
│  3. On-Demand Pricing                                        │
│     └─► DynamoDB scales with usage                           │
│                                                               │
│  4. Lambda Memory Optimization                               │
│     └─► Right-sized memory allocation                        │
│                                                               │
│  5. S3 Lifecycle Policies                                    │
│     └─► Auto-archive old images                              │
└─────────────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                    CLOUDWATCH MONITORING                     │
│                                                               │
│  Metrics:                                                     │
│  ├─► Lambda invocations                                      │
│  ├─► Lambda duration                                         │
│  ├─► Lambda errors                                           │
│  ├─► API Gateway requests                                    │
│  ├─► API Gateway latency                                     │
│  ├─► DynamoDB read/write capacity                            │
│  └─► Bedrock API calls                                       │
│                                                               │
│  Logs:                                                        │
│  ├─► Lambda execution logs                                   │
│  ├─► API Gateway access logs                                 │
│  └─► Application logs                                        │
│                                                               │
│  Alarms:                                                      │
│  ├─► High error rate                                         │
│  ├─► High latency                                            │
│  └─► Throttling events                                       │
└─────────────────────────────────────────────────────────────┘
```

---

**This architecture is designed for:**
- ✅ Scalability (millions of users)
- ✅ Reliability (99.9% uptime)
- ✅ Security (enterprise-grade)
- ✅ Cost-effectiveness ($10-30/month for prototype)
- ✅ Performance (<2s response time)
