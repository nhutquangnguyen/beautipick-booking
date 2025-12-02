"use client";

import { useState, useEffect } from "react";
import { BlogPost } from "@/types/database";
import { X, Save, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

interface BlogPostEditorProps {
  post: BlogPost | null;
  userId: string;
  onClose: () => void;
}

export function BlogPostEditor({ post, userId, onClose }: BlogPostEditorProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    content: post?.content || "",
    cover_image: post?.cover_image || "",
    published: post?.published || false,
    meta_title: post?.meta_title || "",
    meta_description: post?.meta_description || "",
    meta_keywords: post?.meta_keywords?.join(", ") || "",
    tags: post?.tags?.join(", ") || "",
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  }, [formData.title, post]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        meta_keywords: formData.meta_keywords
          ? formData.meta_keywords.split(",").map((k) => k.trim())
          : null,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : null,
        author_id: post?.author_id || userId,
        published_at: formData.published && !post?.published
          ? new Date().toISOString()
          : post?.published_at,
      };

      const url = post
        ? `/api/admin/blog/${post.id}`
        : "/api/admin/blog";

      const response = await fetch(url, {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onClose();
      } else {
        alert("Failed to save blog post");
      }
    } catch (error) {
      console.error("Error saving blog post:", error);
      alert("Failed to save blog post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              {post ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="blog-post-form"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="blog-post-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter blog post title"
                />
              </div>

              <div>
                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  id="slug"
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  placeholder="url-friendly-slug"
                />
                <p className="mt-1 text-xs text-gray-500">
                  URL: beautipick.com/blog/{formData.slug || "your-slug"}
                </p>
              </div>

              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                  Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows={3}
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Short description (shown in blog list)"
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Content * (Markdown supported)
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  rows={15}
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                  placeholder="Write your blog content here... (supports Markdown)"
                />
              </div>

              <div>
                <label htmlFor="cover_image" className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  id="cover_image"
                  name="cover_image"
                  value={formData.cover_image}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="beauty, skincare, tips (comma-separated)"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <label htmlFor="published" className="text-sm font-medium text-gray-900">
                    Publication Status
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.published ? "This post is visible to the public" : "This post is saved as a draft"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, published: !prev.published }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    formData.published ? "bg-green-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.published ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="SEO title (defaults to post title)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.meta_title.length || formData.title.length}/60 characters
                </p>
              </div>

              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  rows={3}
                  value={formData.meta_description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="SEO description (shown in search results)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.meta_description.length}/160 characters
                </p>
              </div>

              <div>
                <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords
                </label>
                <input
                  type="text"
                  id="meta_keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
