import { redirect } from "next/navigation";
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
        <p className="mt-4 text-neutral-300">Signed in as: {session.email}</p>
      </section>
    </main>
  );
}
