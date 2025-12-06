"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  GripVertical,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  MessageCircle,
  Send,
  Globe,
  ShoppingBag,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { SocialLink, SocialLinkType } from "@/types/database";

// TikTok icon component (not available in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#000000" d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// Zalo icon component
function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 50 50" fill="none">
      <path fillRule="evenodd" clipRule="evenodd" d="M22.782 0.166016H27.199C33.2653 0.166016 36.8103 1.05701 39.9572 2.74421C43.1041 4.4314 45.5875 6.89585 47.2557 10.0428C48.9429 13.1897 49.8339 16.7347 49.8339 22.801V27.1991C49.8339 33.2654 48.9429 36.8104 47.2557 39.9573C45.5685 43.1042 43.1041 45.5877 39.9572 47.2559C36.8103 48.9431 33.2653 49.8341 27.199 49.8341H22.8009C16.7346 49.8341 13.1896 48.9431 10.0427 47.2559C6.89583 45.5687 4.41243 43.1042 2.7442 39.9573C1.057 36.8104 0.166016 33.2654 0.166016 27.1991V22.801C0.166016 16.7347 1.057 13.1897 2.7442 10.0428C4.43139 6.89585 6.89583 4.41245 10.0427 2.74421C13.1707 1.05701 16.7346 0.166016 22.782 0.166016Z" fill="#0068FF"/>
      <path opacity="0.12" fillRule="evenodd" clipRule="evenodd" d="M49.8336 26.4736V27.1994C49.8336 33.2657 48.9427 36.8107 47.2555 39.9576C45.5683 43.1045 43.1038 45.5879 39.9569 47.2562C36.81 48.9434 33.265 49.8344 27.1987 49.8344H22.8007C17.8369 49.8344 14.5612 49.2378 11.8104 48.0966L7.27539 43.4267L49.8336 26.4736Z" fill="#001A33"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z" fill="white"/>
      <path d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z" fill="#0068FF"/>
      <path d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z" fill="#0068FF"/>
      <path d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z" fill="#0068FF"/>
      <path d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z" fill="#0068FF"/>
      <path d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z" fill="#0068FF"/>
    </svg>
  );
}

const SOCIAL_LINK_OPTIONS: {
  type: SocialLinkType;
  label: string;
  icon: React.ReactNode;
  color: string;
  placeholder: string;
}[] = [
  {
    type: "instagram",
    label: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    color: "#E4405F",
    placeholder: "https://instagram.com/yourusername",
  },
  {
    type: "facebook",
    label: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    color: "#1877F2",
    placeholder: "https://facebook.com/yourpage",
  },
  {
    type: "tiktok",
    label: "TikTok",
    icon: <TikTokIcon className="h-5 w-5" />,
    color: "#000000",
    placeholder: "https://tiktok.com/@yourusername",
  },
  {
    type: "youtube",
    label: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
    color: "#FF0000",
    placeholder: "https://youtube.com/@yourchannel",
  },
  {
    type: "twitter",
    label: "X (Twitter)",
    icon: <Twitter className="h-5 w-5" />,
    color: "#000000",
    placeholder: "https://x.com/yourusername",
  },
  {
    type: "whatsapp",
    label: "WhatsApp",
    icon: <MessageCircle className="h-5 w-5" />,
    color: "#25D366",
    placeholder: "https://wa.me/84123456789",
  },
  {
    type: "zalo",
    label: "Zalo",
    icon: <ZaloIcon className="h-5 w-5" />,
    color: "#0068FF",
    placeholder: "https://zalo.me/0123456789",
  },
  {
    type: "telegram",
    label: "Telegram",
    icon: <Send className="h-5 w-5" />,
    color: "#0088CC",
    placeholder: "https://t.me/yourusername",
  },
  {
    type: "website",
    label: "Website",
    icon: <Globe className="h-5 w-5" />,
    color: "#6366F1",
    placeholder: "https://yourwebsite.com",
  },
  {
    type: "shopee",
    label: "Shopee",
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "#EE4D2D",
    placeholder: "https://shopee.vn/yourshop",
  },
  {
    type: "lazada",
    label: "Lazada",
    icon: <ShoppingBag className="h-5 w-5" />,
    color: "#0F146D",
    placeholder: "https://lazada.vn/shop/yourshop",
  },
  {
    type: "custom",
    label: "Custom Link",
    icon: <LinkIcon className="h-5 w-5" />,
    color: "#8B5CF6",
    placeholder: "https://example.com",
  },
];

export function SocialLinksManager({
  merchantId,
  socialLinks,
}: {
  merchantId: string;
  socialLinks: SocialLink[];
}) {
  const t = useTranslations("linksForm");
  const router = useRouter();
  const supabase = createClient();
  const [links, setLinks] = useState<SocialLink[]>(socialLinks);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  const [formData, setFormData] = useState({
    type: "instagram" as SocialLinkType,
    title: "",
    url: "",
  });

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      await supabase
        .from("merchants")
        .update({ social_links: links })
        .eq("id", merchantId);

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLink = () => {
    if (!formData.url) return;

    const option = SOCIAL_LINK_OPTIONS.find((o) => o.type === formData.type);
    const newLink: SocialLink = {
      id: crypto.randomUUID(),
      type: formData.type,
      title: formData.title || option?.label || "Link",
      url: formData.url,
    };

    setLinks([...links, newLink]);
    setFormData({ type: "instagram", title: "", url: "" });
    setShowAddModal(false);
  };

  const handleUpdateLink = () => {
    if (!editingLink || !formData.url) return;

    const option = SOCIAL_LINK_OPTIONS.find((o) => o.type === formData.type);
    const updatedLinks = links.map((link) =>
      link.id === editingLink.id
        ? {
            ...link,
            type: formData.type,
            title: formData.title || option?.label || "Link",
            url: formData.url,
          }
        : link
    );

    setLinks(updatedLinks);
    setEditingLink(null);
    setFormData({ type: "instagram", title: "", url: "" });
  };

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
  };

  const openEditModal = (link: SocialLink) => {
    setEditingLink(link);
    setFormData({
      type: link.type,
      title: link.title,
      url: link.url,
    });
  };

  const getLinkOption = (type: SocialLinkType) => {
    return SOCIAL_LINK_OPTIONS.find((o) => o.type === type);
  };

  const currentOption = SOCIAL_LINK_OPTIONS.find((o) => o.type === formData.type);

  return (
    <div className="space-y-6">
      {/* Links List */}
      <div className="card p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">{t("yourLinks")}</h2>
            <p className="text-sm text-gray-500">{t("yourLinksDesc")}</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("addLink")}
          </button>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{t("noLinks")}</p>
            <p className="text-sm">{t("addYourLinks")}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {links.map((link) => {
              const option = getLinkOption(link.type);
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="cursor-grab text-gray-400">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-white"
                    style={{ backgroundColor: option?.color || "#8B5CF6" }}
                  >
                    {option?.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{link.title}</p>
                    <p className="text-sm text-gray-500 truncate">{link.url}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => openEditModal(link)}
                      className="p-2 text-gray-400 hover:text-purple-600"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLink(link.id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {links.length > 0 && (
          <div className="flex items-center gap-3 mt-6 pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn btn-primary btn-md"
            >
              {loading ? t("saving") : t("saveChanges")}
            </button>
            {success && <span className="text-sm text-green-600">{t("saved")}</span>}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingLink) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingLink ? t("editLink") : t("addNewLink")}
            </h3>

            <div className="space-y-4">
              {/* Link Type Selection */}
              <div>
                <label className="label mb-2">{t("linkType")}</label>
                <div className="grid grid-cols-4 gap-2">
                  {SOCIAL_LINK_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      onClick={() => {
                        setFormData({
                          ...formData,
                          type: option.type,
                          title: formData.title || "",
                        });
                      }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-colors ${
                        formData.type === option.type
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                        style={{ backgroundColor: option.color }}
                      >
                        {option.icon}
                      </div>
                      <span className="text-xs text-gray-600 truncate w-full text-center">
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="label">{t("buttonTitle")}</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input mt-1"
                  placeholder={currentOption?.label || t("linkTitlePlaceholder")}
                />
              </div>

              {/* URL */}
              <div>
                <label className="label">{t("url")}</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="input mt-1"
                  placeholder={currentOption?.placeholder || t("linkUrlPlaceholder")}
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingLink(null);
                  setFormData({ type: "instagram", title: "", url: "" });
                }}
                className="btn btn-outline btn-md flex-1"
              >
                {t("cancel")}
              </button>
              <button
                onClick={editingLink ? handleUpdateLink : handleAddLink}
                disabled={!formData.url}
                className="btn btn-primary btn-md flex-1"
              >
                {editingLink ? t("update") : t("addLink")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
