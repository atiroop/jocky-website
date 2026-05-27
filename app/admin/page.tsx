import AdminShell from "@/components/admin/AdminShell";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [totalPosts, publishedPosts, draftPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
  ]);

  return (
    <AdminShell>
      <div className="px-8 py-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-1">Dashboard</h1>
        <p className="text-neutral-400 text-sm mb-8">Welcome back, {session.email}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total Posts", value: totalPosts },
            { label: "Published", value: publishedPosts },
            { label: "Drafts", value: draftPosts },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-neutral-800 bg-neutral-900/50 px-5 py-4">
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-neutral-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <Link
            href="/admin/posts/new"
            className="rounded-lg bg-white text-neutral-950 px-4 py-2 text-sm font-medium hover:bg-neutral-200 transition-colors"
          >
            + New Post
          </Link>
          <Link
            href="/admin/posts"
            className="rounded-lg border border-neutral-700 text-neutral-300 px-4 py-2 text-sm font-medium hover:border-neutral-500 hover:text-white transition-colors"
          >
            View all posts
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
