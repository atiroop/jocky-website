import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/apd", label: "ภาพรวม" },
  { href: "/apd/new", label: "บันทึกใหม่" },
  { href: "/apd/logs", label: "รายการบันทึก" },
];

export default async function ApdShell({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#EEF3FF_0%,#F6F8FF_48%,#F4EDFF_100%)] text-[#111827]">
      <header className="sticky top-0 z-30 border-b border-[#E5EAF5]/90 bg-white/80 shadow-[0_8px_30px_rgba(31,41,55,0.06)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/apd" className="flex items-center gap-1 group shrink-0">
            <span className="text-[#8B5CF6] font-mono group-hover:text-[#2F6BFF] transition-colors">{"<"}</span>
            <span className="text-[#111827] font-semibold text-sm tracking-tight">สมุดบันทึก APD</span>
            <span className="text-[#8B5CF6] font-mono group-hover:text-[#2F6BFF] transition-colors">{"/>"}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#6B7280] hover:bg-[#EEF3FF] hover:text-[#2F6BFF] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/admin"
            className="rounded-full bg-[#F8FAFF] px-3 py-1.5 text-xs font-medium text-[#6B7280] ring-1 ring-[#E5EAF5] hover:text-[#2F6BFF] transition-colors truncate max-w-[11rem]"
          >
            {session.email}
          </Link>
        </div>
        <nav className="md:hidden max-w-7xl mx-auto px-5 pb-3 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#D8E0F0] bg-white/70 px-3 py-1.5 text-xs font-medium text-[#6B7280] whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-5 md:px-8 py-8 md:py-10">{children}</main>
    </div>
  );
}
