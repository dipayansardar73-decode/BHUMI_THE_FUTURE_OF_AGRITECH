#!/bin/bash

echo "🔒 SECURITY: Cleaning Git History and Removing Sensitive Data"
echo "=============================================================="
echo ""
echo "⚠️  WARNING: This will:"
echo "   1. Remove ALL git history"
echo "   2. Create a fresh repository"
echo "   3. Force push to GitHub"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "❌ Aborted"
    exit 1
fi

echo ""
echo "📦 Step 1: Backing up current state..."
cp -r .git .git.backup
echo "✅ Backup created at .git.backup"

echo ""
echo "🗑️  Step 2: Removing git history..."
rm -rf .git

echo ""
echo "🆕 Step 3: Initializing fresh repository..."
git init
git add .
git commit -m "Initial commit - Clean version without sensitive data

- Removed all Firebase API keys from history
- Removed AWS credentials from history  
- Sanitized all documentation
- Added security best practices
- Ready for public use"

echo ""
echo "🔗 Step 4: Adding remote..."
git remote add origin https://github.com/dipayansardar73-decode/BHUMI_THE_FUTURE_OF_AGRITECH.git

echo ""
echo "📤 Step 5: Force pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ DONE!"
echo ""
echo "🎉 Your repository is now clean and secure!"
echo ""
echo "⚠️  IMPORTANT: You MUST now:"
echo "   1. Revoke your old Firebase API key"
echo "   2. Create a new Firebase project or regenerate keys"
echo "   3. Update your local .env.local file"
echo ""
echo "📚 See URGENT_SECURITY_NOTICE.md for detailed instructions"
