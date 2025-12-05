import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: Request) {
  try {
    // Use service role client to bypass RLS for public booking creation
    const supabase = createServiceRoleClient();
    const bookingData = await request.json();

    // Insert booking into database
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        merchant_id: bookingData.merchant_id,
        customer_name: bookingData.customer_name,
        customer_email: bookingData.customer_email,
        customer_phone: bookingData.customer_phone,
        booking_date: bookingData.booking_date,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        status: bookingData.status,
        notes: bookingData.notes,
        total_price: bookingData.total_price,
        cart_items: bookingData.cart_items,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating booking:", error);
      return NextResponse.json(
        { error: "Failed to create booking", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, booking: data });
  } catch (error) {
    console.error("Error processing booking request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
