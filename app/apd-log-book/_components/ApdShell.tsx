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
    <div className="min-h-screen bg-[linear-gradient(135deg,#FDE6F3_0%,#ECE3FF_45%,#FFEDD9_100%)] text-[#18122B]">
      <header className="sticky top-0 z-30 border-b-[3px] border-[#18122B] bg-[linear-gradient(90deg,#6D28D9_0%,#DB2777_55%,#EA580C_100%)] shadow-[0_6px_0_0_rgba(24,18,43,0.15)]">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
          <Link href="/apd" className="flex items-center gap-2 group shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border-[3px] border-[#18122B] bg-[#FDE047] text-sm font-black text-[#18122B] shadow-[3px_3px_0_0_#18122B] group-hover:-translate-y-0.5 transition-transform">
              A
            </span>
            <span className="text-white font-black text-sm tracking-tight drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
              สมุดบันทึก APD
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-white/90 hover:bg-white hover:text-[#DB2777] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/admin"
            className="rounded-full border-[3px] border-[#18122B] bg-white px-3 py-1.5 text-xs font-bold text-[#18122B] shadow-[3px_3px_0_0_#18122B] hover:bg-[#FDE047] transition-colors truncate max-w-[11rem]"
          >
            {session.email}
          </Link>
        </div>
        <nav className="md:hidden max-w-7xl mx-auto px-5 pb-3 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border-[2px] border-white/60 bg-white/10 px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap"
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
