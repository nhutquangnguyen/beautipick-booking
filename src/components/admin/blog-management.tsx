"use client";

import { useState } from "react";
import { BlogPost } from "@/types/database";
import { Plus, Edit, Trash2, Eye, Search, Calendar, Tag, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BlogPostEditor } from "./blog-post-editor";

interface BlogManagementProps {
  blogPosts: BlogPost[];
  userId: string;
}

export function BlogManagement({ blogPosts, userId }: BlogManagementProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const router = useRouter();

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags?.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleCreateNew = () => {
    setEditingPost(null);
    setShowEditor(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setShowEditor(true);
  };

  const handleTogglePublish = async (postId: string, currentStatus: boolean) => {
    const response = await fetch(`/api/admin/blog/${postId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        published: !currentStatus,
      }),
    });

    if (response.ok) {
      router.refresh();
    } else {
      alert("Failed to toggle publish status");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    const response = await fetch(`/api/admin/blog/${postId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.refresh();
    }
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingPost(null);
    router.refresh();
  };

  if (showEditor) {
    return <BlogPostEditor post={editingPost} userId={userId} onClose={handleCloseEditor} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                <p className="mt-2 text-gray-600">Manage SEO blog posts for beautipick.com</p>
              </div>
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="h-5 w-5" />
                Create New Post
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Posts</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{blogPosts.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Published</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {blogPosts.filter((p) => p.published).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Drafts</h3>
            <p className="mt-2 text-3xl font-bold text-gray-600">
              {blogPosts.filter((p) => !p.published).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts by title, excerpt, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Blog Posts List */}
        <div className="mt-6 space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
              <p className="text-gray-500">
                {searchTerm ? "No posts found matching your search" : "No blog posts yet. Create your first post!"}
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">{post.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded ${
                          post.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    {post.excerpt && (
                      <p className="mt-2 text-gray-600">{post.excerpt}</p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.created_at).toLocaleDateString()}
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {post.tags.join(", ")}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.view_count} views
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Publish Toggle */}
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">Publish</span>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(post.id, post.published)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          post.published ? "bg-green-600" : "bg-gray-300"
                        }`}
                        title={post.published ? "Click to unpublish" : "Click to publish"}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            post.published ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="View Blog Post"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleEdit(post)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
