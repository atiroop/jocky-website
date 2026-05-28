import type { Metadata } from "next";
import { Noto_Sans_Thai_Looped, Libre_Bodoni } from "next/font/google";
import "./globals.css";

const notoSansThaiLooped = Noto_Sans_Thai_Looped({
  variable: "--font-main",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const libreBodoni = Libre_Bodoni({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
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
    <html lang="th" className={`${notoSansThaiLooped.variable} ${libreBodoni.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
