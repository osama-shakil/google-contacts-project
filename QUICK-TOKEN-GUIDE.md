# Quick Token Guide - Get Google OAuth Tokens in 5 Minutes

## 🚀 Fastest Method: OAuth 2.0 Playground

### Step 1: Get Your Google Credentials
1. Go to: https://console.cloud.google.com/
2. Create/select a project
3. Enable "Google People API"
4. Go to "Credentials" → "Create OAuth 2.0 Client ID"
5. Set type: "Web application"
6. Add redirect URI: `http://localhost:3001`
7. **Copy your Client ID and Client Secret**

### Step 2: Get Tokens
1. Go to: https://developers.google.com/oauthplayground/
2. Click the **gear icon (⚙️)** in top right
3. Check **"Use your own OAuth credentials"**
4. Enter your Client ID and Client Secret
5. In the left panel, find: `https://www.googleapis.com/auth/contacts`
6. Click **"Authorize APIs"**
7. Sign in with Google
8. Click **"Exchange authorization code for tokens"**
9. **Copy these two values**:
   - `access_token` (starts with `ya29.`)
   - `refresh_token` (starts with `1//`)

### Step 3: Add to Your App
1. Open: http://localhost:3001
2. Use the **Token Manager** on the right
3. Paste your tokens
4. Click **"Add Tokens to Database"**
5. **Done!** Start adding contacts

---

## 🔧 Alternative: Direct Browser Method

If you prefer to do it manually:

### Step 1: Get Authorization Code
Replace `YOUR_CLIENT_ID` with your actual Client ID and open this URL:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3001&response_type=code&scope=https://www.googleapis.com/auth/contacts&access_type=offline&prompt=consent
```

### Step 2: Exchange Code for Tokens
Use this cURL command (replace the values):

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE_FROM_URL" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=http://localhost:3001"
```

---

## 📋 What You'll Get:

```json
{
  "access_token": "ya29.a0AfH6SMC...",
  "expires_in": 3599,
  "refresh_token": "1//04...",
  "scope": "https://www.googleapis.com/auth/contacts",
  "token_type": "Bearer"
}
```

**Copy these values to your Token Manager:**
- ✅ `access_token` → Access Token field
- ✅ `refresh_token` → Refresh Token field
- ✅ `expires_in` → Calculate expiry date (optional)

---

## 🎯 That's It!

Once you add the tokens to your app:
- ✅ No more OAuth redirects
- ✅ Direct contact creation
- ✅ Automatic token refresh
- ✅ Persistent authentication

**Your app will work immediately after adding the tokens!**
