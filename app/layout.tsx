import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromoPack - Pharmaceutical Promotional Content Management",
  description: "Create and manage promotional content with automated claim extraction and reference linking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#1f2937',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              icon: '✅',
              style: {
                borderColor: '#10b981',
                background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)',
              },
            },
            error: {
              icon: '❌',
              style: {
                borderColor: '#ef4444',
                background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
              },
            },
            loading: {
              icon: '⏳',
              style: {
                borderColor: '#3b82f6',
                background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
