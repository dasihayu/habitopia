"use client";

import { motion } from "framer-motion";

export default function DashboardAnimations({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                        delayChildren: 0.1,
                    }
                }
            }}
            className="w-full"
        >
            {children}
        </motion.div>
    );
}
