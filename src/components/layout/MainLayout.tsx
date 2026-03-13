"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const SIDEBAR_SPRING = { type: "spring" as const, stiffness: 280, damping: 32, mass: 1 };

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = ["/", "/login", "/register", "/onboarding"].includes(pathname);

    return (
        <motion.main
            initial={false}
            animate={{ 
                paddingLeft: isAuthPage ? "0px" : "var(--sidebar-width)" 
            }}
            transition={SIDEBAR_SPRING}
            className="pb-32 md:pb-0 min-h-screen flex flex-col will-change-[padding-left]"
        >
            {children}
        </motion.main>
    );
}
