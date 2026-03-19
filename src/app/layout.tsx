import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import PageTransitionWrapper from "@/components/ui/PageTransitionWrapper";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TimerProvider } from "@/components/providers/TimerProvider";
import { ClientProviders } from "@/components/providers/ClientProviders";

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
            <ClientProviders>
              <MainLayout>
                <PageTransitionWrapper>
                  {children}
                </PageTransitionWrapper>
              </MainLayout>
            </ClientProviders>
          </TimerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
