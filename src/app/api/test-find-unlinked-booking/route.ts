import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const supabase = createServiceRoleClient();

    // Find the most recent booking without a customer_id
    const { data: booking, error } = await supabase
      .from("bookings")
      .select(`
        id,
        customer_name,
        customer_email,
        customer_phone,
        created_at,
        merchants (
          business_name
        )
      `)
      .is("customer_id", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Error finding unlinked booking:", error);
      return NextResponse.json(
        { error: "Failed to find unlinked booking", details: error.message },
        { status: 500 }
      );
    }

    if (!booking) {
      return NextResponse.json({ booking: null, message: "No unlinked bookings found" });
    }

    return NextResponse.json({
      booking: {
        ...booking,
        merchant_name: (booking.merchants as any)?.business_name || 'Unknown',
      }
    });
  } catch (error: any) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
