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
          cover_image_1: string | null;
          cover_image_2: string | null;
          cover_image_3: string | null;
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
          cover_image_1?: string | null;
          cover_image_2?: string | null;
          cover_image_3?: string | null;
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
          cover_image_1?: string | null;
          cover_image_2?: string | null;
          cover_image_3?: string | null;
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

// Layout template types - defines the actual visual structure
// We have 5 unique layouts that serve all 10 theme personas
export type LayoutTemplate =
  | "starter"       // Simple Linktree-style layout
  | "blossom"       // Soft feminine design with pastel colors
  | "grid"          // Instagram-style visual grid with dark mode
  | "elegancegrid"  // Sophisticated grid with elegant colors
  | "showcasegrid"  // Minimalist portfolio with masonry gallery
  | "luxury"        // Full-screen hero with parallax (Opulence, Coastal)
  | "modern"        // Dynamic split-screen (Radiance, Glamour, Blossom)
  | "minimal"       // Zen flowing sections (Serenity, Tranquil)
  | "classic"       // Traditional symmetrical (Distinguished)
  | "portfolio"     // Dark full-width showcase (Artisan, Powerhouse)
  | "christmas"     // Festive holiday theme
  | "tetholiday";   // Tết Nguyên Đán (Lunar New Year) theme

// Theme configuration type
export interface MerchantTheme {
  themeId: string; // preset theme identifier
  layoutTemplate: LayoutTemplate; // NEW: defines the actual layout structure
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

// Color scheme for a layout
export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  preview: string; // gradient preview
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
}

// Layout option with available color schemes
export interface LayoutOption {
  id: LayoutTemplate;
  name: string;
  description: string;
  icon: string; // emoji or icon
  coverImage?: string; // optional cover image URL
  bestFor: string[];
  features: string[];
  colorSchemes: ColorScheme[];
  defaultColorScheme: string; // id of default color scheme
}

// Theme preset type (legacy - kept for backward compatibility)
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  preview: string; // preview image or gradient
  category?: string; // e.g., "Professional", "Luxury", "Modern"
  bestFor?: string[]; // e.g., ["Spa", "Salon", "Wellness"]
  layoutTemplate: LayoutTemplate; // NEW: the layout this theme uses
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
  layoutTemplate: "modern",
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
    layoutTemplate: "luxury",
    theme: {
      layoutTemplate: "luxury",
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
    layoutTemplate: "modern",
    theme: {
      layoutTemplate: "modern",
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
    layoutTemplate: "modern",
    theme: {
      layoutTemplate: "modern",
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
    layoutTemplate: "minimal",
    theme: {
      layoutTemplate: "minimal",
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
    layoutTemplate: "minimal",
    theme: {
      layoutTemplate: "minimal",
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
    layoutTemplate: "classic",
    theme: {
      layoutTemplate: "classic",
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
    layoutTemplate: "modern",
    theme: {
      layoutTemplate: "modern",
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
    layoutTemplate: "portfolio",
    theme: {
      layoutTemplate: "portfolio",
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
    layoutTemplate: "portfolio",
    theme: {
      layoutTemplate: "portfolio",
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
    layoutTemplate: "luxury",
    theme: {
      layoutTemplate: "luxury",
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

// Layout options with color schemes
export const layoutOptions: LayoutOption[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Simple & clean Linktree-style layout, perfect for beginners",
    icon: "🔗",
    bestFor: ["Beginners", "Simple Setup", "Link-in-Bio", "All Services"],
    features: ["Single column", "Stacked cards", "Clean design", "Mobile-first"],
    defaultColorScheme: "clean",
    colorSchemes: [
      {
        id: "clean",
        name: "Clean",
        description: "Simple white background with brand colors",
        preview: "linear-gradient(135deg, #3B82F6 0%, #FFFFFF 100%)",
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
        accentColor: "#F59E0B",
        backgroundColor: "#FFFFFF",
        textColor: "#111827",
        fontFamily: "Inter",
      },
      {
        id: "minimal",
        name: "Minimal",
        description: "Soft gray with subtle accent",
        preview: "linear-gradient(135deg, #6B7280 0%, #F3F4F6 100%)",
        primaryColor: "#6B7280",
        secondaryColor: "#9CA3AF",
        accentColor: "#4B5563",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "System UI",
      },
      {
        id: "rose",
        name: "Rose",
        description: "Warm rose pink with elegant accents",
        preview: "linear-gradient(135deg, #E11D48 0%, #FDF2F8 100%)",
        primaryColor: "#E11D48",
        secondaryColor: "#F472B6",
        accentColor: "#BE185D",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "Inter",
      },
      {
        id: "ocean",
        name: "Ocean",
        description: "Cool ocean blue with teal accents",
        preview: "linear-gradient(135deg, #0891B2 0%, #ECFEFF 100%)",
        primaryColor: "#0891B2",
        secondaryColor: "#06B6D4",
        accentColor: "#0E7490",
        backgroundColor: "#FFFFFF",
        textColor: "#0F172A",
        fontFamily: "Inter",
      },
      {
        id: "sunset",
        name: "Sunset",
        description: "Warm orange and coral sunset vibes",
        preview: "linear-gradient(135deg, #F97316 0%, #FFF7ED 100%)",
        primaryColor: "#F97316",
        secondaryColor: "#FB923C",
        accentColor: "#EA580C",
        backgroundColor: "#FFFFFF",
        textColor: "#1C1917",
        fontFamily: "Inter",
      },
      {
        id: "lavender",
        name: "Lavender",
        description: "Soft purple with calming tones",
        preview: "linear-gradient(135deg, #7C3AED 0%, #F5F3FF 100%)",
        primaryColor: "#7C3AED",
        secondaryColor: "#A78BFA",
        accentColor: "#6D28D9",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "Inter",
      },
      {
        id: "forest",
        name: "Forest",
        description: "Natural green with earthy tones",
        preview: "linear-gradient(135deg, #059669 0%, #F0FDF4 100%)",
        primaryColor: "#059669",
        secondaryColor: "#10B981",
        accentColor: "#047857",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "Inter",
      },
      {
        id: "berry",
        name: "Berry",
        description: "Rich berry purple with vibrant accents",
        preview: "linear-gradient(135deg, #BE185D 0%, #FDF2F8 100%)",
        primaryColor: "#BE185D",
        secondaryColor: "#DB2777",
        accentColor: "#9F1239",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "Inter",
      },
      {
        id: "midnight",
        name: "Midnight",
        description: "Deep navy with bright accents",
        preview: "linear-gradient(135deg, #1E3A8A 0%, #DBEAFE 100%)",
        primaryColor: "#1E3A8A",
        secondaryColor: "#3B82F6",
        accentColor: "#1E40AF",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "Inter",
      },
      {
        id: "coral",
        name: "Coral",
        description: "Vibrant coral with tropical feel",
        preview: "linear-gradient(135deg, #DC2626 0%, #FEE2E2 100%)",
        primaryColor: "#DC2626",
        secondaryColor: "#F87171",
        accentColor: "#B91C1C",
        backgroundColor: "#FFFFFF",
        textColor: "#1F2937",
        fontFamily: "Inter",
      },
    ],
  },
  {
    id: "elegancegrid",
    name: "Elegance",
    description: "Sophisticated grid layout with elegant colors and smooth animations, perfect for luxury spas",
    icon: "✨",
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070",
    bestFor: ["Luxury Spas", "Beauty Salons", "Wellness Centers", "Premium Services", "High-end Aesthetics"],
    features: ["Fixed header", "Asymmetrical grid", "Elegant palette", "Hover effects", "Instagram-native"],
    defaultColorScheme: "elegance",
    colorSchemes: [
      {
        id: "elegance",
        name: "Elegance",
        description: "Deep teal, warm beige and rose gold - sophisticated and calming",
        preview: "linear-gradient(135deg, #0B5345 0%, #F5F5DC 50%, #C89467 100%)",
        primaryColor: "#0B5345",
        secondaryColor: "#F5F5DC",
        accentColor: "#C89467",
        backgroundColor: "#F7F7F7",
        textColor: "#333333",
        fontFamily: "Inter",
      },
      {
        id: "imperial",
        name: "Imperial",
        description: "Deep purple with silver - regal and sophisticated",
        preview: "linear-gradient(135deg, #4A148C 0%, #E8E8E8 50%, #C0C0C0 100%)",
        primaryColor: "#4A148C",
        secondaryColor: "#E8E8E8",
        accentColor: "#C0C0C0",
        backgroundColor: "#FAFAFA",
        textColor: "#2D2D2D",
        fontFamily: "Inter",
      },
      {
        id: "blush",
        name: "Blush",
        description: "Soft blush pink with champagne gold - romantic and feminine",
        preview: "linear-gradient(135deg, #C48B9F 0%, #FFF5F7 50%, #D4AF37 100%)",
        primaryColor: "#C48B9F",
        secondaryColor: "#FFF5F7",
        accentColor: "#D4AF37",
        backgroundColor: "#FEFEFE",
        textColor: "#3D3D3D",
        fontFamily: "Inter",
      },
      {
        id: "emerald",
        name: "Emerald",
        description: "Rich emerald green with cream - luxurious and natural",
        preview: "linear-gradient(135deg, #047857 0%, #FFFBEB 50%, #B5986A 100%)",
        primaryColor: "#047857",
        secondaryColor: "#FFFBEB",
        accentColor: "#B5986A",
        backgroundColor: "#FAFAF9",
        textColor: "#1F2937",
        fontFamily: "Inter",
      },
      {
        id: "sapphire",
        name: "Sapphire",
        description: "Deep sapphire blue with pearl white - classic and timeless",
        preview: "linear-gradient(135deg, #1E3A8A 0%, #F8FAFC 50%, #94A3B8 100%)",
        primaryColor: "#1E3A8A",
        secondaryColor: "#F8FAFC",
        accentColor: "#94A3B8",
        backgroundColor: "#FFFFFF",
        textColor: "#1E293B",
        fontFamily: "Inter",
      },
      {
        id: "plum",
        name: "Plum",
        description: "Deep plum with dusty rose - elegant and mysterious",
        preview: "linear-gradient(135deg, #6B2E5F 0%, #F9E6F2 50%, #D4A5B8 100%)",
        primaryColor: "#6B2E5F",
        secondaryColor: "#F9E6F2",
        accentColor: "#D4A5B8",
        backgroundColor: "#FDF9FC",
        textColor: "#2C2C2C",
        fontFamily: "Inter",
      },
    ],
  },
  {
    id: "showcasegrid",
    name: "Showcase",
    description: "Minimalist portfolio layout with high-contrast design and masonry gallery for artists",
    icon: "🎨",
    coverImage: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071",
    bestFor: ["Artists", "Photographers", "Designers", "Tattoo Artists", "Creative Professionals"],
    features: ["Minimalist design", "Masonry gallery", "High contrast", "Full-screen slideshow", "Image-centric"],
    defaultColorScheme: "monochrome",
    colorSchemes: [
      {
        id: "monochrome",
        name: "Monochrome",
        description: "Deep charcoal with vibrant blue - clean and modern",
        preview: "linear-gradient(135deg, #1A1A1A 0%, #F0F0F0 50%, #007AFF 100%)",
        primaryColor: "#1A1A1A",
        secondaryColor: "#F0F0F0",
        accentColor: "#007AFF",
        backgroundColor: "#FFFFFF",
        textColor: "#1A1A1A",
        fontFamily: "Inter",
      },
      {
        id: "crimson",
        name: "Crimson",
        description: "Bold crimson red with black - powerful and dramatic",
        preview: "linear-gradient(135deg, #0A0A0A 0%, #DC143C 50%, #2C2C2C 100%)",
        primaryColor: "#DC143C",
        secondaryColor: "#0A0A0A",
        accentColor: "#FF6B6B",
        backgroundColor: "#FFFFFF",
        textColor: "#0A0A0A",
        fontFamily: "Inter",
      },
      {
        id: "goldenHour",
        name: "Golden Hour",
        description: "Warm gold and deep navy - elegant and luxurious",
        preview: "linear-gradient(135deg, #1C2541 0%, #D4AF37 50%, #F4E8C1 100%)",
        primaryColor: "#1C2541",
        secondaryColor: "#F4E8C1",
        accentColor: "#D4AF37",
        backgroundColor: "#FFFFFF",
        textColor: "#1C2541",
        fontFamily: "Inter",
      },
      {
        id: "electricViolet",
        name: "Electric Violet",
        description: "Vibrant purple with neon accents - bold and creative",
        preview: "linear-gradient(135deg, #2D1B69 0%, #8B5CF6 50%, #C084FC 100%)",
        primaryColor: "#2D1B69",
        secondaryColor: "#F5F3FF",
        accentColor: "#8B5CF6",
        backgroundColor: "#FFFFFF",
        textColor: "#1E1B4B",
        fontFamily: "Inter",
      },
      {
        id: "emeraldNight",
        name: "Emerald Night",
        description: "Deep emerald green with dark tones - mysterious and sophisticated",
        preview: "linear-gradient(135deg, #064E3B 0%, #10B981 50%, #D1FAE5 100%)",
        primaryColor: "#064E3B",
        secondaryColor: "#F0FDF4",
        accentColor: "#10B981",
        backgroundColor: "#FFFFFF",
        textColor: "#064E3B",
        fontFamily: "Inter",
      },
      {
        id: "sunsetOrange",
        name: "Sunset Orange",
        description: "Warm orange with coral - energetic and vibrant",
        preview: "linear-gradient(135deg, #7C2D12 0%, #F97316 50%, #FFEDD5 100%)",
        primaryColor: "#7C2D12",
        secondaryColor: "#FFF7ED",
        accentColor: "#F97316",
        backgroundColor: "#FFFFFF",
        textColor: "#7C2D12",
        fontFamily: "Inter",
      },
      {
        id: "midnightBlue",
        name: "Midnight Blue",
        description: "Deep blue with cyan highlights - cool and professional",
        preview: "linear-gradient(135deg, #0C4A6E 0%, #06B6D4 50%, #E0F2FE 100%)",
        primaryColor: "#0C4A6E",
        secondaryColor: "#F0F9FF",
        accentColor: "#06B6D4",
        backgroundColor: "#FFFFFF",
        textColor: "#0C4A6E",
        fontFamily: "Inter",
      },
    ],
  },
  {
    id: "christmas",
    name: "Christmas",
    description: "Festive holiday theme with warm colors, snowfall effects, and seasonal cheer",
    icon: "🎄",
    bestFor: ["Holiday Promotions", "Seasonal Services", "Christmas Specials", "Festive Events"],
    features: ["Snowfall animation", "Holiday emojis", "Festive gradient borders", "Gold accents"],
    defaultColorScheme: "holiday",
    colorSchemes: [
      {
        id: "holiday",
        name: "Holiday Magic",
        description: "Traditional Christmas red and green",
        preview: "linear-gradient(135deg, #B30000 0%, #165B33 50%, #F8B229 100%)",
        primaryColor: "#B30000",
        secondaryColor: "#165B33",
        accentColor: "#F8B229",
        backgroundColor: "#FFFAF0",
        textColor: "#2C1810",
        fontFamily: "Georgia",
      },
      {
        id: "winter",
        name: "Winter Wonderland",
        description: "Cool winter blue and silver",
        preview: "linear-gradient(135deg, #0284C7 0%, #F0F9FF 100%)",
        primaryColor: "#0284C7",
        secondaryColor: "#F0F9FF",
        accentColor: "#BAE6FD",
        backgroundColor: "#FEFEFE",
        textColor: "#0C4A6E",
        fontFamily: "Montserrat",
      },
      {
        id: "goldenchristmas",
        name: "Golden Christmas",
        description: "Luxurious gold and deep burgundy with ivory accents",
        preview: "linear-gradient(135deg, #8B0000 0%, #FFD700 50%, #FFFFF0 100%)",
        primaryColor: "#8B0000",
        secondaryColor: "#FFD700",
        accentColor: "#FFA500",
        backgroundColor: "#FFFFF0",
        textColor: "#3C1414",
        fontFamily: "Playfair Display",
      },
      {
        id: "frostynight",
        name: "Frosty Night",
        description: "Deep navy and icy blue with silver sparkles",
        preview: "linear-gradient(135deg, #1E3A8A 0%, #60A5FA 50%, #E0F2FE 100%)",
        primaryColor: "#1E3A8A",
        secondaryColor: "#60A5FA",
        accentColor: "#C0C0C0",
        backgroundColor: "#F8FAFC",
        textColor: "#1E293B",
        fontFamily: "Raleway",
      },
      {
        id: "candycane",
        name: "Candy Cane",
        description: "Playful red and white stripes with mint green accents",
        preview: "linear-gradient(135deg, #DC2626 0%, #FFFFFF 50%, #10B981 100%)",
        primaryColor: "#DC2626",
        secondaryColor: "#FFFFFF",
        accentColor: "#10B981",
        backgroundColor: "#FFF1F2",
        textColor: "#450A0A",
        fontFamily: "Comic Sans MS",
      },
      {
        id: "pinecone",
        name: "Pine Cone",
        description: "Earthy brown and forest green with warm copper",
        preview: "linear-gradient(135deg, #78350F 0%, #047857 50%, #B45309 100%)",
        primaryColor: "#78350F",
        secondaryColor: "#047857",
        accentColor: "#B45309",
        backgroundColor: "#FEF3C7",
        textColor: "#422006",
        fontFamily: "Merriweather",
      },
      {
        id: "snowyrose",
        name: "Snowy Rose",
        description: "Soft pink and snowy white with rose gold shimmer",
        preview: "linear-gradient(135deg, #BE185D 0%, #FDF2F8 50%, #E879F9 100%)",
        primaryColor: "#BE185D",
        secondaryColor: "#FDF2F8",
        accentColor: "#EC4899",
        backgroundColor: "#FFF5F7",
        textColor: "#831843",
        fontFamily: "Lora",
      },
      {
        id: "northernlights",
        name: "Northern Lights",
        description: "Magical teal and purple aurora with silver highlights",
        preview: "linear-gradient(135deg, #0D9488 0%, #8B5CF6 50%, #C4B5FD 100%)",
        primaryColor: "#0D9488",
        secondaryColor: "#8B5CF6",
        accentColor: "#C4B5FD",
        backgroundColor: "#F5F3FF",
        textColor: "#4C1D95",
        fontFamily: "Poppins",
      },
      {
        id: "gingerbread",
        name: "Gingerbread House",
        description: "Warm gingerbread brown with cream and cherry red",
        preview: "linear-gradient(135deg, #92400E 0%, #FEF3C7 50%, #DC2626 100%)",
        primaryColor: "#92400E",
        secondaryColor: "#FEF3C7",
        accentColor: "#DC2626",
        backgroundColor: "#FFFBEB",
        textColor: "#451A03",
        fontFamily: "Georgia",
      },
      {
        id: "silverbell",
        name: "Silver Bell",
        description: "Elegant silver and charcoal with crystal blue accents",
        preview: "linear-gradient(135deg, #374151 0%, #D1D5DB 50%, #93C5FD 100%)",
        primaryColor: "#374151",
        secondaryColor: "#D1D5DB",
        accentColor: "#93C5FD",
        backgroundColor: "#F9FAFB",
        textColor: "#111827",
        fontFamily: "Inter",
      },
    ],
  },
  {
    id: "tetholiday",
    name: "Tết Holiday",
    description: "Vietnamese Lunar New Year theme with elegant red & gold, falling blossoms, and prosperity vibes",
    icon: "🧧",
    bestFor: ["Lunar New Year", "Vietnamese Market", "Spring Festival", "Asian Celebrations"],
    features: ["Falling flower petals", "Lucky red envelopes", "Gold coin patterns", "Prosperity blessings"],
    defaultColorScheme: "prosperity",
    colorSchemes: [
      {
        id: "prosperity",
        name: "Prosperity Gold",
        description: "Traditional red velvet and lucky gold",
        preview: "linear-gradient(135deg, #C62828 0%, #FFD700 50%, #FFFDE7 100%)",
        primaryColor: "#C62828",
        secondaryColor: "#FFD700",
        accentColor: "#FFFDE7",
        backgroundColor: "#FFFAF0",
        textColor: "#4E342E",
        fontFamily: "Georgia",
      },
      {
        id: "peachblossom",
        name: "Peach Blossom",
        description: "Soft pink peach blossoms with gold accents",
        preview: "linear-gradient(135deg, #EC407A 0%, #FFB6C1 50%, #FFFAF0 100%)",
        primaryColor: "#EC407A",
        secondaryColor: "#FFD700",
        accentColor: "#FFB6C1",
        backgroundColor: "#FFF5F7",
        textColor: "#4E342E",
        fontFamily: "Georgia",
      },
      {
        id: "apricotgold",
        name: "Apricot Gold",
        description: "Golden apricot blossoms with deep red",
        preview: "linear-gradient(135deg, #FFA500 0%, #FFD700 50%, #C62828 100%)",
        primaryColor: "#FFA500",
        secondaryColor: "#FFD700",
        accentColor: "#C62828",
        backgroundColor: "#FFFBEB",
        textColor: "#451A03",
        fontFamily: "Georgia",
      },
      {
        id: "royaltet",
        name: "Royal Tết",
        description: "Deep burgundy and imperial gold",
        preview: "linear-gradient(135deg, #7F0000 0%, #FFD700 50%, #FFFFF0 100%)",
        primaryColor: "#7F0000",
        secondaryColor: "#FFD700",
        accentColor: "#FFA500",
        backgroundColor: "#FFFFF0",
        textColor: "#3C1414",
        fontFamily: "Playfair Display",
      },
      {
        id: "fortunered",
        name: "Fortune Red",
        description: "Vibrant lucky red with golden highlights",
        preview: "linear-gradient(135deg, #D32F2F 0%, #FFEB3B 50%, #FFF9C4 100%)",
        primaryColor: "#D32F2F",
        secondaryColor: "#FFEB3B",
        accentColor: "#FFA000",
        backgroundColor: "#FFFDE7",
        textColor: "#4E342E",
        fontFamily: "Inter",
      },
    ],
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
