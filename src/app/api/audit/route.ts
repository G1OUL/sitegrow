import { NextRequest, NextResponse } from 'next/server';
import { parseHtmlAndAnalyze } from '@/lib/auditEngine';
import { 
  validateAndResolveUrl, 
  secureFetchWithRedirectValidation,
  readResponseTextWithLimit 
} from '@/lib/ssrfProtection';
import { SAMPLE_AUDITS } from '@/lib/sampleData';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    const { url, scanDepth } = body || {};

    if (!url || typeof url !== 'string' || !url.trim()) {
      return NextResponse.json(
        { success: false, error: 'A valid website URL is required.' },
        { status: 400 }
      );
    }

    // Fast-path for verified sample demo domains
    const cleanLower = url.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
    const demoMatch = SAMPLE_AUDITS.find(s => s.cleanUrl.toLowerCase() === cleanLower);
    if (demoMatch) {
      // Simulate real latency ticker
      await new Promise(r => setTimeout(r, 600));
      return NextResponse.json({
        success: true,
        audit: {
          ...demoMatch,
          id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // SSRF Validation & DNS resolution check
    const validation = await validateAndResolveUrl(url);
    if (!validation.isValid || !validation.sanitizedUrl) {
      return NextResponse.json(
        { success: false, error: validation.error || 'Invalid or blocked URL.' },
        { status: 400 }
      );
    }

    // Execute secure fetch with redirect destination validation
    let fetchResult;
    try {
      fetchResult = await secureFetchWithRedirectValidation(validation.sanitizedUrl, {
        timeoutMs: 8000,
        maxRedirects: 4,
      });
    } catch (fetchErr: unknown) {
      const isAbort = (fetchErr as { name?: string })?.name === 'AbortError';
      const errMsg = fetchErr instanceof Error ? fetchErr.message : String(fetchErr);
      
      const userMessage = isAbort
        ? 'Website took longer than 8 seconds to respond. The server may be down or experiencing extreme load.'
        : errMsg.includes('blocked') || errMsg.includes('internal') || errMsg.includes('private')
        ? errMsg
        : `Could not reach ${validation.sanitizedUrl}. Please check domain spelling or verify the site is publicly accessible.`;

      return NextResponse.json(
        { 
          success: false, 
          error: userMessage, 
          details: errMsg 
        },
        { status: errMsg.includes('blocked') ? 400 : 502 }
      );
    }

    const { response, finalUrl, responseTimeMs } = fetchResult;
    const statusCode = response.status;

    // Check content-type
    const contentType = response.headers.get('content-type') || '';
    if (
      !contentType.includes('text/html') &&
      !contentType.includes('application/xhtml+xml') &&
      !contentType.includes('text/plain')
    ) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Target returned "${contentType}" instead of an HTML webpage. Please provide a link to a website.` 
        },
        { status: 415 }
      );
    }

    let html = '';
    try {
      html = await readResponseTextWithLimit(response, 2 * 1024 * 1024);
    } catch (readErr: unknown) {
      return NextResponse.json(
        {
          success: false,
          error: readErr instanceof Error ? readErr.message : 'Failed to read website response within payload limits.',
        },
        { status: 413 }
      );
    }

    // Extract headers for security analysis
    const headersRecord: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headersRecord[key.toLowerCase()] = value;
    });

    // Run deep HTML and conversion check analyzer
    const audit = parseHtmlAndAnalyze(html, finalUrl, responseTimeMs, statusCode, headersRecord);

    return NextResponse.json({
      success: true,
      audit,
    });
  } catch (error: unknown) {
    console.error('Audit API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'An unexpected internal error occurred while conducting the website audit.',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
