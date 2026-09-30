import { NextResponse, type NextRequest } from "next/server";

// The site only ever serves pages (GET/HEAD) and receives the contact form's Server Action (POST).
const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST"]);

/** Host the visitor asked for: through the Cloudflare Tunnel that's the public domain. */
function requestHost(request: NextRequest): string | null {
  return request.headers.get("x-forwarded-host") ?? request.headers.get("host");
}

/**
 * Next.js already rejects a Server Action whose Origin names another site, but it lets a POST
 * with no Origin at all through with a warning. Browsers always send Origin on a form POST, so
 * anything without a matching one is refused here, before it reaches the action.
 */
function isSameOriginPost(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = requestHost(request);
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  if (!ALLOWED_METHODS.has(request.method)) {
    return new NextResponse(null, { status: 405, headers: { Allow: "GET, HEAD, POST" } });
  }
  if (request.method === "POST" && !isSameOriginPost(request)) {
    return new NextResponse("Cross-origin request refused", { status: 403 });
  }

  // Prefetches fetch route data, not a document, so they need no CSP. They are skipped here in
  // code rather than in the matcher, so a request can't dodge the checks above by claiming to be one.
  if (request.headers.has("next-router-prefetch") || request.headers.get("purpose") === "prefetch") {
    return NextResponse.next();
  }

  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const isDev = process.env.NODE_ENV === "development";

  // style-src-attr allows inline style *attributes* only (next/image always emits one);
  // <style> elements still require the nonce, and attributes cannot execute script.
  const csp = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""};
    script-src-attr 'none';
    style-src 'self' ${isDev ? "'unsafe-inline'" : `'nonce-${nonce}'`};
    style-src-attr 'unsafe-inline';
    img-src 'self' data: blob:;
    media-src 'self';
    font-src 'self';
    frame-src https://www.youtube-nocookie.com;
    connect-src 'self';
    worker-src 'self';
    manifest-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
