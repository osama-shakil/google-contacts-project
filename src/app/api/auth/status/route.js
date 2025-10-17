// app/api/auth/status/route.js
import { hasValidTokens } from '@/lib/tokenManager';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const isAuthenticated = await hasValidTokens('default');
    
    return NextResponse.json({ 
      authenticated: isAuthenticated 
    });
  } catch (error) {
    console.error('Error checking auth status:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: error.message 
    });
  }
}
