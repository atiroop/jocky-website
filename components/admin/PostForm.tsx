"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { generateSlug } from "@/lib/slug";
import dynamic from "next/dynamic";
import { Toast, type ToastData } from "./Toast";

const PostEditor = dynamic(() => import("./PostEditor"), { ssr: false });

type PostFormProps = {
  initialData?: {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: "DRAFT" | "PUBLISHED";
    coverImage: string | null;
    seoTitle: string | null;
    seoDesc: string | null;
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
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage ?? null);
  const [seoTitle, setSeoTitle] = useState(initialData?.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(initialData?.seoDesc ?? "");
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [toast, setToast] = useState<ToastData | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    setUploadingCover(false);
    e.target.value = "";
    if (!res.ok) { showToast("error", "Cover image upload failed"); return; }
    const { url } = (await res.json()) as { url: string };
    setCoverImage(url);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEditing) {
      const generated = generateSlug(value);
      // Thai/non-ASCII titles produce an empty slug — fall back to a timestamp slug
      setSlug(generated || (value.trim() ? `post-${Date.now()}` : ""));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!content || content === "<p></p>") {
      setError("Content is required");
      return;
    }

    setSaving(true);

    const url = isEditing
      ? `/api/admin/posts/${initialData!.id}`
      : "/api/admin/posts";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, slug, excerpt, content, status, coverImage: coverImage ?? null, seoTitle: seoTitle || null, seoDesc: seoDesc || null }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? "Something went wrong");
      return;
    }

    showToast("success", isEditing ? "Post updated" : "Post created");
    setTimeout(() => { router.push("/admin/posts"); router.refresh(); }, 800);
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setSaving(true);
    const res = await fetch(`/api/admin/posts/${initialData!.id}`, { method: "DELETE" });
    setSaving(false);
    if (res.ok) { showToast("success", "Post deleted"); setTimeout(() => { router.push("/admin/posts"); router.refresh(); }, 800); } else { showToast("error", "Delete failed"); }
  }

  return (
    <>
      <Toast toast={toast} onDone={() => setToast(null)} />
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
        <PostEditor value={content} onChange={setContent} />
      </div>


        {/* Featured Image */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">Featured Image</label>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
          {coverImage ? (
            <div className="relative rounded-lg overflow-hidden border border-neutral-700 w-full max-w-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover" className="w-full h-44 object-cover" />
              <div className="absolute top-2 right-2 flex gap-2">
                <button type="button" onClick={() => coverInputRef.current?.click()}
                  className="rounded-lg bg-black/70 text-white px-3 py-1.5 text-xs hover:bg-black transition-colors">Change</button>
                <button type="button" onClick={() => setCoverImage(null)}
                  className="rounded-lg bg-black/70 text-red-400 px-3 py-1.5 text-xs hover:bg-black transition-colors">Remove</button>
              </div>
            </div>
          ) : (
            <button type="button" onClick={() => coverInputRef.current?.click()} disabled={uploadingCover}
              className="flex items-center gap-2 rounded-lg border border-dashed border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white px-5 py-3 text-sm transition-colors disabled:opacity-50">
              {uploadingCover ? 'Uploading...' : 'Upload cover image'}
            </button>
          )}
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


        {/* SEO */}
        <details className="rounded-lg border border-neutral-800 overflow-hidden">
          <summary className="px-4 py-3 text-sm font-medium text-neutral-400 cursor-pointer hover:text-white hover:bg-neutral-800/50 transition-colors select-none">
            SEO Settings
          </summary>
          <div className="px-4 pb-4 pt-3 space-y-4 border-t border-neutral-800">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">SEO Title <span className="text-neutral-500 font-normal">(overrides title in search)</span></label>
              <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder={title || 'SEO title...'} maxLength={60} />
              <p className="mt-1 text-xs text-neutral-500">{seoTitle.length}/60</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Meta Description <span className="text-neutral-500 font-normal">(shown in search results)</span></label>
              <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={3}
                className="w-full rounded-lg bg-neutral-800 border border-neutral-700 text-white px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-white/20"
                placeholder={excerpt || 'Meta description...'} maxLength={160} />
              <p className="mt-1 text-xs text-neutral-500">{seoDesc.length}/160</p>
            </div>
          </div>
        </details>

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
    </>
  );
}
