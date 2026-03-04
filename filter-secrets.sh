#!/bin/bash

echo "🔒 Removing sensitive data from git history..."

# Create a backup branch
git branch backup-before-filter 2>/dev/null || true

# Use git filter-branch to replace sensitive data in history
git filter-branch --force --index-filter \
  'git ls-files -z | xargs -0 sed -i "" \
    -e "s/[REMOVED_FOR_SECURITY]/YOUR_FIREBASE_API_KEY/g" \
    -e "s/bhumi-farming\.firebaseapp\.com/YOUR_PROJECT.firebaseapp.com/g" \
    -e "s/bhumi-farming\.firebasestorage\.app/YOUR_PROJECT.firebasestorage.app/g" \
    -e "s/2596799742/YOUR_SENDER_ID/g" \
    -e "s/1:2596799742:web:582714ecd968e8cec591af/YOUR_APP_ID/g" \
    2>/dev/null || true' \
  --tag-name-filter cat -- --all

echo "✅ Git history cleaned"
echo "⚠️  You need to force push: git push origin --force --all"
