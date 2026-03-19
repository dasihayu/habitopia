"use client";

import { m } from "framer-motion";

export default function DashboardAnimations({ children }: { children: React.ReactNode }) {
    return (
        <m.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, scale: 0.98, y: 10 },
                visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                        staggerChildren: 0.05,
                        delayChildren: 0.05,
                        duration: 0.4,
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                    }
                }
            }}
            className="w-full"
        >
            {children}
        </m.div>
    );
}
