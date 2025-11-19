import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Distinct Mentorship | Educational Excellence & Mentorship",
    template: "%s | Distinct Mentorship",
  },
  description:
    "Distinct Mentorship provides holiday tuition, boot camps, career talks, and guidance & counselling for students across Kenya.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Distinct Mentorship | Educational Excellence & Mentorship",
    description:
      "Structured mentorship, tuition, and counselling services designed to unlock every learner’s potential.",
    siteName: "Distinct Mentorship",
  },
  twitter: {
    card: "summary_large_image",
    title: "Distinct Mentorship | Educational Excellence & Mentorship",
    description:
      "Structured mentorship, tuition, and counselling services designed to unlock every learner’s potential.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
