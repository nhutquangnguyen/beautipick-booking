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

    let processed = false; // Prevent double processing

    // Function to close popup successfully
    const closePopupSuccess = () => {
      if (processed) return;
      processed = true;
      setStatus("Success! Closing...");

      if (window.opener && !window.opener.closed) {
        console.log('[Callback Popup] Closing popup and notifying parent');
        window.opener.postMessage({ type: 'OAUTH_SUCCESS' }, window.location.origin);
        setTimeout(() => window.close(), 500);
      } else {
        console.log('[Callback Popup] No opener, redirecting...');
        const userType = searchParams.get('type');
        const redirectUrl = userType === 'merchant' ? '/business/dashboard' : '/';
        window.location.href = redirectUrl;
      }
    };

    // Check if session already exists (for faster resolution)
    const checkExistingSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('[Callback Popup] Session already exists, closing immediately');
          closePopupSuccess();
        }
      } catch (error) {
        console.error('[Callback Popup] Error checking existing session:', error);
      }
    };

    // Check immediately after a small delay to let Supabase finish processing
    setTimeout(checkExistingSession, 1000);

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[Callback Popup] Auth state change:', event, { hasSession: !!session, processed });

      // Process only once and only on SIGNED_IN event
      if (processed) {
        console.log('[Callback Popup] Already processed, skipping');
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        console.log('[Callback Popup] User signed in via auth state change:', session.user.id);
        closePopupSuccess();
      }
    });

    // Fallback: If no auth state change happens within 5 seconds, check session manually
    const timeoutId = setTimeout(async () => {
      if (!processed) {
        console.log('[Callback Popup] Timeout reached, checking session manually...');
        try {
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            console.log('[Callback Popup] Session found via fallback timeout, closing popup');
            closePopupSuccess();
          } else {
            console.error('[Callback Popup] No session found after timeout');
            setStatus("Error: Authentication timed out. Please close this window and try again.");
          }
        } catch (error) {
          console.error('[Callback Popup] Error in fallback check:', error);
          setStatus("Error: Failed to verify authentication. Please close this window and try again.");
        }
      }
    }, 5000);

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
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
