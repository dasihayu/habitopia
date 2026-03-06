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
            <aside
                className={cn(
                    "fixed top-0 left-0 h-screen hidden md:flex flex-col z-50 transition-all duration-300 ease-in-out border-r border-border bg-background/50 backdrop-blur-xl",
                    isCollapsed ? "w-20" : "w-64"
                )}
            >
                {/* Header / Toggle */}
                <div className="p-4 flex items-center justify-between h-20 border-b border-border/50">
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white shadow-glow">
                                    H
                                </div>
                                <span className="font-bold text-lg tracking-tight">Habitopia</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-5 h-5" />
                        ) : (
                            <ChevronLeft className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Navigation */}
                <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                    {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary font-bold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary/10 rounded-xl"
                                    />
                                )}
                                <Icon className={cn("w-6 h-6 shrink-0", isActive && "text-primary")} />
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="whitespace-nowrap"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-border/50 space-y-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-xl w-full transition-all text-muted-foreground hover:text-foreground hover:bg-muted relative",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <div className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                            {mounted ? (
                                <>
                                    <Sun className="absolute h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </>
                            ) : (
                                <Sun className="absolute h-6 w-6" /> // Placeholder until mounted
                            )}
                        </div>
                        {!isCollapsed && (
                            <span className="text-sm">Toggle Theme</span>
                        )}
                    </button>

                    {/* Settings */}
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-xl w-full transition-all text-muted-foreground hover:text-foreground hover:bg-muted",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <Settings className="w-6 h-6" />
                        {!isCollapsed && <span>Settings</span>}
                    </Link>

                    {/* Logout */}
                    <form action={logout}>
                        <button
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-xl w-full transition-all text-red-500/70 hover:text-red-500 hover:bg-red-500/10",
                                isCollapsed && "justify-center"
                            )}
                        >
                            <LogOut className="w-6 h-6" />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
