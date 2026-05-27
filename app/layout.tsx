import type { Metadata } from "next";
import { Noto_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";

const notoSansThaiLooped = Noto_Sans_Thai_Looped({
  variable: "--font-main",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="th" className={notoSansThaiLooped.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
