"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/admin/posts", label: "Posts", icon: "📝" },
];

export default function SidebarNav({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  return (
    <aside className="w-52 shrink-0 min-h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-8">
        <Link href="/admin" className="block text-white font-semibold text-sm tracking-wide">
          Jocky CMS
        </Link>
        <p className="text-neutral-500 text-xs mt-1 truncate">{email}</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-neutral-800 text-white font-medium"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-1 space-y-1 mt-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-neutral-500 hover:text-white transition-colors"
        >
          <span>🌐</span> View site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-neutral-500 hover:text-red-400 transition-colors text-left"
        >
          <span>→</span> Sign out
        </button>
      </div>
    </aside>
  );
}
