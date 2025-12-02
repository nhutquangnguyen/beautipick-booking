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
          google_maps_url: string | null;
          youtube_url: string | null;
          custom_domain: string | null;
          social_links: Json;
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
          google_maps_url?: string | null;
          youtube_url?: string | null;
          custom_domain?: string | null;
          social_links?: Json;
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
          google_maps_url?: string | null;
          youtube_url?: string | null;
          custom_domain?: string | null;
          social_links?: Json;
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
      customers: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          merchant_id: string;
          email: string;
          name: string;
          phone: string; // Changed from string | null to string (NOT NULL)
          notes: string | null;
          tags: string[] | null;
          total_bookings: number;
          total_spent: number;
          last_booking_date: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id: string;
          email: string;
          name: string;
          phone: string; // Changed from optional to required
          notes?: string | null;
          tags?: string[] | null;
          total_bookings?: number;
          total_spent?: number;
          last_booking_date?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id?: string;
          email?: string;
          name?: string;
          phone?: string; // Can be updated
          notes?: string | null;
          tags?: string[] | null;
          total_bookings?: number;
          total_spent?: number;
          last_booking_date?: string | null;
          is_active?: boolean;
        };
      };
      admins: {
        Row: {
          user_id: string;
          created_at: string;
          created_by: string | null;
          notes: string | null;
        };
        Insert: {
          user_id: string;
          created_at?: string;
          created_by?: string | null;
          notes?: string | null;
        };
        Update: {
          user_id?: string;
          created_at?: string;
          created_by?: string | null;
          notes?: string | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          merchant_id: string;
          service_id: string | null;
          staff_id: string | null;
          customer_id: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone: string | null;
          booking_date: string | null;
          start_time: string | null;
          end_time: string | null;
          status: "pending" | "confirmed" | "cancelled" | "completed";
          notes: string | null;
          total_price: number;
          cart_items: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id: string;
          service_id?: string | null;
          staff_id?: string | null;
          customer_id?: string | null;
          customer_name: string;
          customer_email: string;
          customer_phone?: string | null;
          booking_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          total_price: number;
          cart_items?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          merchant_id?: string;
          service_id?: string | null;
          staff_id?: string | null;
          customer_id?: string | null;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string | null;
          booking_date?: string | null;
          start_time?: string | null;
          end_time?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "completed";
          notes?: string | null;
          total_price?: number;
          cart_items?: Json | null;
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
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Admin = Database["public"]["Tables"]["admins"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export type MerchantInsert = Database["public"]["Tables"]["merchants"]["Insert"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type StaffInsert = Database["public"]["Tables"]["staff"]["Insert"];
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
export type AdminInsert = Database["public"]["Tables"]["admins"]["Insert"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];

// Content section order types
export type ContentSection = "about" | "contact" | "social" | "video" | "gallery" | "products" | "services";

// Theme configuration type
export interface MerchantTheme {
  themeId: string; // preset theme identifier
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: "none" | "sm" | "md" | "lg" | "full";
  buttonStyle: "solid" | "outline" | "ghost";
  // Layout options
  headerStyle: "overlay" | "stacked" | "minimal";
  contentOrder: ContentSection[];
  showSectionTitles: boolean;
}

// Theme preset type
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: string; // preview image or gradient
  theme: Omit<MerchantTheme, "themeId">;
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

export const defaultContentOrder: ContentSection[] = [
  "about",
  "contact",
  "social",
  "video",
  "gallery",
  "products",
  "services",
];

export const defaultTheme: MerchantTheme = {
  themeId: "modern",
  primaryColor: "#8B5CF6",
  secondaryColor: "#EC4899",
  accentColor: "#F59E0B",
  backgroundColor: "#FFFFFF",
  textColor: "#1F2937",
  fontFamily: "Inter",
  borderRadius: "md",
  buttonStyle: "solid",
  headerStyle: "overlay",
  contentOrder: defaultContentOrder,
  showSectionTitles: true,
};

// Pre-built theme presets
export const themePresets: ThemePreset[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Clean and professional with purple accents",
    preview: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    theme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#EC4899",
      accentColor: "#F59E0B",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      fontFamily: "Inter",
      borderRadius: "md",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["about", "contact", "social", "video", "gallery", "products", "services"],
      showSectionTitles: true,
    },
  },
  {
    id: "elegant",
    name: "Elegant",
    description: "Sophisticated dark theme with gold accents",
    preview: "linear-gradient(135deg, #1F2937 0%, #374151 100%)",
    theme: {
      primaryColor: "#D4AF37",
      secondaryColor: "#C9A227",
      accentColor: "#F5E6C8",
      backgroundColor: "#1F2937",
      textColor: "#F9FAFB",
      fontFamily: "Playfair Display",
      borderRadius: "sm",
      buttonStyle: "outline",
      headerStyle: "stacked",
      contentOrder: ["gallery", "about", "services", "products", "video", "contact", "social"],
      showSectionTitles: true,
    },
  },
  {
    id: "fresh",
    name: "Fresh",
    description: "Bright and energetic with teal tones",
    preview: "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
    theme: {
      primaryColor: "#14B8A6",
      secondaryColor: "#06B6D4",
      accentColor: "#F59E0B",
      backgroundColor: "#F0FDFA",
      textColor: "#134E4A",
      fontFamily: "Poppins",
      borderRadius: "lg",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["about", "services", "gallery", "video", "products", "contact", "social"],
      showSectionTitles: true,
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Simple black and white design",
    preview: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)",
    theme: {
      primaryColor: "#000000",
      secondaryColor: "#4B5563",
      accentColor: "#EF4444",
      backgroundColor: "#FFFFFF",
      textColor: "#111827",
      fontFamily: "DM Sans",
      borderRadius: "none",
      buttonStyle: "outline",
      headerStyle: "minimal",
      contentOrder: ["services", "about", "gallery", "contact", "social", "video", "products"],
      showSectionTitles: false,
    },
  },
  {
    id: "warm",
    name: "Warm",
    description: "Cozy and inviting with earthy tones",
    preview: "linear-gradient(135deg, #F97316 0%, #EA580C 100%)",
    theme: {
      primaryColor: "#EA580C",
      secondaryColor: "#DC2626",
      accentColor: "#FBBF24",
      backgroundColor: "#FFFBEB",
      textColor: "#78350F",
      fontFamily: "Nunito",
      borderRadius: "full",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["about", "gallery", "video", "services", "products", "contact", "social"],
      showSectionTitles: true,
    },
  },
  {
    id: "rose",
    name: "Rose",
    description: "Soft and feminine with pink hues",
    preview: "linear-gradient(135deg, #F43F5E 0%, #EC4899 100%)",
    theme: {
      primaryColor: "#F43F5E",
      secondaryColor: "#EC4899",
      accentColor: "#A855F7",
      backgroundColor: "#FFF1F2",
      textColor: "#881337",
      fontFamily: "Quicksand",
      borderRadius: "full",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["gallery", "about", "services", "video", "products", "contact", "social"],
      showSectionTitles: true,
    },
  },
  {
    id: "ocean",
    name: "Ocean",
    description: "Calm and serene with blue tones",
    preview: "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
    theme: {
      primaryColor: "#3B82F6",
      secondaryColor: "#1D4ED8",
      accentColor: "#22D3EE",
      backgroundColor: "#EFF6FF",
      textColor: "#1E3A5F",
      fontFamily: "Lato",
      borderRadius: "md",
      buttonStyle: "solid",
      headerStyle: "stacked",
      contentOrder: ["about", "services", "contact", "gallery", "video", "products", "social"],
      showSectionTitles: true,
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural and organic with green tones",
    preview: "linear-gradient(135deg, #22C55E 0%, #15803D 100%)",
    theme: {
      primaryColor: "#22C55E",
      secondaryColor: "#15803D",
      accentColor: "#A3E635",
      backgroundColor: "#F0FDF4",
      textColor: "#14532D",
      fontFamily: "Montserrat",
      borderRadius: "lg",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["about", "gallery", "services", "video", "products", "contact", "social"],
      showSectionTitles: true,
    },
  },
];

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

// Social link types
export type SocialLinkType =
  | "instagram"
  | "facebook"
  | "tiktok"
  | "youtube"
  | "twitter"
  | "whatsapp"
  | "zalo"
  | "telegram"
  | "website"
  | "shopee"
  | "lazada"
  | "custom";

export interface SocialLink {
  id: string;
  type: SocialLinkType;
  title: string;
  url: string;
}

export const defaultSocialLinks: SocialLink[] = [];
