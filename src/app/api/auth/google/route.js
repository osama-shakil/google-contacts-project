// app/api/auth/google/route.js
import { NextResponse } from 'next/server';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/google/callback';

export async function GET() {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json({ 
      error: 'Google Client ID not configured' 
    }, { status: 500 });
  }

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${GOOGLE_CLIENT_ID}&` +
    `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
    `response_type=code&` +
    `scope=${encodeURIComponent('https://www.googleapis.com/auth/contacts')}&` +
    `access_type=offline&` +
    `prompt=consent`;

  return NextResponse.json({ authUrl });
}
