#!/bin/bash

# Test AWS Services Script
# Quick tests for all Lambda functions

set -e

echo "🧪 Testing AWS Services"
echo "======================="
echo ""

# Load environment
source .env.local

if [ -z "$API_GATEWAY_URL" ]; then
    echo "❌ API_GATEWAY_URL not set in .env.local"
    exit 1
fi

API_URL=$API_GATEWAY_URL

echo "API Gateway URL: $API_URL"
echo ""

# Test 1: Chat
echo "1️⃣  Testing Chat..."
curl -X POST "$API_URL/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "history": [],
    "message": "What is the best crop for clay soil in monsoon season?",
    "language": "English"
  }' | jq '.'
echo ""

# Test 2: Crop Recommendations
echo "2️⃣  Testing Crop Recommendations..."
curl -X POST "$API_URL/crop-recommendations" \
  -H "Content-Type: application/json" \
  -d '{
    "soil": "Clay",
    "season": "Kharif",
    "location": "Odisha, India",
    "language": "English"
  }' | jq '.'
echo ""

# Test 3: Weather Forecast
echo "3️⃣  Testing Weather Forecast..."
curl -X POST "$API_URL/weather-forecast" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Bhubaneswar, India",
    "language": "English"
  }' | jq '.'
echo ""

# Test 4: Smart Advisory
echo "4️⃣  Testing Smart Advisory..."
curl -X POST "$API_URL/smart-advisory" \
  -H "Content-Type: application/json" \
  -d '{
    "crop": "Rice",
    "stage": "Vegetative",
    "problem": "",
    "language": "English"
  }' | jq '.'
echo ""

# Test 5: Voice Chat
echo "5️⃣  Testing Voice Chat..."
curl -X POST "$API_URL/voice-chat" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the weather like today?"
  }' | jq '.'
echo ""

echo "✅ All tests completed!"
echo ""
echo "Note: Disease detection requires image data and is best tested via the UI"
