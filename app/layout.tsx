import type { Metadata } from "next";
import { Cormorant_Garamond, Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

const notoSansThaiLooped = Noto_Sans_Thai_Looped({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Jocky — Journal",
    template: "%s — Jocky",
  },
  description: "พื้นที่สำหรับบันทึกความคิด บทความ และเรื่องเล่าส่วนตัว",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${cormorant.variable} ${notoSansThaiLooped.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
