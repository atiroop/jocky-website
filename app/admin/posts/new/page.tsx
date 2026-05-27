import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import PostForm from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-16">
      <section className="mx-auto w-full max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/posts"
            className="text-neutral-400 hover:text-white text-sm transition-colors"
          >
            ← Posts
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">New Post</h1>
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8">
          <PostForm />
        </div>
      </section>
    </main>
  );
}
