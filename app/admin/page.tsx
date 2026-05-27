import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";

export default async function AdminPage() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-16">
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Jocky CMS Admin</h1>
        <p className="mt-4 text-neutral-400 text-sm">Signed in as: {session.email}</p>
        <nav className="mt-8 flex flex-col gap-3">
          <Link
            href="/admin/posts"
            className="flex items-center gap-3 rounded-xl border border-neutral-700 bg-neutral-800/50 px-5 py-4 hover:bg-neutral-800 transition-colors"
          >
            <span className="text-lg">📝</span>
            <div>
              <p className="font-medium">Posts</p>
              <p className="text-xs text-neutral-400 mt-0.5">Create and manage posts</p>
            </div>
          </Link>
        </nav>
      </section>
    </main>
  );
}
