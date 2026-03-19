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
} from "lucide-react";
import { logout } from "@/app/actions/auth";
import { cn } from "@/lib/utils";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/quests", label: "Quests", icon: Sword },
    { href: "/focus", label: "Focus Mode", icon: Timer },
    { href: "/achievements", label: "Achievements", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
];

const SIDEBAR_MOTION_SPRING = { type: "spring" as const, stiffness: 300, damping: 30, mass: 0.78 };
// Single constant — previously was a function creating a new object per render
const LABEL_TRANSITION = { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.72, delay: 0 };
const MICRO_TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const };

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle responsive — debounced to avoid per-pixel re-renders on drag
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsCollapsed(true);
        };
        let raf: number;
        const onResize = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(checkMobile); };
        checkMobile();
        window.addEventListener("resize", onResize, { passive: true });
        return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
    }, []);

    // Don't show sidebar on auth/onboarding/landing pages
    const isAuthPage = ["/", "/login", "/register", "/onboarding"].includes(pathname);

    // Stable reference — use module-level LABEL_TRANSITION constant directly

    // Sync layout offset with sidebar state (animate in CSS on main container).
    useEffect(() => {
        const targetWidth = (isMobile || isAuthPage) ? "0px" : (isCollapsed ? "80px" : "256px");
        document.documentElement.style.setProperty("--sidebar-width", targetWidth);
    }, [isCollapsed, isMobile, isAuthPage]);

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
                    <button
                        onClick={(e) => {
                            const isDark = theme === "dark";
                            const newTheme = isDark ? "light" : "dark";
                            if (!document.startViewTransition) {
                                document.documentElement.classList.add("theme-transitioning");
                                setTheme(newTheme);
                                setTimeout(() => {
                                    document.documentElement.classList.remove("theme-transitioning");
                                }, 500);
                                return;
                            }
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            const x = Math.round(rect.left + rect.width / 2);
                            const y = Math.round(rect.top + rect.height / 2);
                            document.documentElement.style.setProperty("--vt-x", `${x}px`);
                            document.documentElement.style.setProperty("--vt-y", `${y}px`);
                            const root = document.documentElement;
                            root.classList.toggle("dark", !isDark);
                            const transition = document.startViewTransition(() => {});
                            transition.ready.then(() => setTheme(newTheme));
                        }}
                        className="p-3 rounded-xl text-foreground/50 hover:text-foreground/80 hover:bg-muted transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <div className="relative w-6 h-6">
                            <Sun className="w-6 h-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                            <Moon className="w-6 h-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                className={cn(
                    "fixed top-0 left-0 h-screen hidden md:flex flex-col z-50 border-r border-border bg-background/50 backdrop-blur-xl"
                )}
                style={{ willChange: "width", contain: "layout paint style" }}
                transition={SIDEBAR_MOTION_SPRING}
            >
                {/* Header / Toggle */}
                <motion.div
                    className={cn(
                        "flex items-center h-20 border-b border-border/50 shrink-0 relative",
                        isCollapsed ? "px-3" : "px-4"
                    )}
                >
                    <motion.div className="w-14 flex items-center justify-center shrink-0">
                        <motion.div
                            className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white shadow-glow"
                        >
                            H
                        </motion.div>
                    </motion.div>

                    <motion.div
                        initial={false}
                        aria-hidden={isCollapsed}
                        animate={{
                            opacity: isCollapsed ? 0 : 1,
                            x: isCollapsed ? -8 : 0,
                            scale: isCollapsed ? 0.98 : 1,
                        }}
                        transition={LABEL_TRANSITION}
                        className={cn("flex items-center overflow-hidden flex-1 ml-3", isCollapsed && "pointer-events-none")}
                    >
                        <span className="font-bold text-lg tracking-tight whitespace-nowrap text-foreground">Habitopia</span>
                    </motion.div>

                    <motion.button
                        onClick={() => setIsCollapsed(false)}
                        aria-hidden={!isCollapsed}
                        animate={{
                            opacity: isCollapsed ? 1 : 0,
                            scale: isCollapsed ? 1 : 0.9,
                            x: isCollapsed ? 0 : -4,
                        }}
                        transition={MICRO_TRANSITION}
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 h-4 w-4 flex items-center justify-center hover:bg-foreground/5 rounded text-muted-foreground hover:text-foreground active:scale-95",
                            isCollapsed ? "right-1.5" : "pointer-events-none"
                        )}
                    >
                        <ChevronRight className="w-3 h-3" />
                    </motion.button>

                    <motion.button
                        onClick={() => setIsCollapsed(true)}
                        aria-hidden={isCollapsed}
                        animate={{
                            opacity: isCollapsed ? 0 : 1,
                            scale: isCollapsed ? 0.9 : 1,
                            x: isCollapsed ? -6 : 0,
                        }}
                        transition={MICRO_TRANSITION}
                        className={cn(
                            "p-2 hover:bg-foreground/5 rounded-lg text-muted-foreground hover:text-foreground active:scale-95 shrink-0 ml-auto",
                            isCollapsed && "pointer-events-none"
                        )}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </motion.button>
                </motion.div>

                {/* Navigation */}
                <LayoutGroup>
                    <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
                        {NAV_ITEMS.map(({ href, label, icon: Icon }, index) => {
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
                                            transition={SIDEBAR_MOTION_SPRING}
                                        />
                                    )}

                                    {/* Icon Container - Fixed width keeps icon position stable relative to sidebar edge */}
                                    <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                                        <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                    </div>

                                    <motion.span
                                        initial={false}
                                        aria-hidden={isCollapsed}
                                        animate={{
                                            opacity: isCollapsed ? 0 : 1,
                                            x: isCollapsed ? -8 : 0,
                                            scale: isCollapsed ? 0.985 : 1,
                                        }}
                                        transition={LABEL_TRANSITION}
                                        className={cn(
                                            "whitespace-nowrap relative z-10 overflow-hidden text-sm",
                                            isCollapsed && "pointer-events-none"
                                        )}
                                    >
                                        {label}
                                    </motion.span>
                                </Link>
                            );
                        })}
                    </div>
                </LayoutGroup>

                {/* Footer Actions */}
                <div className="px-3 py-4 border-t border-border/50 space-y-2 shrink-0">
                    {/* Theme Toggle */}
                    <button
                        onClick={(e) => {
                            const newTheme = theme === "dark" ? "light" : "dark";
                            // Get button center for the circle origin
                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            const x = Math.round(rect.left + rect.width / 2);
                            const y = Math.round(rect.top + rect.height / 2);
                            document.documentElement.style.setProperty("--vt-x", `${x}px`);
                            document.documentElement.style.setProperty("--vt-y", `${y}px`);

                            if (!document.startViewTransition) {
                                document.documentElement.classList.add("theme-transitioning");
                                setTheme(newTheme);
                                setTimeout(() => {
                                    document.documentElement.classList.remove("theme-transitioning");
                                }, 500);
                                return;
                            }
                            document.startViewTransition(() => setTheme(newTheme));
                        }}
                        className="flex items-center h-12 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 relative overflow-hidden group cursor-pointer transition-colors duration-200"
                    >
                        <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                            <div className="relative w-6 h-6 transition-transform group-hover:scale-110">
                                <Sun className="w-6 h-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                                <Moon className="w-6 h-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                            </div>
                        </div>
                        <motion.span
                            initial={false}
                            aria-hidden={isCollapsed}
                            animate={{
                                opacity: isCollapsed ? 0 : 1,
                                x: isCollapsed ? -8 : 0,
                                scale: isCollapsed ? 0.985 : 1,
                            }}
                            transition={LABEL_TRANSITION}
                            className={cn("whitespace-nowrap overflow-hidden text-sm", isCollapsed && "pointer-events-none")}
                        >
                            Toggle Theme
                        </motion.span>
                    </button>

                    {/* Settings */}
                    <Link
                        href="/settings"
                        className="flex items-center h-12 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 relative overflow-hidden group transition-colors duration-200"
                    >
                        <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                            <Settings className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </div>
                        <motion.span
                            initial={false}
                            aria-hidden={isCollapsed}
                            animate={{
                                opacity: isCollapsed ? 0 : 1,
                                x: isCollapsed ? -8 : 0,
                                scale: isCollapsed ? 0.985 : 1,
                            }}
                            transition={LABEL_TRANSITION}
                            className={cn("whitespace-nowrap overflow-hidden text-sm", isCollapsed && "pointer-events-none")}
                        >
                            Settings
                        </motion.span>
                    </Link>

                    {/* Logout */}
                    <form action={logout}>
                        <button
                            className="flex items-center h-12 rounded-xl w-full text-red-500/70 hover:text-red-500 hover:bg-red-500/10 relative overflow-hidden group cursor-pointer transition-colors duration-200"
                        >
                            <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                                <LogOut className="w-6 h-6 transition-transform group-hover:scale-110" />
                            </div>
                            <motion.span
                                initial={false}
                                aria-hidden={isCollapsed}
                                animate={{
                                    opacity: isCollapsed ? 0 : 1,
                                    x: isCollapsed ? -8 : 0,
                                    scale: isCollapsed ? 0.985 : 1,
                                }}
                                transition={LABEL_TRANSITION}
                                className={cn("whitespace-nowrap overflow-hidden text-sm font-medium", isCollapsed && "pointer-events-none")}
                            >
                                Logout
                            </motion.span>
                        </button>
                    </form>
                </div>
            </motion.aside>
        </>
    );
}
