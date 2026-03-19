"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamically import client-only components with ssr: false
const Sidebar = dynamic(() => import("@/components/Sidebar"), { ssr: false });
const Toaster = dynamic(() => import("sonner").then(mod => mod.Toaster), { ssr: false });

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      {children}
      <Toaster />
    </>
  );
}
