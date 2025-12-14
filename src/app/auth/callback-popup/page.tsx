"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * This page handles OAuth callbacks when opened in a popup window
 * It creates customer account, then closes the popup
 */
function CallbackPopupContent() {
  const [status, setStatus] = useState<string>("Processing...");
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    console.log('[Callback Popup] Page loaded, waiting for Supabase to handle OAuth callback...');
    setStatus("Signing you in...");

    // Supabase automatically handles OAuth callback when page loads with code in URL
    // We just need to listen for the auth state change
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Callback Popup] Auth state change:', event, { hasSession: !!session });

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('[Callback Popup] User signed in:', session.user.id);
        setStatus("Creating your account...");

        try {
          // Get customer data from query params or localStorage
          const userType = searchParams.get('type');
          const name = searchParams.get('name');
          const phone = searchParams.get('phone');
          const merchantId = searchParams.get('merchant_id');

          let customerName = name;
          let customerPhone = phone;
          let firstMerchantId = merchantId;

          // Try localStorage if not in params
          const pendingSignup = localStorage.getItem('pending_customer_signup');
          if (pendingSignup) {
            try {
              const data = JSON.parse(pendingSignup);
              customerName = customerName || data.name;
              customerPhone = customerPhone || data.phone;
              firstMerchantId = firstMerchantId || data.first_merchant_id;
            } catch (e) {
              console.error('[Callback Popup] Error parsing pending signup data:', e);
            }
          }

          console.log('[Callback Popup] Creating customer account with:', {
            userId: session.user.id,
            name: customerName,
            phone: customerPhone,
            type: userType
          });

          // Create customer account
          const response = await fetch('/api/customer-accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: session.user.id,
              email: session.user.email,
              name: customerName || session.user.user_metadata?.name || session.user.email?.split('@')[0],
              phone: customerPhone,
              firstMerchantId: firstMerchantId,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('[Callback Popup] Failed to create customer account:', errorData);
            setStatus("Error: Could not create account");
            return;
          }

          const result = await response.json();
          console.log('[Callback Popup] Customer account created successfully:', result);

          // Clean up
          localStorage.removeItem('pending_customer_signup');

          setStatus("Success! Closing...");

          // Close popup and notify parent
          if (window.opener && !window.opener.closed) {
            console.log('[Callback Popup] Notifying parent and closing popup...');
            window.opener.postMessage({ type: 'OAUTH_SUCCESS' }, window.location.origin);

            setTimeout(() => {
              window.close();
            }, 500);
          } else {
            // Not a popup, redirect
            console.log('[Callback Popup] Not a popup, redirecting...');
            window.location.href = '/account/appointments';
          }
        } catch (error) {
          console.error('[Callback Popup] Account creation error:', error);
          setStatus("Error creating account");
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">{status}</p>
      </div>
    </div>
  );
}

export default function CallbackPopupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CallbackPopupContent />
    </Suspense>
  );
}
