"use client";

import { motion } from "framer-motion";

export default function DashboardAnimations({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0, scale: 0.98, y: 10 },
                visible: {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.1,
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200,
                        damping: 25
                    }
                }
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
