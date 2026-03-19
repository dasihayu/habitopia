"use client";

import { m, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Same cinematic feel as desktop, but lighter values for mobile smoothness:
// y:8 (was 15), duration:0.28s (was 0.4s), exit y:-6 (no jarring upward jump)
export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait" initial={false}>
            <m.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{
                    duration: 0.28,
                    ease: [0.4, 0, 0.2, 1],
                }}
                style={{ willChange: "opacity, transform" }}
                className="w-full flex-1"
            >
                {children}
            </m.div>
        </AnimatePresence>
    );
}
