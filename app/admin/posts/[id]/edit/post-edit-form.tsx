"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "../../components/RichTextEditor";

type PostStatus = "DRAFT" | "PUBLISHED";

type EditPostFormProps = {
  postId: number;
  initialData: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    status: PostStatus;
    seoTitle: string;
    seoDesc: string;
  };
};

type ErrorResponse = { error?: string };

export default function EditPostForm({ postId, initialData }: EditPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title);
  const [slug, setSlug] = useState(initialData.slug);
  const [excerpt, setExcerpt] = useState(initialData.excerpt);
  const [content, setContent] = useState(initialData.content);
  const [status, setStatus] = useState<PostStatus>(initialData.status);
  const [seoTitle, setSeoTitle] = useState(initialData.seoTitle);
  const [seoDesc, setSeoDesc] = useState(initialData.seoDesc);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          status,
          seoTitle,
          seoDesc,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as ErrorResponse;
        setErrorMessage(data.error ?? "Failed to update post");
        return;
      }

      setSuccessMessage("Post updated successfully. Redirecting...");
      router.push("/admin/posts");
      router.refresh();
    } catch {
      setErrorMessage("Unexpected error while updating post");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-16 text-white">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-xl shadow-black/30">
        <p className="text-xs uppercase tracking-[0.24em] text-neutral-400">Jocky CMS</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Edit Post</h1>

        <form className="mt-8 space-y-4" onSubmit={onSubmit}>
          <Input id="title" label="Title" value={title} onChange={setTitle} required />
          <Input id="slug" label="Slug" value={slug} onChange={setSlug} required />
          <Input id="excerpt" label="Excerpt" value={excerpt} onChange={setExcerpt} />

          <div>
            <label htmlFor="content" className="mb-2 block text-sm text-neutral-300">
              Content
            </label>
            <RichTextEditor id="content" value={content} onChange={setContent} />
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm text-neutral-300">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(event) => setStatus(event.target.value as PostStatus)}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
            </select>
          </div>

          <Input id="seoTitle" label="SEO Title" value={seoTitle} onChange={setSeoTitle} />
          <Input id="seoDesc" label="SEO Description" value={seoDesc} onChange={setSeoDesc} />

          {errorMessage ? <p className="text-sm text-red-400">{errorMessage}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-400">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Updating..." : "Update Post"}
          </button>
        </form>

        <div className="mt-6">
          <Link href="/admin/posts" className="text-sm text-neutral-300 underline hover:text-white">
            ← Back to Posts
          </Link>
        </div>
      </section>
    </main>
  );
}

type InputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function Input({ id, label, value, onChange, required }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-neutral-300">
        {label}
      </label>
      <input
        id={id}
        type="text"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm outline-none focus:border-neutral-400"
      />
    </div>
  );
}
