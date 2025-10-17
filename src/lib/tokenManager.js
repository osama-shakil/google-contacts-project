// lib/tokenManager.js
import connectDB from './mongodb.js';
import Token from '../models/Token.js';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * Get valid access token from database, refresh if needed
 */
export async function getValidAccessToken(userId = 'default_user') {
  try {


    await connectDB();
    
    // Find token for user
    let tokenDoc = await Token.findOne({ userId });
      console.log(tokenDoc);
    if (!tokenDoc) {
      throw new Error('No tokens found. Please authenticate first.');
    }
    
    // Check if token is expired (with 5 minute buffer)
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (tokenDoc.expiryDate.getTime() - now.getTime() < bufferTime) {
      console.log('Token expired, refreshing automatically...');
      try {
        tokenDoc = await refreshAccessToken(tokenDoc);
      } catch (refreshError) {
        console.error('Auto-refresh failed:', refreshError);
        // If refresh fails, try to create new tokens using stored refresh token
        if (tokenDoc.refreshToken) {
          console.log('Attempting to create new tokens from stored refresh token...');
          tokenDoc = await createNewTokensFromRefresh(tokenDoc.refreshToken, userId);
        } else {
          throw new Error('Token refresh failed and no refresh token available. Please re-authenticate.');
        }
      }
    }
    
    return tokenDoc.accessToken;
  } catch (error) {
    console.error('Error getting valid access token:', error);
    throw error;
  }
}

/**
 * Refresh access token using refresh token
 */
export async function refreshAccessToken(tokenDoc) {
  try {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: tokenDoc.refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Token refresh failed: ${error.error_description || error.error}`);
    }

    const tokens = await response.json();
    
    // Update token document
    tokenDoc.accessToken = tokens.access_token;
    tokenDoc.expiryDate = new Date(Date.now() + (tokens.expires_in * 1000));
    tokenDoc.tokenType = tokens.token_type || 'Bearer';
    
    await tokenDoc.save();
    
    console.log('Token refreshed successfully');
    return tokenDoc;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

/**
 * Create new tokens from a refresh token (fallback method)
 */
export async function createNewTokensFromRefresh(refreshToken, userId) {
  try {
    console.log('Creating new tokens from refresh token...');
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create new tokens: ${error.error_description || error.error}`);
    }

    const tokens = await response.json();
    
    // Store the new tokens
    const tokenDoc = await storeTokens(userId, {
      ...tokens,
      refresh_token: refreshToken // Keep the original refresh token
    });
    
    console.log('New tokens created successfully from refresh token');
    return tokenDoc;
  } catch (error) {
    console.error('Error creating new tokens from refresh token:', error);
    throw error;
  }
}

/**
 * Store tokens in database
 */
export async function storeTokens(userId, tokens) {
  try {
    await connectDB();
    
    const expiryDate = new Date(Date.now() + (tokens.expires_in * 1000));
    
    const tokenData = {
      userId,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiryDate,
      scope: tokens.scope,
      tokenType: tokens.token_type || 'Bearer'
    };
    
    // Upsert (update if exists, create if not)
    const tokenDoc = await Token.findOneAndUpdate(
      { userId },
      tokenData,
      { upsert: true, new: true }
    );
    
    console.log('Tokens stored successfully for user:', userId);
    return tokenDoc;
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
}

/**
 * Check if user has valid tokens (including refresh tokens)
 */
export async function hasValidTokens(userId = 'default') {
  try {
    await connectDB();
    
    const tokenDoc = await Token.findOne({ userId });
    
    if (!tokenDoc) {
      return false;
    }
    
    // If we have a refresh token, we can always get a new access token
    if (tokenDoc.refreshToken) {
      return true;
    }
    
    // Check if access token is still valid (with 5 minute buffer)
    const now = new Date();
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return tokenDoc.expiryDate.getTime() - now.getTime() > bufferTime;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
}

/**
 * Delete tokens for user
 */
export async function deleteTokens(userId = 'default') {
  try {
    await connectDB();
    
    await Token.deleteOne({ userId });
    console.log('Tokens deleted for user:', userId);
  } catch (error) {
    console.error('Error deleting tokens:', error);
    throw error;
  }
}
