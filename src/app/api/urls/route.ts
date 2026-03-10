import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { urls, session as sessionTable, user as userTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

// Generate a random short code
function generateShortCode(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper to get session from request
async function getSessionFromRequest(request: NextRequest) {
  try {
    // Extract bearer token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid Authorization header found');
      return null;
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    if (!token || token.length < 10) {
      console.log('Invalid token length:', token?.length);
      return null;
    }
    
    console.log('Token extracted, length:', token.length);
    
    // Query session directly from database using the token
    const sessionResult = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.token, token))
      .limit(1);

    if (sessionResult.length === 0) {
      console.log('No session found for token');
      return null;
    }

    const session = sessionResult[0];

    // Check if session is expired
    if (session.expiresAt < new Date()) {
      console.log('Session expired');
      return null;
    }

    // Get user data
    const userResult = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, session.userId))
      .limit(1);

    if (userResult.length === 0) {
      console.log('No user found for session');
      return null;
    }

    console.log('Session retrieved successfully, userId:', session.userId);
    
    return {
      user: userResult[0],
      session: session
    };
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

// GET - Fetch all URLs for authenticated user
export async function GET(request: NextRequest) {
  try {
    const sessionData = await getSessionFromRequest(request);

    if (!sessionData?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // Validate userId is a string
    if (typeof userId !== 'string' || !userId) {
      console.error('GET /api/urls - Invalid userId type:', typeof userId, userId);
      return NextResponse.json(
        { error: 'Invalid user session', code: 'INVALID_SESSION' },
        { status: 401 }
      );
    }

    const userUrls = await db
      .select()
      .from(urls)
      .where(eq(urls.userId, userId));

    return NextResponse.json({ urls: userUrls });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

// POST - Create a new short URL
export async function POST(request: NextRequest) {
  try {
    const sessionData = await getSessionFromRequest(request);

    console.log('POST /api/urls - Session data:', sessionData ? 'Valid' : 'Invalid');

    if (!sessionData?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in again.', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // Validate userId is a string
    if (typeof userId !== 'string' || !userId) {
      console.error('POST /api/urls - Invalid userId type:', typeof userId, userId);
      return NextResponse.json(
        { error: 'Invalid user session. Please sign out and sign in again.', code: 'INVALID_SESSION' },
        { status: 401 }
      );
    }

    console.log('POST /api/urls - Valid userId:', userId, 'Type:', typeof userId);

    const body = await request.json();
    const { originalUrl } = body;

    // Validate required fields
    if (!originalUrl) {
      return NextResponse.json(
        { error: 'Original URL is required', code: 'MISSING_REQUIRED_FIELDS' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(originalUrl);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format', code: 'INVALID_URL' },
        { status: 400 }
      );
    }

    // Generate unique short code
    let shortCode = generateShortCode();
    let existing = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1);
    
    while (existing.length > 0) {
      shortCode = generateShortCode();
      existing = await db.select().from(urls).where(eq(urls.shortCode, shortCode)).limit(1);
    }

    const now = new Date().toISOString();
    
    console.log('POST /api/urls - About to insert with userId:', userId, 'Type:', typeof userId);
    
    const newUrl = await db
      .insert(urls)
      .values({
        userId: userId,
        originalUrl: originalUrl.trim(),
        shortCode,
        clicks: 0,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    console.log('POST /api/urls - Successfully created URL with ID:', newUrl[0].id);
    return NextResponse.json({ url: newUrl[0] }, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

// DELETE - Delete a URL by ID
export async function DELETE(request: NextRequest) {
  try {
    const sessionData = await getSessionFromRequest(request);

    if (!sessionData?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required', code: 'UNAUTHORIZED' },
        { status: 401 }
      );
    }

    const userId = sessionData.user.id;

    // Validate userId is a string
    if (typeof userId !== 'string' || !userId) {
      console.error('DELETE /api/urls - Invalid userId type:', typeof userId, userId);
      return NextResponse.json(
        { error: 'Invalid user session', code: 'INVALID_SESSION' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid URL ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check ownership before deleting
    const urlRecord = await db
      .select()
      .from(urls)
      .where(and(eq(urls.id, parseInt(id)), eq(urls.userId, userId)))
      .limit(1);

    if (urlRecord.length === 0) {
      return NextResponse.json(
        { error: 'URL not found or access denied', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    await db.delete(urls).where(eq(urls.id, parseInt(id)));

    return NextResponse.json({ 
      message: 'URL deleted successfully',
      deletedUrl: urlRecord[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}