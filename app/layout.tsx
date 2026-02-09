import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
export const metadata = {
  title: "Nama Website | Keyword Utama",
  description:
    "Deskripsi jelas, manusiawi, ada keyword utama, max 160 karakter",
  keywords: [
    "keyword utama",
    "next js",
    "vercel",
    "nama brand"
  ],
  authors: [{ name: "kasyaf" }],
  openGraph: {
    title: "kasyaf cv",
    description: "saya ahli dalam bidang programer dan cyber security",
    url: "https://kasyaf-cv.vercel.app",
    siteName: "CV Kasyaf",
    images: ["/og.png"],
    locale: "id_ID",
    type: "website"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
