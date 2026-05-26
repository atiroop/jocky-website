"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  postId: number;
};

type ErrorResponse = {
  error?: string;
};

export default function DeletePostButton({ postId }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm("Are you sure you want to delete this post?");

    if (!confirmed || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });

      if (!response.ok) {
        const data = (await response.json()) as ErrorResponse;
        window.alert(data.error ?? "Failed to delete post");
        return;
      }

      router.refresh();
    } catch {
      window.alert("Unexpected error while deleting post");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      disabled={isDeleting}
      onClick={handleDelete}
      className="rounded-md border border-red-500/50 px-3 py-1.5 text-xs font-medium text-red-300 transition hover:border-red-400 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}
