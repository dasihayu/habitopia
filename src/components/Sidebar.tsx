"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
    LayoutDashboard,
    Sword,
    Trophy,
    User,
    Settings,
    Timer,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Sun,
    Moon,
    Plus,
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quests", label: "Quests", icon: Sword },
    { href: "/focus", label: "Focus Mode", icon: Timer },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Handle responsive and mounting
    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Don't show sidebar on auth/onboarding/landing pages
    const isAuthPage = ["/", "/login", "/register", "/onboarding"].includes(
        pathname
    );
    if (isAuthPage) return null;

    return (
        <>
            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 md:hidden">
                <div className="glass flex items-center justify-around p-3 rounded-2xl border-white/10 shadow-lg bg-background/80 backdrop-blur-md">
                    {NAV_ITEMS.map(({ href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "p-3 rounded-xl transition-all",
                                    isActive
                                        ? "bg-primary/20 text-primary shadow-glow ring-1 ring-primary/30"
                                        : "text-foreground/50 hover:text-foreground/80 hover:bg-muted"
                                )}
                            >
                                <Icon className="w-6 h-6" />
                            </Link>
                        );
                    })}
                    <Link
                        href="/settings"
                        className="p-3 rounded-xl text-foreground/50 hover:text-foreground/80 hover:bg-muted"
                    >
                        <Settings className="w-6 h-6" />
                    </Link>
                </div>
            </nav>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="fixed top-0 left-0 h-screen hidden md:flex flex-col z-50 border-r border-border bg-background/50 backdrop-blur-xl overflow-hidden"
            >
                {/* Header / Toggle */}
                <motion.div
                    layout
                    className={cn(
                        "flex border-b border-border/50 shrink-0 overflow-hidden",
                        isCollapsed ? "flex-col items-center justify-center py-4 gap-4" : "h-20 flex-row items-center justify-between px-4"
                    )}
                >
                    <motion.div layout className="flex items-center overflow-hidden whitespace-nowrap shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white shadow-glow shrink-0">
                            H
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    layout
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="font-bold text-lg tracking-tight pl-3"
                                >
                                    Habitopia
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    <motion.button
                        layout
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors shrink-0 flex items-center justify-center"
                    >
                        <motion.div
                            animate={{ rotate: isCollapsed ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </motion.div>
                    </motion.button>
                </motion.div>

                {/* Navigation */}
                <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center p-2 rounded-xl transition-all group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary font-bold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 rounded-xl"
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <div className="w-8 h-8 flex items-center justify-center shrink-0 relative z-10">
                                    <Icon className={cn("w-6 h-6", isActive && "text-primary")} />
                                </div>
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                            animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                            exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="whitespace-nowrap overflow-hidden relative z-10"
                                        >
                                            {label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border/50 space-y-2 overflow-x-hidden">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                        className="flex items-center p-2 rounded-xl w-full transition-all text-muted-foreground hover:text-foreground hover:bg-muted overflow-hidden"
                    >
                        <div className="w-8 flex h-8 shrink-0 items-center justify-center relative">
                            {mounted ? (
                                <>
                                    <Sun className="absolute h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </>
                            ) : (
                                <Sun className="absolute h-6 w-6" /> // Placeholder until mounted
                            )}
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                    animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="whitespace-nowrap overflow-hidden text-sm"
                                >
                                    Toggle Theme
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>

                    {/* Settings */}
                    <Link
                        href="/settings"
                        className="flex items-center p-2 rounded-xl w-full transition-all text-muted-foreground hover:text-foreground hover:bg-muted overflow-hidden"
                    >
                        <div className="w-8 h-8 flex shrink-0 items-center justify-center relative">
                            <Settings className="w-6 h-6" />
                        </div>
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                    animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                    exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="whitespace-nowrap overflow-hidden"
                                >
                                    Settings
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Logout */}
                    <form action={logout}>
                        <button
                            className="flex items-center p-2 rounded-xl w-full transition-all text-red-500/70 hover:text-red-500 hover:bg-red-500/10 overflow-hidden"
                        >
                            <div className="w-8 h-8 flex shrink-0 items-center justify-center relative">
                                <LogOut className="w-6 h-6" />
                            </div>
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                                        animate={{ opacity: 1, width: "auto", marginLeft: 12 }}
                                        exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="whitespace-nowrap overflow-hidden"
                                    >
                                        Logout
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </form>
                </div>
            </motion.aside>
        </>
    );
}
