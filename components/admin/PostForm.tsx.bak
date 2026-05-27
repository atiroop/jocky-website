"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug";

type PostFormProps = {
  initialData?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
  };
};

export default function PostForm({ initialData }: PostFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED">(
    initialData?.status ?? "DRAFT"
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      setSlug(generateSlug(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const url = isEditing
      ? `/api/admin/posts/${initialData!.id}`
      : "/api/admin/posts";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, content, status }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Something went wrong");
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setSaving(true);
    await fetch(`/api/admin/posts/${initialData!.id}`, { method: "DELETE" });
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 text-sm">
          {error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          required
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Post title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          required
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="post-slug"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Excerpt
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Short description (optional)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={16}
          className="w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-white/20"
          placeholder="Write your post content here..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-1">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "DRAFT" | "PUBLISHED")}
          className="rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-white text-neutral-950 px-5 py-2.5 text-sm font-medium hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : isEditing ? "Update Post" : "Create Post"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={saving}
            className="rounded-lg border border-red-700 text-red-400 px-5 py-2.5 text-sm font-medium hover:bg-red-900/30 transition-colors disabled:opacity-50"
          >
            Delete
          </button>
        )}

        <a
          href="/admin/posts"
          className="text-sm text-neutral-400 hover:text-white transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
