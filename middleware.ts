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
  const isMainDomain = hostname.includes('beautipick.com') && !hostname.includes('www.');
  const isCustomDomain =
    !hostname.includes('localhost') &&
    !hostname.includes('.vercel.app') &&
    hostname.includes('.');

  // Skip custom domain routing for main domain root paths
  const skipRouting = isMainDomain && (
    pathname === '/' ||
    pathname.startsWith('/blog') ||
    pathname.startsWith('/admin')
  );

  if (skipRouting) {
    return await updateSession(request);
  }

  if (isCustomDomain) {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return new NextResponse('Missing configuration', { status: 500 });
    }

    // Query database using fetch API (edge-compatible)
    const apiUrl = `${supabaseUrl}/rest/v1/merchants?custom_domain=eq.${hostname}&is_active=eq.true&select=slug&limit=1`;

    const response = await fetch(apiUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      const merchant = data && data.length > 0 ? data[0] : null;

      if (merchant) {
        // Rewrite to merchant page
        const url = request.nextUrl.clone();
        url.pathname = `/${merchant.slug}${pathname}`;
        return NextResponse.rewrite(url);
      }
    }

    // Try without www
    const hostnameWithoutWww = hostname.replace('www.', '');
    if (hostnameWithoutWww !== hostname) {
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

        if (merchantAlt) {
          const url = request.nextUrl.clone();
          url.pathname = `/${merchantAlt.slug}${pathname}`;
          return NextResponse.rewrite(url);
        }
      }
    }

    // If custom domain not found, fall through to normal routing
    // This allows beautipick.com/sky-spa to work even if not in database
    console.log(`Custom domain not found for ${hostname}, falling through to normal routing`);
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
