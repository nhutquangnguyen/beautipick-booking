export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          business_name: string;
          slug: string;
          logo_url: string | null;
          cover_image_url: string | null;
          description: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          zip_code: string | null;
          country: string;
          timezone: string;
          currency: string;
          theme: Json;
          settings: Json;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          business_name: string;
          slug: string;
          logo_url?: string | null;
          cover_image_url?: string | null;
          description?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string;
          timezone?: string;
          currency?: string;
          theme?: Json;
          settings?: Json;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          business_name?: string;
          slug?: string;
          logo_url?: string | null;
          cover_image_url?: string | null;
          description?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          zip_code?: string | null;
          country?: string;
          timezone?: string;
          currency?: string;
          theme?: Json;
          settings?: Json;
          is_active?: boolean;
        };
      };
      services: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          merchant_id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price: number;
          category: string | null;
          image_url: string | null;
          is_active: boolean;
          display_order: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id: string;
          name: string;
          description?: string | null;
          duration_minutes: number;
          price: number;
          category?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          display_order?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id?: string;
          name?: string;
          description?: string | null;
          duration_minutes?: number;
          price?: number;
          category?: string | null;
          image_url?: string | null;
          is_active?: boolean;
          display_order?: number;
        };
      };
      staff: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          merchant_id: string;
          name: string;
          email: string | null;
          phone: string | null;
          avatar_url: string | null;
          bio: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id: string;
          name: string;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id?: string;
          name?: string;
          email?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          is_active?: boolean;
        };
      };
      staff_services: {
        Row: {
          id: string;
          staff_id: string;
          service_id: string;
        };
        Insert: {
          id?: string;
          staff_id: string;
          service_id: string;
        };
        Update: {
          id?: string;
          staff_id?: string;
          service_id?: string;
        };
      };
      availability: {
        Row: {
          id: string;
          created_at: string;
          merchant_id: string;
          staff_id: string | null;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_available: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          merchant_id: string;
          staff_id?: string | null;
          day_of_week: number;
          start_time: string;
          end_time: string;
          is_available?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          merchant_id?: string;
          staff_id?: string | null;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          is_available?: boolean;
        };
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          merchant_id: string;
          service_id: string;
          staff_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          booking_date: string;
          start_time: string;
          end_time: string;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          notes: string | null;
          total_price: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id: string;
          service_id: string;
          staff_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          booking_date: string;
          start_time: string;
          end_time: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          total_price: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id?: string;
          service_id?: string;
          staff_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          booking_date?: string;
          start_time?: string;
          end_time?: string;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          total_price?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience types
export type Merchant = Database["public"]["Tables"]["merchants"]["Row"];
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type Staff = Database["public"]["Tables"]["staff"]["Row"];
export type Availability = Database["public"]["Tables"]["availability"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export type MerchantInsert = Database["public"]["Tables"]["merchants"]["Insert"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type StaffInsert = Database["public"]["Tables"]["staff"]["Insert"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

// Theme configuration type
export interface MerchantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  buttonStyle: "solid" | "outline" | "ghost";
}

// Settings type
export interface MerchantSettings {
  bookingLeadTime: number; // hours in advance required
  bookingWindow: number; // days in advance allowed
  cancellationPolicy: string;
  confirmationEmailEnabled: boolean;
  reminderEmailEnabled: boolean;
  reminderHoursBefore: number;
  showStaffSelection: boolean;
  requirePhoneNumber: boolean;
  allowNotes: boolean;
}

export const defaultTheme: MerchantTheme = {
  primaryColor: "#8B5CF6",
  secondaryColor: "#EC4899",
  accentColor: "#F59E0B",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  fontFamily: "Inter",
  borderRadius: "md",
  buttonStyle: "solid",
};

export const defaultSettings: MerchantSettings = {
  bookingLeadTime: 2,
  bookingWindow: 30,
  cancellationPolicy: "Free cancellation up to 24 hours before your appointment.",
  confirmationEmailEnabled: true,
  reminderEmailEnabled: true,
  reminderHoursBefore: 24,
  showStaffSelection: true,
  requirePhoneNumber: false,
  allowNotes: true,
};
