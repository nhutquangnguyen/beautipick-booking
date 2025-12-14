import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export async function POST(request: Request) {
  try {
    // Use service role client to bypass RLS for public booking creation
    const supabase = createServiceRoleClient();
    const bookingData = await request.json();

    console.log('[API/Bookings POST] Received booking data:', {
      merchant_id: bookingData.merchant_id,
      customer_id: bookingData.customer_id,
      customer_name: bookingData.customer_name,
      customer_phone: bookingData.customer_phone,
      customer_email: bookingData.customer_email,
    });

    // Validate required fields
    if (!bookingData.merchant_id) {
      console.error("Missing merchant_id");
      return NextResponse.json(
        { error: "merchant_id is required" },
        { status: 400 }
      );
    }

    if (!bookingData.customer_name || !bookingData.customer_phone) {
      console.error("Missing customer information");
      return NextResponse.json(
        { error: "Customer name and phone are required" },
        { status: 400 }
      );
    }

    const insertData = {
      merchant_id: bookingData.merchant_id,
      customer_id: bookingData.customer_id || null, // Save customer_id if user is logged in
      customer_name: bookingData.customer_name,
      customer_email: bookingData.customer_email || null, // Email is optional
      customer_phone: bookingData.customer_phone,
      booking_date: bookingData.booking_date,
      start_time: bookingData.start_time,
      end_time: bookingData.end_time,
      status: bookingData.status || "pending",
      notes: bookingData.notes,
      total_price: bookingData.total_price,
      cart_items: bookingData.cart_items,
    };

    // Insert booking into database
    console.log('[API/Bookings POST] Attempting to insert booking:', insertData);

    const { data, error } = await supabase
      .from("bookings")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error("Database error creating booking:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json(
        { error: "Failed to create booking", details: error.message, code: error.code },
        { status: 500 }
      );
    }

    console.log('[API/Bookings POST] Booking created successfully:', data.id);
    return NextResponse.json({ success: true, booking: data });
  } catch (error: any) {
    console.error("Error processing booking request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Use service role client to bypass RLS for linking bookings to customer accounts
    const supabase = createServiceRoleClient();
    const { bookingId, customerId } = await request.json();

    // Validate required fields
    if (!bookingId || !customerId) {
      console.error("Missing bookingId or customerId");
      return NextResponse.json(
        { error: "bookingId and customerId are required" },
        { status: 400 }
      );
    }

    console.log('[API/Bookings PATCH] Linking booking to customer:', { bookingId, customerId });

    // First, check if the booking exists
    const { data: existingBooking, error: checkError } = await supabase
      .from("bookings")
      .select("id, customer_id")
      .eq("id", bookingId)
      .maybeSingle();

    if (checkError) {
      console.error("Database error checking booking:", checkError);
      return NextResponse.json(
        { error: "Failed to check booking", details: checkError.message },
        { status: 500 }
      );
    }

    if (!existingBooking) {
      console.error("Booking not found:", bookingId);
      return NextResponse.json(
        { error: "Booking not found", details: `No booking found with ID ${bookingId}` },
        { status: 404 }
      );
    }

    // Check if already linked
    if (existingBooking.customer_id) {
      console.log('[API/Bookings PATCH] Booking already linked to customer:', existingBooking.customer_id);
      return NextResponse.json({
        success: true,
        booking: existingBooking,
        message: "Booking already linked to a customer account"
      });
    }

    // Update booking to link it to customer account
    const { data, error } = await supabase
      .from("bookings")
      .update({ customer_id: customerId })
      .eq("id", bookingId)
      .select()
      .single();

    if (error) {
      console.error("Database error updating booking:", error);
      return NextResponse.json(
        { error: "Failed to link booking to account", details: error.message },
        { status: 500 }
      );
    }

    console.log('[API/Bookings PATCH] Successfully linked booking to customer');
    return NextResponse.json({ success: true, booking: data });
  } catch (error: any) {
    console.error("Error processing booking update request:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
