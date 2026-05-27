import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import PostForm from "@/components/admin/PostForm";

export default async function NewPostPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="px-8 py-10 max-w-3xl">
        <h1 className="text-2xl font-semibold tracking-tight mb-8">New Post</h1>
        <PostForm />
      </div>
    </AdminShell>
  );
}
