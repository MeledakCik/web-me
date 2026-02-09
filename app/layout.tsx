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

export const metadata: Metadata = {
  metadataBase: new URL("https://kasyaf-cv.vercel.app"),

  title: "Kasyaf CV | Programmer & Cyber Security",
  description:
    "CV Kasyaf – programmer dan cyber security specialist. Berpengalaman dalam web development, keamanan sistem, dan automation.",

  authors: [{ name: "Kasyaf" }],

  openGraph: {
    title: "Kasyaf CV | Programmer & Cyber Security",
    description:
      "CV Kasyaf – ahli di bidang programming dan cyber security, fokus pada web development dan keamanan sistem.",
    url: "https://kasyaf-cv.vercel.app",
    siteName: "CV Kasyaf",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "CV Kasyaf"
      }
    ],
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
