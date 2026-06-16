import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";
import Header from "@/components/domain/layout/Header"
import AuthProvider from "@/components/domain/auth/AuthProvider";

import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: "MoviePod",
  description: "Next.js 기본기를 위한 영화 추천 서비스",
};

export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="dark">
      <body className={`${bebasNeue.variable} antialiased`}>
        <Toaster richColors position="top-right" theme='system' />
        <AuthProvider>
          <Header />

          <main className=" container mx-auto px-4 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
