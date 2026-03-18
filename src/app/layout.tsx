import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MainLayout from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Habitopia | Productivity RPG",
  description: "The self-generating productivity RPG system.",
};

import PageTransitionWrapper from "@/components/ui/PageTransitionWrapper";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TimerProvider } from "@/components/providers/TimerProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background font-sans font-feature-settings-['ss01']`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <TimerProvider>
            <Sidebar />
<<<<<<< HEAD
            <main
              style={{ paddingLeft: "var(--sidebar-width)" }}
              className="pb-32 md:pb-0 min-h-screen flex flex-col transition-[padding-left] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-[padding-left]"
            >
=======
            <MainLayout>
>>>>>>> origin/jidan
              {children}
            </MainLayout>
            <Toaster />
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
