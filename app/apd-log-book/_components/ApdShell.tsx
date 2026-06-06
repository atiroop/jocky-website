import Link from "next/link";
import { getAdminSession } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/apd-log-book", label: "Dashboard" },
  { href: "/apd-log-book/new", label: "New entry" },
  { href: "/apd-log-book/logs", label: "Logs" },
];

export default async function ApdShell({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0B1220] text-slate-100">
      <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-[#0B1220]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-14 flex items-center justify-between gap-4">
          <Link href="/apd-log-book" className="flex items-center gap-1 group shrink-0">
            <span className="text-slate-600 font-mono group-hover:text-green-400 transition-colors">{"<"}</span>
            <span className="text-white font-semibold text-sm tracking-tight">APD Log Book</span>
            <span className="text-slate-600 font-mono group-hover:text-green-400 transition-colors">{"/>"}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/admin"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors truncate max-w-[11rem]"
          >
            {session.email}
          </Link>
        </div>
        <nav className="md:hidden max-w-6xl mx-auto px-5 pb-3 flex items-center gap-2 overflow-x-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10">{children}</main>
    </div>
  );
}
