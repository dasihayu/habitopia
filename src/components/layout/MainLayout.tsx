"use client";

import { usePathname } from "next/navigation";
import { LazyMotion } from "framer-motion";

const loadFeatures = () => import("@/lib/framer-features").then(res => res.default);

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = ["/", "/login", "/register", "/onboarding"].includes(pathname);

    return (
        <main
            suppressHydrationWarning
            className="pb-32 pt-20 md:pt-0 md:pb-0 min-h-screen flex flex-col"
            style={{
                paddingLeft: isAuthPage ? "0px" : "var(--sidebar-width)",
                transition: "padding-left 300ms cubic-bezier(0.22, 1, 0.36, 1)",
                willChange: "padding-left",
            }}
        >
            <LazyMotion features={loadFeatures} strict>
                {children}
            </LazyMotion>
        </main>
    );
}
