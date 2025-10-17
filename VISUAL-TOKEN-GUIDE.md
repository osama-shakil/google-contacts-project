# Visual Token Guide - Step by Step

## 📍 Step 1: Google Cloud Console Setup

```
1. Go to: https://console.cloud.google.com/
   ↓
2. Create/Select Project
   ↓
3. Enable APIs → Search "Google People API" → Enable
   ↓
4. Credentials → Create Credentials → OAuth 2.0 Client ID
   ↓
5. Application Type: Web application
   ↓
6. Authorized redirect URIs: http://localhost:3001
   ↓
7. Copy Client ID and Client Secret
```

## 🎯 Step 2: OAuth 2.0 Playground

```
1. Go to: https://developers.google.com/oauthplayground/
   ↓
2. Click ⚙️ (gear icon) → Check "Use your own OAuth credentials"
   ↓
3. Enter Client ID and Client Secret
   ↓
4. Left panel → Find "https://www.googleapis.com/auth/contacts"
   ↓
5. Click "Authorize APIs" → Sign in with Google
   ↓
6. Click "Exchange authorization code for tokens"
   ↓
7. Copy access_token and refresh_token
```

## 💾 Step 3: Add to Your App

```
1. Open: http://localhost:3001
   ↓
2. Right side → Token Manager
   ↓
3. Paste tokens:
   - Access Token: ya29.a0AfH6SMC...
   - Refresh Token: 1//04...
   ↓
4. Click "Add Tokens to Database"
   ↓
5. ✅ Ready to add contacts!
```

## 🔄 What Happens Next:

```
Contact Form → Check Tokens → Use Access Token → Create Contact in Google
     ↓              ↓              ↓                    ↓
   Submit      MongoDB Check    Google API Call    Success!
```

## 🚨 Common Issues & Solutions:

```
❌ "Invalid client" 
   → Check Client ID/Secret

❌ "Access blocked"
   → Enable Google People API

❌ "Invalid redirect URI"
   → Add http://localhost:3001 to authorized URIs

❌ "Scope not authorized"
   → Make sure you're using contacts scope
```

## 📱 Your App Layout:

```
┌─────────────────────────────────────────────────────────┐
│                Google Contacts Integration              │
├─────────────────────────┬───────────────────────────────┤
│                         │                               │
│     Contact Form        │      Token Manager            │
│                         │                               │
│  [Name]                 │  [Access Token]               │
│  [Email]                │  [Refresh Token]              │
│  [Phone]                │  [Expiry Date]                │
│  [Company]              │                               │
│                         │  [Add Tokens to Database]     │
│  [Add to Google]        │                               │
│                         │  Status: ✅ Connected         │
└─────────────────────────┴───────────────────────────────┘
```

## ⚡ Quick Test:

After adding tokens, try adding a contact:
- Name: Test User
- Email: test@example.com
- Click "Add to Google Contacts"
- Should work without any OAuth redirects!
