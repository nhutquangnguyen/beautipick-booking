import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // Skip middleware for these paths
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/customer') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.includes('.') // static files
  ) {
    return await updateSession(request);
  }

  // Check if this is a custom domain or a slug path on main domain
  const isMainDomain = hostname.includes('beautipick.com') || hostname.includes('localhost') || hostname.includes('.vercel.app');
  const isCustomDomain = !isMainDomain && hostname.includes('.');

  // Skip custom domain routing for main domain paths
  if (isMainDomain) {
    return await updateSession(request);
  }

  if (isCustomDomain) {
    console.log(`[Custom Domain] Processing request for hostname: ${hostname}, pathname: ${pathname}`);

    // Get environment variables - use service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[Custom Domain] Missing Supabase configuration');
      return new NextResponse('Missing configuration', { status: 500 });
    }

    // Query database using fetch API (edge-compatible)
    const apiUrl = `${supabaseUrl}/rest/v1/merchants?custom_domain=eq.${hostname}&is_active=eq.true&select=slug&limit=1`;
    console.log(`[Custom Domain] Query URL: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const merchant = data && data.length > 0 ? data[0] : null;
      console.log(`[Custom Domain] Query result for ${hostname}:`, merchant ? `Found merchant: ${merchant.slug}` : 'No merchant found');

      if (merchant) {
        // Rewrite to merchant page
        const url = request.nextUrl.clone();
        url.pathname = `/${merchant.slug}${pathname}`;
        console.log(`[Custom Domain] Rewriting ${hostname}${pathname} to ${url.pathname}`);
        return NextResponse.rewrite(url);
      } else {
        console.log(`[Custom Domain] No merchant found for ${hostname}, trying without www...`);
      }
    } else {
      console.error(`[Custom Domain] Supabase query failed for ${hostname}:`, response.status, await response.text());
    }

    // Try without www
    const hostnameWithoutWww = hostname.replace('www.', '');
    if (hostnameWithoutWww !== hostname) {
      console.log(`[Custom Domain] Trying without www: ${hostnameWithoutWww}`);
      const apiUrlAlt = `${supabaseUrl}/rest/v1/merchants?custom_domain=eq.${hostnameWithoutWww}&is_active=eq.true&select=slug&limit=1`;

      const responseAlt = await fetch(apiUrlAlt, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
      });

      if (responseAlt.ok) {
        const dataAlt = await responseAlt.json();
        const merchantAlt = dataAlt && dataAlt.length > 0 ? dataAlt[0] : null;
        console.log(`[Custom Domain] Query result for ${hostnameWithoutWww}:`, merchantAlt ? `Found merchant: ${merchantAlt.slug}` : 'No merchant found');

        if (merchantAlt) {
          const url = request.nextUrl.clone();
          url.pathname = `/${merchantAlt.slug}${pathname}`;
          console.log(`[Custom Domain] Rewriting ${hostname}${pathname} to ${url.pathname}`);
          return NextResponse.rewrite(url);
        }
      } else {
        console.error(`[Custom Domain] Supabase query failed for ${hostnameWithoutWww}:`, responseAlt.status, await responseAlt.text());
      }
    }

    // If custom domain not found, return 404
    console.log(`[Custom Domain] No merchant found for ${hostname}, returning 404`);
    return new NextResponse('Custom domain not found', { status: 404 });
  }

  // Default domain - update session
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
