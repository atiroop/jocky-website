import type { Metadata } from "next";
import { Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_Thai_Looped({
  variable: "--font-main",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jocky — Headless CMS for Developers",
    template: "%s — Jocky",
  },
  description:
    "A minimal headless CMS with REST API, TypeScript SDK, and self-hosted deployment. Built for developers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoSans.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
