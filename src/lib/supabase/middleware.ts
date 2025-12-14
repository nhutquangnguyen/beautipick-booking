import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect dashboard routes (merchant) and customer routes
  if (
    (request.nextUrl.pathname.startsWith("/business/dashboard") ||
      request.nextUrl.pathname.startsWith("/customer")) &&
    !user
  ) {
    const url = request.nextUrl.clone();
    if (request.nextUrl.pathname.startsWith("/customer")) {
      url.pathname = "/";
    } else {
      url.pathname = "/business/login";
    }
    return NextResponse.redirect(url);
  }

  // Check user type for route protection
  if (user && (request.nextUrl.pathname.startsWith("/business/dashboard") || request.nextUrl.pathname.startsWith("/customer"))) {
    const { data: userType } = await supabase
      .from("user_types")
      .select("user_type")
      .eq("user_id", user.id)
      .maybeSingle();

    // If no user_type found, check if user is a merchant (has merchant profile)
    if (!userType) {
      const { data: merchantProfile } = await supabase
        .from("merchants")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      // Redirect based on what profile exists
      if (request.nextUrl.pathname.startsWith("/customer") && merchantProfile) {
        const url = request.nextUrl.clone();
        url.pathname = "/business/dashboard";
        return NextResponse.redirect(url);
      }
    } else {
      // Prevent customers from accessing merchant dashboard
      if (request.nextUrl.pathname.startsWith("/business/dashboard") && userType.user_type === "customer") {
        const url = request.nextUrl.clone();
        url.pathname = "/customer";
        return NextResponse.redirect(url);
      }

      // Prevent merchants from accessing customer dashboard
      if (request.nextUrl.pathname.startsWith("/customer") && userType.user_type === "merchant") {
        const url = request.nextUrl.clone();
        url.pathname = "/business/dashboard";
        return NextResponse.redirect(url);
      }
    }
  }

  // Redirect logged-in users away from auth pages
  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup") &&
    user
  ) {
    // Check user type to redirect appropriately
    const { data: userType } = await supabase
      .from("user_types")
      .select("user_type")
      .eq("user_id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    if (userType?.user_type === "customer") {
      url.pathname = "/customer";
    } else {
      url.pathname = "/business/dashboard";
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
