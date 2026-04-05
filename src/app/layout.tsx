import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lawn Squad - Professional Lawn Care Services",
    template: "%s | Lawn Squad",
  },
  description:
    "Professional lawn care services including mowing, fertilization, weed control, aeration, and more. Get your free quote today.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://lawnsquad.yourfreequote.net",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
