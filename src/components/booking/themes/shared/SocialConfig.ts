import { SocialLinkType } from "@/types/database";
import * as Icons from "./SocialIcons";

export const SOCIAL_LINK_CONFIG: Record<SocialLinkType, { icon: React.FC<{ className?: string }>; color: string }> = {
  instagram: { icon: Icons.InstagramIcon, color: "#E4405F" },
  facebook: { icon: Icons.FacebookIcon, color: "#1877F2" },
  tiktok: { icon: Icons.TikTokIcon, color: "#000000" },
  youtube: { icon: Icons.YouTubeIcon, color: "#FF0000" },
  twitter: { icon: Icons.TwitterIcon, color: "#000000" },
  whatsapp: { icon: Icons.WhatsAppIcon, color: "#25D366" },
  zalo: { icon: Icons.ZaloIcon, color: "#0068FF" },
  telegram: { icon: Icons.TelegramIcon, color: "#0088CC" },
  website: { icon: Icons.GlobeIcon, color: "#6366F1" },
  shopee: { icon: Icons.ShoppingBagIcon, color: "#EE4D2D" },
  lazada: { icon: Icons.ShoppingBagIcon, color: "#0F146D" },
  custom: { icon: Icons.LinkIcon, color: "#8B5CF6" },
};
