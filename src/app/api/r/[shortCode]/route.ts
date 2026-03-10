import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { urls } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET - Public redirect endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    if (!shortCode) {
      // Return HTML error page instead of JSON
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Invalid Short URL</title>
            <style>
              body { font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb); }
              .error { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 500px; }
              h1 { color: #dc2626; margin: 0 0 1rem; }
              p { color: #6b7280; margin: 0; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>❌ Invalid Short URL</h1>
              <p>The short code provided is not valid.</p>
            </div>
          </body>
        </html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Find URL by short code
    const urlRecord = await db
      .select()
      .from(urls)
      .where(eq(urls.shortCode, shortCode))
      .limit(1);

    if (urlRecord.length === 0) {
      // Return HTML error page instead of JSON
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Short URL Not Found</title>
            <style>
              body { font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb); }
              .error { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 500px; }
              h1 { color: #dc2626; margin: 0 0 1rem; font-size: 2rem; }
              p { color: #6b7280; margin: 0 0 0.5rem; line-height: 1.6; }
              code { background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.875rem; }
              a { color: #7c3aed; text-decoration: none; font-weight: 500; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>🔍 Short URL Not Found</h1>
              <p>The short URL <code>${shortCode}</code> doesn't exist or may have been deleted.</p>
              <p style="margin-top: 1.5rem;"><a href="/">← Go to Homepage</a></p>
            </div>
          </body>
        </html>`,
        { status: 404, headers: { 'Content-Type': 'text/html' } }
      );
    }

    const originalUrl = urlRecord[0].originalUrl;
    
    // Validate the original URL before redirecting
    try {
      new URL(originalUrl); // This will throw if URL is invalid
    } catch (e) {
      return new NextResponse(
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Invalid Destination URL</title>
            <style>
              body { font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb); }
              .error { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 500px; }
              h1 { color: #dc2626; margin: 0 0 1rem; }
              p { color: #6b7280; margin: 0; line-height: 1.6; }
              a { color: #7c3aed; text-decoration: none; font-weight: 500; }
              a:hover { text-decoration: underline; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>⚠️ Invalid Destination URL</h1>
              <p>The original URL for this short link is invalid or malformed.</p>
              <p style="margin-top: 1.5rem;"><a href="/">← Go to Homepage</a></p>
            </div>
          </body>
        </html>`,
        { status: 400, headers: { 'Content-Type': 'text/html' } }
      );
    }

    // Increment click count asynchronously (don't wait for it)
    db.update(urls)
      .set({
        clicks: urlRecord[0].clicks + 1,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(urls.id, urlRecord[0].id))
      .then(() => {})
      .catch((err) => console.error('Failed to update click count:', err));

    // Redirect to original URL immediately
    return NextResponse.redirect(originalUrl, 301);
  } catch (error) {
    console.error('Redirect error:', error);
    return new NextResponse(
      `<!DOCTYPE html>
      <html>
        <head>
          <title>Redirect Error</title>
          <style>
            body { font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: linear-gradient(to bottom right, #f3f4f6, #e5e7eb); }
            .error { text-align: center; padding: 2rem; background: white; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.1); max-width: 500px; }
            h1 { color: #dc2626; margin: 0 0 1rem; }
            p { color: #6b7280; margin: 0; line-height: 1.6; }
            a { color: #7c3aed; text-decoration: none; font-weight: 500; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="error">
            <h1>🚨 Redirect Error</h1>
            <p>An unexpected error occurred while processing your request.</p>
            <p style="margin-top: 1.5rem;"><a href="/">← Go to Homepage</a></p>
          </div>
        </body>
      </html>`,
      { status: 500, headers: { 'Content-Type': 'text/html' } }
    );
  }
}