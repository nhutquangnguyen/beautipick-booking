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
      blog_posts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          author_id: string | null;
          published: boolean;
          published_at: string | null;
          meta_title: string | null;
          meta_description: string | null;
          meta_keywords: string[] | null;
          tags: string[] | null;
          view_count: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          cover_image?: string | null;
          author_id?: string | null;
          published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
          tags?: string[] | null;
          view_count?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          author_id?: string | null;
          published?: boolean;
          published_at?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          meta_keywords?: string[] | null;
          tags?: string[] | null;
          view_count?: number;
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
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];

export type MerchantInsert = Database["public"]["Tables"]["merchants"]["Insert"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type StaffInsert = Database["public"]["Tables"]["staff"]["Insert"];
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];
export type AdminInsert = Database["public"]["Tables"]["admins"]["Insert"];
export type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];
export type BlogPostUpdate = Database["public"]["Tables"]["blog_posts"]["Update"];
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
  category?: string; // e.g., "Professional", "Luxury", "Modern"
  bestFor?: string[]; // e.g., ["Spa", "Salon", "Wellness"]
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
  themeId: "radiance",
  primaryColor: "#8B5CF6",
  secondaryColor: "#EC4899",
  accentColor: "#FBBF24",
  backgroundColor: "#FDFCFD",
  textColor: "#1F2937",
  fontFamily: "Poppins",
  borderRadius: "lg",
  buttonStyle: "solid",
  headerStyle: "overlay",
  contentOrder: ["gallery", "services", "about", "products", "video", "contact", "social"],
  showSectionTitles: true,
};

// Pre-built theme presets
export const themePresets: ThemePreset[] = [
  // PHASE 1: High-Priority Markets
  {
    id: "opulence",
    name: "💎 Opulence",
    description: "Ultra-luxury design with gold accents and sophisticated dark palette. For high-end spas and medical aesthetics.",
    preview: "linear-gradient(135deg, #0A0A0A 0%, #D4AF37 100%)",
    category: "Luxury",
    bestFor: ["Luxury Spa", "Medical Spa", "Premium Wellness", "Celebrity Esthetician"],
    theme: {
      primaryColor: "#D4AF37",
      secondaryColor: "#0A0A0A",
      accentColor: "#F7E7CE",
      backgroundColor: "#FAFAF9",
      textColor: "#0A0A0A",
      fontFamily: "Playfair Display",
      borderRadius: "none",
      buttonStyle: "outline",
      headerStyle: "overlay",
      contentOrder: ["video", "about", "services", "gallery", "contact", "social", "products"],
      showSectionTitles: true,
    },
  },
  {
    id: "radiance",
    name: "✨ Radiance",
    description: "Vibrant and stylish with purple-pink gradients. Perfect for hair salons and transformation-focused businesses.",
    preview: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    category: "Vibrant",
    bestFor: ["Hair Salon", "Hair Colorist", "Style Studio", "Extension Specialist"],
    theme: {
      primaryColor: "#8B5CF6",
      secondaryColor: "#EC4899",
      accentColor: "#FBBF24",
      backgroundColor: "#FDFCFD",
      textColor: "#1F2937",
      fontFamily: "Poppins",
      borderRadius: "lg",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["gallery", "services", "about", "products", "video", "contact", "social"],
      showSectionTitles: true,
    },
  },
  {
    id: "glamour",
    name: "💄 Glamour",
    description: "Bold and trendy with hot pink and rose gold. Instagram-worthy design for makeup artists and beauty influencers.",
    preview: "linear-gradient(135deg, #FF006E 0%, #B76E79 100%)",
    category: "Feminine",
    bestFor: ["Makeup Artist", "Beauty Salon", "Lash Technician", "Bridal Beauty"],
    theme: {
      primaryColor: "#FF006E",
      secondaryColor: "#B76E79",
      accentColor: "#FBBF24",
      backgroundColor: "#FFF0F3",
      textColor: "#1A1A1A",
      fontFamily: "Outfit",
      borderRadius: "full",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["gallery", "services", "about", "products", "social", "contact", "video"],
      showSectionTitles: true,
    },
  },

  // PHASE 2: Specialized Markets
  {
    id: "tranquil",
    name: "🧖 Tranquil",
    description: "Peaceful and healing with soft teal and sandy tones. Designed for massage therapy and therapeutic services.",
    preview: "linear-gradient(135deg, #5F9EA0 0%, #E4D4C8 100%)",
    category: "Calming",
    bestFor: ["Massage Therapy", "Therapeutic Massage", "Wellness Clinic", "Chiropractic"],
    theme: {
      primaryColor: "#5F9EA0",
      secondaryColor: "#E4D4C8",
      accentColor: "#9BB8BA",
      backgroundColor: "#FFFFF0",
      textColor: "#2C3E50",
      fontFamily: "Lato",
      borderRadius: "lg",
      buttonStyle: "solid",
      headerStyle: "stacked",
      contentOrder: ["about", "services", "gallery", "contact", "video", "social", "products"],
      showSectionTitles: true,
    },
  },
  {
    id: "serenity",
    name: "🌿 Serenity",
    description: "Zen-inspired with sage green and warm beige. Perfect for holistic wellness and meditation centers.",
    preview: "linear-gradient(135deg, #9CAF88 0%, #E8D5C4 100%)",
    category: "Natural",
    bestFor: ["Yoga Studio", "Meditation Center", "Holistic Therapy", "Ayurvedic Spa"],
    theme: {
      primaryColor: "#9CAF88",
      secondaryColor: "#E8D5C4",
      accentColor: "#B8C5A8",
      backgroundColor: "#FDFBF7",
      textColor: "#3E4C3A",
      fontFamily: "Jost",
      borderRadius: "md",
      buttonStyle: "ghost",
      headerStyle: "minimal",
      contentOrder: ["about", "services", "gallery", "contact", "social", "video", "products"],
      showSectionTitles: false,
    },
  },
  {
    id: "distinguished",
    name: "🎩 Distinguished",
    description: "Classic masculine design with bourbon and charcoal. Vintage-modern aesthetic for barbershops and men's grooming.",
    preview: "linear-gradient(135deg, #B85450 0%, #2C2C2C 100%)",
    category: "Classic",
    bestFor: ["Barbershop", "Men's Grooming", "Traditional Barber", "Gentleman's Lounge"],
    theme: {
      primaryColor: "#B85450",
      secondaryColor: "#2C2C2C",
      accentColor: "#C19A6B",
      backgroundColor: "#F5F3F0",
      textColor: "#2C2C2C",
      fontFamily: "Crimson Text",
      borderRadius: "sm",
      buttonStyle: "solid",
      headerStyle: "stacked",
      contentOrder: ["about", "services", "gallery", "products", "contact", "social", "video"],
      showSectionTitles: true,
    },
  },

  // PHASE 3: Emerging Markets
  {
    id: "blossom",
    name: "🌸 Blossom",
    description: "Cute and trendy with pastel palette. Pinterest-style design for nail salons and nail art specialists.",
    preview: "linear-gradient(135deg, #C9A0DC 0%, #B4E7CE 50%, #FFD4B2 100%)",
    category: "Playful",
    bestFor: ["Nail Salon", "Nail Technician", "Nail Art Specialist", "Mobile Nail Service"],
    theme: {
      primaryColor: "#C9A0DC",
      secondaryColor: "#B4E7CE",
      accentColor: "#FFD4B2",
      backgroundColor: "#FFFBFC",
      textColor: "#4A3B52",
      fontFamily: "Quicksand",
      borderRadius: "full",
      buttonStyle: "solid",
      headerStyle: "stacked",
      contentOrder: ["gallery", "services", "products", "about", "contact", "social", "video"],
      showSectionTitles: true,
    },
  },
  {
    id: "powerhouse",
    name: "🏋️ Powerhouse",
    description: "Bold and energetic with electric blue and neon accents. High-impact design for fitness and training.",
    preview: "linear-gradient(135deg, #0066FF 0%, #FFE500 100%)",
    category: "Energy",
    bestFor: ["Personal Trainer", "Fitness Studio", "CrossFit", "Sports Coach"],
    theme: {
      primaryColor: "#0066FF",
      secondaryColor: "#1A1A1A",
      accentColor: "#FFE500",
      backgroundColor: "#F8F9FA",
      textColor: "#1A1A1A",
      fontFamily: "Inter",
      borderRadius: "sm",
      buttonStyle: "solid",
      headerStyle: "overlay",
      contentOrder: ["video", "services", "about", "gallery", "contact", "social", "products"],
      showSectionTitles: true,
    },
  },
  {
    id: "artisan",
    name: "🪡 Artisan",
    description: "Edgy and artistic with dark aesthetic and crimson accents. Portfolio-focused for tattoo artists and body art.",
    preview: "linear-gradient(135deg, #0D0D0D 0%, #DC143C 100%)",
    category: "Edgy",
    bestFor: ["Tattoo Studio", "Tattoo Artist", "Permanent Makeup", "Body Art"],
    theme: {
      primaryColor: "#DC143C",
      secondaryColor: "#0D0D0D",
      accentColor: "#8B0000",
      backgroundColor: "#F5F5F5",
      textColor: "#0D0D0D",
      fontFamily: "Oswald",
      borderRadius: "none",
      buttonStyle: "outline",
      headerStyle: "overlay",
      contentOrder: ["gallery", "about", "services", "contact", "social", "video", "products"],
      showSectionTitles: true,
    },
  },

  // PHASE 4: Premium Niche
  {
    id: "coastal",
    name: "🌊 Coastal",
    description: "Breezy and luxurious with ocean blue and sandy beige. Vacation-inspired for resort spas and beach locations.",
    preview: "linear-gradient(135deg, #0077BE 0%, #F5E6D3 100%)",
    category: "Vacation",
    bestFor: ["Resort Spa", "Hotel Spa", "Destination Wellness", "Beach Spa"],
    theme: {
      primaryColor: "#0077BE",
      secondaryColor: "#F5E6D3",
      accentColor: "#A7D8DE",
      backgroundColor: "#FAFCFC",
      textColor: "#1A3A4A",
      fontFamily: "Montserrat",
      borderRadius: "lg",
      buttonStyle: "ghost",
      headerStyle: "overlay",
      contentOrder: ["video", "about", "services", "gallery", "products", "contact", "social"],
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
