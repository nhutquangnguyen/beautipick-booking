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
import { createClient } from "@/lib/supabase/client";
import { SocialLink, SocialLinkType } from "@/types/database";

// TikTok icon component (not available in lucide-react)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

// Zalo icon component
function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
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
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Your Links</h2>
            <p className="text-sm text-gray-500">Add social media and custom links to your booking page</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary btn-sm flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Link
          </button>
        </div>

        {links.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <LinkIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No links added yet</p>
            <p className="text-sm">Add your social media and other links</p>
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
              {loading ? "Saving..." : "Save Changes"}
            </button>
            {success && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingLink) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">
              {editingLink ? "Edit Link" : "Add New Link"}
            </h3>

            <div className="space-y-4">
              {/* Link Type Selection */}
              <div>
                <label className="label mb-2">Link Type</label>
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
                <label className="label">Button Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input mt-1"
                  placeholder={currentOption?.label || "Enter title"}
                />
              </div>

              {/* URL */}
              <div>
                <label className="label">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="input mt-1"
                  placeholder={currentOption?.placeholder || "https://..."}
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
                Cancel
              </button>
              <button
                onClick={editingLink ? handleUpdateLink : handleAddLink}
                disabled={!formData.url}
                className="btn btn-primary btn-md flex-1"
              >
                {editingLink ? "Update" : "Add Link"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
