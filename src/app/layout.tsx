import type { Metadata } from "next";
import { Sora, Space_Mono } from "next/font/google";
import { Providers } from "@/app/providers";
import { TopNav } from "@/components/layout/top-nav";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaSStarter Boilerplate",
  description: "Reusable Next.js SaaS boilerplate with Firebase auth, Firestore, and Stripe subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${sora.variable} ${spaceMono.variable} min-h-screen antialiased`}>
        <Providers>
          <TopNav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
