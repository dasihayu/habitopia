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
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quests", label: "Quests", icon: Sword },
    { href: "/focus", label: "Focus Mode", icon: Timer },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive
    useEffect(() => {
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
    const isAuthPage = ["/", "/login", "/register", "/onboarding"].includes(pathname);

    // Sync CSS variable for main layout padding
    useEffect(() => {
        const targetWidth = (isMobile || isAuthPage) ? '0px' : (isCollapsed ? '80px' : '256px');
        document.documentElement.style.setProperty('--sidebar-width', targetWidth);
    }, [isCollapsed, isMobile, isAuthPage]); // Dependency on isAuthPage (stable bool) instead of pathname

    if (isAuthPage) return null;

    return (
        <>
            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 w-full z-[100] px-4 pb-6 md:hidden">
                <div className="glass flex items-center justify-around p-3 rounded-2xl border-white/10 shadow-2xl bg-background/80 backdrop-blur-md">
                    {NAV_ITEMS.map(({ href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "p-3 rounded-xl transition-all hover:scale-110 active:scale-95",
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
                        className="p-3 rounded-xl text-foreground/50 hover:text-foreground/80 hover:bg-muted transition-all hover:scale-110 active:scale-95"
                    >
                        <Settings className="w-6 h-6" />
                    </Link>
                </div>
            </nav>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={cn(
                    "fixed top-0 left-0 h-screen hidden md:flex flex-col z-50 border-r border-border bg-background/50 backdrop-blur-xl"
                )}
            >
                {/* Header / Toggle */}
                <div className={cn(
                    "flex border-b border-border/50 relative overflow-hidden shrink-0 transition-all duration-200",
                    isCollapsed ? "flex-col items-center justify-center h-28 gap-4 py-4" : "flex-row items-center h-20 px-4"
                )}>
                    <motion.div layout className="flex items-center justify-center shrink-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white shadow-glow shrink-0 relative z-10">
                            H
                        </div>
                    </motion.div>

                    <AnimatePresence mode="popLayout" initial={false}>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center gap-3 overflow-hidden flex-1 ml-3"
                            >
                                <span className="font-bold text-lg tracking-tight whitespace-nowrap text-foreground">Habitopia</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "p-2 hover:bg-foreground/5 rounded-lg text-muted-foreground transition-all duration-200 ease-out hover:text-foreground active:scale-95 shrink-0 z-10",
                            isCollapsed ? "" : "ml-auto"
                        )}
                    >
                        <ChevronLeft className={cn("w-5 h-5 transition-transform duration-300", isCollapsed && "rotate-180")} />
                    </button>
                </div>

                {/* Navigation */}
                <LayoutGroup>
                    <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                            const isActive = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={cn(
                                        "flex items-center h-12 rounded-xl group relative overflow-hidden transition-colors duration-200",
                                        isActive
                                            ? "bg-primary/10 text-primary font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-primary/20"
                                            : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl pointer-events-none"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}

                                    {/* Icon Container - Fixed width keeps icon position stable relative to sidebar edge */}
                                    <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                                        <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                    </div>

                                    <AnimatePresence mode="popLayout" initial={false}>
                                        {!isCollapsed && (
                                            <motion.span
                                                layout
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -10 }}
                                                transition={{ duration: 0.2 }}
                                                className="whitespace-nowrap relative z-10 overflow-hidden text-sm"
                                            >
                                                {label}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            );
                        })}
                    </div>
                </LayoutGroup>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border/50 space-y-2 shrink-0">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="flex items-center h-12 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 relative overflow-hidden group cursor-pointer transition-colors duration-200"
                    >
                        <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                            <div className="relative w-6 h-6 transition-transform group-hover:scale-110">
                                <Sun className="w-6 h-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                                <Moon className="w-6 h-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                            </div>
                        </div>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
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
                        className="flex items-center h-12 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 relative overflow-hidden group transition-colors duration-200"
                    >
                        <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                            <Settings className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </div>
                        <AnimatePresence mode="popLayout" initial={false}>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="whitespace-nowrap overflow-hidden text-sm"
                                >
                                    Settings
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>

                    {/* Logout */}
                    <form action={logout}>
                        <button
                            className="flex items-center h-12 rounded-xl w-full text-red-500/70 hover:text-red-500 hover:bg-red-500/10 relative overflow-hidden group cursor-pointer transition-colors duration-200"
                        >
                            <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                                <LogOut className="w-6 h-6 transition-transform group-hover:scale-110" />
                            </div>
                            <AnimatePresence mode="popLayout" initial={false}>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        transition={{ duration: 0.2 }}
                                        className="whitespace-nowrap overflow-hidden text-sm font-medium"
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
