"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{
                    duration: 0.4,
                    ease: [0.22, 1, 0.36, 1], // Custom cubic-bezier
                }}
                className="w-full flex-1"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
