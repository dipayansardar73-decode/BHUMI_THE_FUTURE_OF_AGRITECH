# 🚨 URGENT SECURITY NOTICE

## ⚠️ Sensitive Data Found in Git History

### Issue Discovered:
Firebase API credentials were found in old git commits:
- Commit: `52daa2c` - "feat: Integrate Firebase for backend services"
- File: `services/firebase.ts`

### Exposed Credentials:
- Firebase API Key: `[REMOVED_FOR_SECURITY]`
- Auth Domain: `bhumi-farming.firebaseapp.com`
- Project ID: `bhumi-farming`
- Storage Bucket: `bhumi-farming.firebasestorage.app`
- Messaging Sender ID: `2596799742`
- App ID: `1:2596799742:web:582714ecd968e8cec591af`

---

## 🔥 IMMEDIATE ACTIONS REQUIRED

### 1. Revoke Firebase API Key (CRITICAL - Do This First!)

```bash
# Go to Firebase Console
https://console.firebase.google.com/project/bhumi-farming/settings/general

# Steps:
1. Click on "Project settings"
2. Go to "Service accounts" tab
3. Click "Manage service account permissions"
4. Delete or regenerate the API key
5. Create a new API key
```

### 2. Delete and Recreate Firebase Project (Recommended)

Since the credentials are public, the safest option is:

1. **Create New Firebase Project**
   - Go to https://console.firebase.google.com/
   - Create a new project with a different name
   - Set up Authentication, Firestore, Storage

2. **Update Your Local Config**
   - Copy new credentials to `.env.local`
   - Never commit `.env.local` to git

3. **Delete Old Project** (Optional but recommended)
   - Go to old project settings
   - Delete the `bhumi-farming` project

### 3. Clean Git History

The current repository has sanitized files, but old commits still contain secrets. You have two options:

#### Option A: Create Fresh Repository (Recommended)

```bash
# 1. Remove git history
rm -rf .git

# 2. Initialize fresh repo
git init
git add .
git commit -m "Initial commit - Clean version without secrets"

# 3. Force push to GitHub
git remote add origin https://github.com/dipayansardar73-decode/BHUMI_THE_FUTURE_OF_AGRITECH.git
git push -u origin main --force
```

#### Option B: Use BFG Repo-Cleaner

```bash
# 1. Install BFG
brew install bfg  # macOS
# or download from: https://rtyley.github.io/bfg-repo-cleaner/

# 2. Clone a fresh copy
cd ..
git clone --mirror https://github.com/dipayansardar73-decode/BHUMI_THE_FUTURE_OF_AGRITECH.git

# 3. Clean secrets
cd BHUMI_THE_FUTURE_OF_AGRITECH.git
bfg --replace-text ../remove-secrets.txt

# 4. Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push
git push --force
```

---

## 📋 Security Checklist

- [ ] Revoked Firebase API key
- [ ] Created new Firebase project (or regenerated keys)
- [ ] Updated local `.env.local` with new credentials
- [ ] Cleaned git history (Option A or B above)
- [ ] Force pushed clean history to GitHub
- [ ] Verified old commits are gone from GitHub
- [ ] Set up Firebase security rules
- [ ] Enable Firebase App Check
- [ ] Set up billing alerts

---

## 🔐 Prevention Measures

### 1. Update .gitignore (Already Done)
```
.env
.env.local
.env.*.local
```

### 2. Use Git Hooks

Create `.git/hooks/pre-commit`:
```bash
#!/bin/bash
if git diff --cached | grep -E "AIza|firebase.*apiKey"; then
    echo "❌ Potential API key detected! Commit blocked."
    exit 1
fi
```

### 3. Use GitHub Secret Scanning

GitHub will automatically scan for exposed secrets. Check:
https://github.com/dipayansardar73-decode/BHUMI_THE_FUTURE_OF_AGRITECH/security

---

## 📞 Need Help?

If you need assistance:
1. Firebase Support: https://firebase.google.com/support
2. GitHub Security: https://docs.github.com/en/code-security
3. Git History Cleanup: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

---

## ⏰ Timeline

- **Immediate (Now)**: Revoke Firebase API key
- **Within 1 hour**: Create new Firebase project or regenerate keys
- **Within 24 hours**: Clean git history
- **Ongoing**: Monitor for unauthorized access

---

**Created**: March 4, 2026  
**Priority**: CRITICAL  
**Status**: ACTION REQUIRED

