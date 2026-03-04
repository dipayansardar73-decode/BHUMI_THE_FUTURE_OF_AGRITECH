#!/bin/bash

# Quick test of BHUMI endpoints

API_URL="https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/prod"

echo "🧪 Testing BHUMI Endpoints..."
echo ""

# Test Chat
echo "1️⃣  Testing Chat (Bedrock AI)..."
CHAT=$(curl -s -X POST $API_URL/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Say hello","language":"English","history":[]}')

if echo $CHAT | grep -q '"reply"'; then
    echo "✅ Chat working!"
    echo $CHAT | grep -o '"reply":"[^"]*"' | cut -d'"' -f4
else
    echo "❌ Chat failed - Bedrock access needed"
    echo "   Go to: https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess"
fi
echo ""

# Test Weather
echo "2️⃣  Testing Weather..."
WEATHER=$(curl -s -X POST $API_URL/weather-forecast \
  -H "Content-Type: application/json" \
  -d '{"location":"Delhi","language":"English"}')

if echo $WEATHER | grep -q '"forecast"'; then
    echo "✅ Weather working!"
else
    echo "⚠️  Weather endpoint issue"
fi
echo ""

# Test Crop Recommendations
echo "3️⃣  Testing Crop Recommendations..."
CROP=$(curl -s -X POST $API_URL/crop-recommendations \
  -H "Content-Type: application/json" \
  -d '{"location":"Punjab","soilType":"Clay","season":"Kharif","language":"English"}')

if echo $CROP | grep -q '"recommendations"'; then
    echo "✅ Crop recommendations working!"
else
    echo "⚠️  Crop recommendations issue"
fi
echo ""

echo "================================"
echo "Frontend: http://localhost:3000"
echo "================================"
