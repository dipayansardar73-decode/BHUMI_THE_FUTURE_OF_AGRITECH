#!/bin/bash

# Open all necessary resources for BHUMI setup

echo "🚀 Opening BHUMI Resources..."
echo ""

# Open setup guide
echo "📖 Opening setup guide..."
open setup-guide.html

# Wait a moment
sleep 2

# Open frontend
echo "🌐 Opening frontend..."
open http://localhost:3000

# Wait a moment
sleep 2

# Open AWS Bedrock console
echo "☁️  Opening AWS Bedrock console..."
open "https://us-east-1.console.aws.amazon.com/bedrock/home?region=us-east-1#/modelaccess"

# Wait a moment
sleep 2

# Open AWS Billing console
echo "💳 Opening AWS Billing console..."
open "https://console.aws.amazon.com/billing/home#/paymentmethods"

echo ""
echo "✅ All resources opened!"
echo ""
echo "Next steps:"
echo "1. Add payment method in billing console"
echo "2. Enable Claude 3 Haiku in Bedrock console"
echo "3. Wait 2-3 minutes"
echo "4. Test your app at http://localhost:3000"
echo ""
echo "Run './quick-test.sh' to verify everything works!"
