import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import SidebarNav from "./SidebarNav";

export default async function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex">
      <SidebarNav email={session.email} />
      <div className="flex-1 overflow-auto min-w-0">
        {children}
      </div>
    </div>
  );
}
