import dns from 'dns';
import net from 'net';
import { formatUrl } from './utils';

/**
 * Checks if an IPv4 or IPv6 address belongs to private, loopback,
 * link-local, carrier-grade NAT, or reserved internal ranges.
 */
export function isPrivateIp(ip: string): boolean {
  // Normalize IPv4-mapped IPv6 (e.g. ::ffff:127.0.0.1)
  let cleanIp = ip.trim();
  if (cleanIp.startsWith('::ffff:')) {
    cleanIp = cleanIp.substring(7);
  }

  const family = net.isIP(cleanIp);
  if (family === 0) {
    // Not a valid IP address
    return true;
  }

  if (family === 4) {
    const parts = cleanIp.split('.').map(part => parseInt(part, 10));
    const [p0, p1, p2, p3] = parts;
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
      return true;
    }

    // 0.0.0.0/8 (Current network)
    if (p0 === 0) return true;

    // 10.0.0.0/8 (Private)
    if (p0 === 10) return true;

    // 100.64.0.0/10 (Shared Address Space / Carrier-Grade NAT)
    if (p0 === 100 && (p1 !== undefined && p1 >= 64 && p1 <= 127)) return true;

    // 127.0.0.0/8 (Loopback)
    if (p0 === 127) return true;

    // 169.254.0.0/16 (Link Local / Cloud Metadata 169.254.169.254)
    if (p0 === 169 && p1 === 254) return true;

    // 172.16.0.0/12 (Private)
    if (p0 === 172 && (p1 !== undefined && p1 >= 16 && p1 <= 31)) return true;

    // 192.0.0.0/24 (IETF Protocol Assignments)
    if (p0 === 192 && p1 === 0 && p2 === 0) return true;

    // 192.0.2.0/24 (TEST-NET-1)
    if (p0 === 192 && p1 === 0 && p2 === 2) return true;

    // 192.168.0.0/16 (Private)
    if (p0 === 192 && p1 === 168) return true;

    // 198.18.0.0/15 (Benchmarking)
    if (p0 === 198 && (p1 !== undefined && (p1 === 18 || p1 === 19))) return true;

    // 198.51.100.0/24 (TEST-NET-2)
    if (p0 === 198 && p1 === 51 && p2 === 100) return true;

    // 203.0.113.0/24 (TEST-NET-3)
    if (p0 === 203 && p1 === 0 && p2 === 113) return true;

    // 224.0.0.0/4 (Multicast)
    if (p0 !== undefined && p0 >= 224 && p0 <= 239) return true;

    // 240.0.0.0/4 (Reserved for Future Use)
    if (p0 !== undefined && p0 >= 240) return true;

    // 255.255.255.255 (Broadcast)
    if (p0 === 255 && p1 === 255 && p2 === 255 && p3 === 255) return true;

    return false;
  }

  if (family === 6) {
    const lower = cleanIp.toLowerCase();

    // Loopback ::1
    if (lower === '::1' || lower === '0:0:0:0:0:0:0:1') return true;

    // Unspecified ::
    if (lower === '::' || lower === '0:0:0:0:0:0:0:0') return true;

    // Unique Local fc00::/7 (fc00:: - fdff::)
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;

    // Link-local unicast fe80::/10 (fe80:: - febf::)
    if (
      lower.startsWith('fe8') ||
      lower.startsWith('fe9') ||
      lower.startsWith('fea') ||
      lower.startsWith('feb')
    ) {
      return true;
    }

    // Multicast ff00::/8
    if (lower.startsWith('ff')) return true;

    return false;
  }

  return true;
}

/**
 * Validates a target URL structure, protocol, and resolves DNS to verify
 * all associated IP addresses are strictly public.
 */
export async function validateAndResolveUrl(rawUrl: string): Promise<{
  isValid: boolean;
  sanitizedUrl?: string;
  hostname?: string;
  error?: string;
}> {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, error: 'Website URL cannot be empty.' };
  }

  const cleaned = formatUrl(rawUrl.trim());

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format. Please enter a valid website address (e.g. example.com).',
    };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return {
      isValid: false,
      error: 'Only HTTP and HTTPS protocols are supported.',
    };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Hostname string checks
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    hostname === '[::1]' ||
    hostname === '169.254.169.254' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.test') ||
    hostname.endsWith('.localhost')
  ) {
    return {
      isValid: false,
      error: 'Private, internal, or loopback network addresses are blocked for security.',
    };
  }

  // If hostname is directly an IP address
  if (net.isIP(hostname)) {
    if (isPrivateIp(hostname)) {
      return {
        isValid: false,
        error: 'Private or internal IP addresses are blocked for security.',
      };
    }
  } else {
    // Perform live DNS lookup to prevent DNS Rebinding to internal networks
    try {
      const records = await dns.promises.lookup(hostname, { all: true });
      if (!records || records.length === 0) {
        return {
          isValid: false,
          error: `Could not resolve domain "${hostname}". Please check spelling.`,
        };
      }

      for (const rec of records) {
        if (isPrivateIp(rec.address)) {
          return {
            isValid: false,
            error: `Domain "${hostname}" resolves to a blocked internal or private IP address (${rec.address}).`,
          };
        }
      }
    } catch (dnsErr: unknown) {
      return {
        isValid: false,
        error: `DNS resolution failed for "${hostname}". Domain may not exist.`,
      };
    }
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
    hostname,
  };
}

/**
 * Performs a secure HTTP request with explicit redirect validation.
 * Redirects are inspected so an external site cannot pivot the crawler
 * to an internal network (SSRF via HTTP 301/302).
 */
export async function secureFetchWithRedirectValidation(
  initialUrl: string,
  options: {
    timeoutMs?: number;
    maxRedirects?: number;
    userAgent?: string;
  } = {}
): Promise<{
  response: Response;
  finalUrl: string;
  responseTimeMs: number;
  redirectCount: number;
}> {
  const timeoutMs = options.timeoutMs ?? 8000;
  const maxRedirects = options.maxRedirects ?? 4;
  const userAgent =
    options.userAgent ??
    'Mozilla/5.0 (compatible; SiteGrowBot/1.0; +https://sitegrow.app)';

  let currentUrl = initialUrl;
  let redirectCount = 0;
  const startTime = Date.now();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    while (true) {
      // Validate current hop against SSRF & DNS Rebinding
      const validation = await validateAndResolveUrl(currentUrl);
      if (!validation.isValid || !validation.sanitizedUrl) {
        throw new Error(validation.error || 'Blocked invalid or unsafe URL in fetch chain.');
      }

      const hopResponse = await fetch(validation.sanitizedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
          'Accept':
            'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
        redirect: 'manual', // Enforce manual inspection of redirects!
      });

      // Check if redirect
      if ([301, 302, 303, 307, 308].includes(hopResponse.status)) {
        const locationHeader = hopResponse.headers.get('location');
        if (!locationHeader) {
          // No location header provided, stop here
          return {
            response: hopResponse,
            finalUrl: currentUrl,
            responseTimeMs: Date.now() - startTime,
            redirectCount,
          };
        }

        redirectCount++;
        if (redirectCount > maxRedirects) {
          throw new Error(`Exceeded maximum allowed redirects (${maxRedirects}).`);
        }

        // Resolve next target URL relative to current hop
        const nextTarget = new URL(locationHeader, currentUrl).toString();

        // Continue to next hop in loop
        currentUrl = nextTarget;
        continue;
      }

      // Normal response (200, 404, etc.)
      const totalTimeMs = Date.now() - startTime;
      return {
        response: hopResponse,
        finalUrl: currentUrl,
        responseTimeMs: totalTimeMs,
        redirectCount,
      };
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Safely reads response body text while enforcing a hard limit on total bytes.
 * Prevents memory exhaustion from large downloads, streaming responses, or gzip bombs.
 */
export async function readResponseTextWithLimit(
  response: Response,
  maxBytes: number = 2 * 1024 * 1024 // 2MB default limit
): Promise<string> {
  const contentLengthHeader = response.headers.get('content-length');
  if (contentLengthHeader) {
    const declaredSize = parseInt(contentLengthHeader, 10);
    if (!isNaN(declaredSize) && declaredSize > maxBytes) {
      throw new Error(
        `Target document size (${Math.round(declaredSize / 1024)} KB) exceeds safety limit of ${Math.round(maxBytes / 1024)} KB.`
      );
    }
  }

  if (!response.body) {
    const text = await response.text();
    if (new Blob([text]).size > maxBytes) {
      throw new Error(`Target document payload exceeds safety limit of ${Math.round(maxBytes / 1024)} KB.`);
    }
    return text;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        totalBytes += value.length;
        if (totalBytes > maxBytes) {
          await reader.cancel();
          throw new Error(
            `Target document payload exceeds safety limit of ${Math.round(maxBytes / 1024)} KB.`
          );
        }
        chunks.push(value);
      }
    }
  } catch (err) {
    try {
      await reader.cancel();
    } catch {}
    throw err;
  }

  const decoder = new TextDecoder('utf-8');
  return chunks.map(c => decoder.decode(c, { stream: true })).join('') + decoder.decode();
}

