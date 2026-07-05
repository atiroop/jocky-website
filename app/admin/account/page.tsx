import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminShell from "@/components/admin/AdminShell";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell>
      <div className="px-8 py-10 max-w-xl">
        <p className="text-neutral-500 text-xs mb-2">{session.email}</p>
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          บัญชีผู้ดูแล
        </h1>
        <p className="text-neutral-400 text-sm mb-8">
          เปลี่ยนรหัสผ่านสำหรับเข้า Jocky CMS และสมุดบันทึก APD
        </p>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/30 p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </AdminShell>
  );
}
