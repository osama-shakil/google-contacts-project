# Google Contacts Integration Setup with MongoDB

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
# Google OAuth Configuration
# Get these from Google Cloud Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# MongoDB Configuration - Local Connection
MONGODB_URI=mongodb://localhost:27017/google-contacts

# Firebase Configuration (if using Firebase)
NEXT_PUBLIC_APIKEY=your_firebase_api_key
NEXT_PUBLIC_AUTHDOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_PROJECTID=your_project_id
NEXT_PUBLIC_STORAGEBUCKET=your_project.appspot.com
NEXT_PUBLIC_MESSAGINGSENDERID=your_sender_id
NEXT_PUBLIC_APPID=your_app_id
NEXT_PUBLIC_MEASUREMENTID=your_measurement_id
```

## MongoDB Setup (Local)

✅ **MongoDB is already installed and running locally!**

Your local MongoDB is running on the default port (27017). The connection string is:
```
MONGODB_URI=mongodb://localhost:27017/google-contacts
```

**Note:** If you want to use MongoDB Atlas (cloud) instead, replace the MONGODB_URI with your Atlas connection string.

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google People API
4. Go to "Credentials" and create OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `http://localhost:3000/api/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env.local` file

## How to Fix the "Failed to add contact" Error

The error occurs because:

1. **Missing Google OAuth credentials** - You need to set up the environment variables above
2. **Missing MongoDB connection** - You need to set up MongoDB Atlas
3. **No authentication** - The app needs to authenticate with Google first
4. **Missing dependencies** - All packages have been installed

## Persistent Authentication Features

✅ **No more repeated authentication** - Tokens are stored in MongoDB
✅ **Automatic token refresh** - Expired tokens are automatically refreshed
✅ **User session management** - Each user has their own authentication
✅ **Secure token storage** - Tokens are encrypted and stored securely

## Next Steps

1. Set up MongoDB Atlas and get your connection string
2. Set up your Google Cloud Console project
3. Add all environment variables to `.env.local`
4. Restart your development server
5. Try adding a contact - authentication will persist across sessions!
