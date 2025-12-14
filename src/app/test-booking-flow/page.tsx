"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function TestBookingFlowPage() {
  const [pendingBookingId, setPendingBookingId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const supabase = createClient();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[TestBookingFlow] ${message}`);
  };

  useEffect(() => {
    // Check current state
    const checkState = async () => {
      const pending = localStorage.getItem('pending_booking_id');
      setPendingBookingId(pending);

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      addLog(`Pending booking ID: ${pending || 'NONE'}`);
      addLog(`Current user: ${user?.email || 'NOT LOGGED IN'}`);
    };

    checkState();
  }, []);

  const testLinkBooking = async () => {
    if (!pendingBookingId) {
      addLog('ERROR: No pending booking ID');
      return;
    }

    if (!user) {
      addLog('ERROR: No user logged in');
      return;
    }

    addLog(`Attempting to link booking ${pendingBookingId} to user ${user.id}`);

    try {
      const response = await fetch('/api/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: pendingBookingId,
          customerId: user.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        addLog(`SUCCESS: Booking linked! ${JSON.stringify(result)}`);
        localStorage.removeItem('pending_booking_id');
        setPendingBookingId(null);
      } else {
        addLog(`FAILED: ${JSON.stringify(result)}`);
      }
    } catch (error) {
      addLog(`ERROR: ${error}`);
    }
  };

  const clearPending = () => {
    localStorage.removeItem('pending_booking_id');
    document.cookie = 'pending_booking_id=; path=/; max-age=0';
    setPendingBookingId(null);
    addLog('Cleared pending booking ID');
  };

  const simulatePending = () => {
    const fakeId = crypto.randomUUID();
    localStorage.setItem('pending_booking_id', fakeId);
    setPendingBookingId(fakeId);
    addLog(`Set fake pending booking ID: ${fakeId}`);
    addLog(`⚠️ This is a FAKE ID - linking will fail!`);
  };

  const findUnlinkedBooking = async () => {
    addLog('Searching for unlinked bookings...');

    try {
      const response = await fetch('/api/test-find-unlinked-booking');
      const result = await response.json();

      if (result.booking) {
        const bookingId = result.booking.id;
        localStorage.setItem('pending_booking_id', bookingId);
        setPendingBookingId(bookingId);
        addLog(`✅ Found unlinked booking: ${bookingId}`);
        addLog(`   Merchant: ${result.booking.merchant_name || 'Unknown'}`);
        addLog(`   Created: ${new Date(result.booking.created_at).toLocaleString()}`);
      } else {
        addLog('❌ No unlinked bookings found');
      }
    } catch (error) {
      addLog(`ERROR: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Test Booking Flow</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Current State */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Current State</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">User:</span>{" "}
                <span className={user ? "text-green-600" : "text-red-600"}>
                  {user ? user.email : "Not logged in"}
                </span>
              </div>
              <div>
                <span className="font-medium">User ID:</span>{" "}
                <span className="text-sm text-gray-600">{user?.id || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">Pending Booking:</span>{" "}
                <span className={pendingBookingId ? "text-orange-600" : "text-gray-400"}>
                  {pendingBookingId || "None"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={testLinkBooking}
                disabled={!pendingBookingId || !user}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Link Pending Booking
              </button>
              <button
                onClick={findUnlinkedBooking}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Find Real Unlinked Booking
              </button>
              <button
                onClick={simulatePending}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Simulate Fake Booking (Will Fail)
              </button>
              <button
                onClick={clearPending}
                className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Clear Pending Booking
              </button>
              <button
                onClick={() => window.location.href = '/account/appointments'}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Go to Appointments
              </button>
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-black rounded-lg p-6 text-green-400 font-mono text-sm">
          <h2 className="text-white font-bold mb-3">Console Logs</h2>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
