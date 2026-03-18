import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MainLayout from "@/components/layout/MainLayout";
import { cn } from "@/lib/utils";
import PageTransitionWrapper from "@/components/ui/PageTransitionWrapper";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TimerProvider } from "@/components/providers/TimerProvider";

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
            <MainLayout>
              <PageTransitionWrapper>
                {children}
              </PageTransitionWrapper>
            </MainLayout>
            <Toaster />
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
