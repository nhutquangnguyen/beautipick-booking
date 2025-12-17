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

  // Check user profiles for route protection
  // Allow users with both merchant and customer accounts to access both areas
  if (user && (request.nextUrl.pathname.startsWith("/business/dashboard") || request.nextUrl.pathname.startsWith("/customer"))) {
    // Check if user has merchant profile
    const { data: merchantProfile } = await supabase
      .from("merchants")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    // Check if user has customer profile
    const { data: customerProfile } = await supabase
      .from("customer_accounts")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    // Block access to business dashboard if user has NO merchant profile
    if (request.nextUrl.pathname.startsWith("/business/dashboard") && !merchantProfile) {
      const url = request.nextUrl.clone();
      // If they have a customer profile, redirect to customer dashboard
      // Otherwise redirect to business login
      url.pathname = customerProfile ? "/customer" : "/business/login";
      return NextResponse.redirect(url);
    }

    // Block access to customer dashboard if user has NO customer profile
    if (request.nextUrl.pathname.startsWith("/customer") && !customerProfile) {
      const url = request.nextUrl.clone();
      // If they have a merchant profile, redirect to business dashboard
      // Otherwise redirect to home
      url.pathname = merchantProfile ? "/business/dashboard" : "/";
      return NextResponse.redirect(url);
    }
  }

  // Redirect logged-in users away from auth pages
  if (
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/signup") &&
    user
  ) {
    // Check what profiles the user has to redirect appropriately
    const { data: merchantProfile } = await supabase
      .from("merchants")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    const { data: customerProfile } = await supabase
      .from("customer_accounts")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    const url = request.nextUrl.clone();
    // If user has customer profile (with or without merchant), redirect to home
    // If user only has merchant profile, redirect to business dashboard
    if (customerProfile) {
      url.pathname = "/";
    } else if (merchantProfile) {
      url.pathname = "/business/dashboard";
    } else {
      // No profile found, allow them to continue to signup/login
      return supabaseResponse;
    }
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
