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
import { m, LayoutGroup, AnimatePresence, LazyMotion } from "framer-motion";

const loadFeatures = () => import("@/lib/framer-features").then(res => res.default);

const injectViewTransitionOrigin = (x: number, y: number) => {
    let styleEl = document.getElementById("vt-origin-style");
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "vt-origin-style";
        document.head.appendChild(styleEl);
    }
    styleEl.innerHTML = `
        ::view-transition-new(root) {
            animation: vt-reveal 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
            z-index: 2;
            mix-blend-mode: normal;
        }
        @keyframes vt-reveal {
            from { clip-path: circle(0% at ${x}px ${y}px); opacity: 1; }
            to { clip-path: circle(200% at ${x}px ${y}px); opacity: 1; }
        }
    `;
};

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
    const [hasMounted, setHasMounted] = useState(false);

    // Handle responsive — debounced to avoid per-pixel re-renders on drag
    useEffect(() => {
        setHasMounted(true);
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

    // Sync layout offset with sidebar state (via CSS variables on root).
    useEffect(() => {
        if (!hasMounted) return;
        const doc = document.documentElement;
        doc.classList.toggle("sidebar-collapsed", isCollapsed);
        doc.setAttribute("data-auth", isAuthPage ? "true" : "false");
    }, [isCollapsed, isAuthPage, isMobile]);

    if (isAuthPage) return null;

    return (
        <LazyMotion features={loadFeatures} strict>
            {/* Mobile Bottom Nav */}
            <nav suppressHydrationWarning className="fixed bottom-0 left-0 w-full z-[100] px-4 pb-6 md:hidden pointer-events-none">
                <div className="glass flex items-center justify-around p-3 rounded-2xl border-white/10 shadow-2xl bg-background/80 backdrop-blur-md pointer-events-auto max-w-[400px] mx-auto">
                    {NAV_ITEMS.map(({ href, icon: Icon }) => {
                        const isActive = pathname === href;
                        return (
                            <Link key={href} href={href} className={cn("p-3 rounded-xl relative", isActive ? "text-primary" : "text-foreground/50 hover:text-foreground/80 hover:bg-muted")}>
                                {isActive && <m.div layoutId="mobileNav" className="absolute inset-0 bg-primary/10 rounded-xl" />}
                                <Icon className="w-6 h-6 relative z-10" />
                            </Link>
                        );
                    })}
                </div>
            </nav>
            
            {/* Mobile Top Header (Settings & Theme) */}
            <header suppressHydrationWarning className="fixed top-0 left-0 w-full z-[100] p-4 flex justify-end gap-2 md:hidden pointer-events-none">
                <Link
                    href="/settings"
                    className="glass pointer-events-auto p-2.5 rounded-xl text-foreground/50 hover:text-foreground/80 hover:bg-muted transition-all active:scale-95 shadow-lg bg-background/80 backdrop-blur-md border border-white/10"
                >
                    <Settings className="w-5 h-5" />
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
                            
                            // Accurate origin: use exact click/touch point, fallback to button center
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            const nativeEvent = e.nativeEvent as any;
                            const touch = nativeEvent.touches?.[0] || nativeEvent.changedTouches?.[0];
                            const x = (e.clientX > 0 ? e.clientX : (touch?.clientX || Math.round(rect.left + rect.width / 2)));
                            const y = (e.clientY > 0 ? e.clientY : (touch?.clientY || Math.round(rect.top + rect.height / 2)));
                            
                            // Inject actual coordinate animation (bypasses CSS variable inheritance limits on pseudo-elements)
                            injectViewTransitionOrigin(x, y);
                            
                            requestAnimationFrame(() => {
                                if (!document.startViewTransition) {

                                    setTheme(newTheme);
                                    return;
                                }
                                document.startViewTransition(() => {
                                    setTheme(newTheme);
                                    document.documentElement.classList.toggle("dark", newTheme === "dark");
                                });
                            });
                        }}
                        className="glass pointer-events-auto p-2.5 rounded-xl text-foreground/50 hover:text-foreground/80 hover:bg-muted transition-all active:scale-95 shadow-lg bg-background/80 backdrop-blur-md border border-white/10 cursor-pointer"
                        title="Toggle theme"
                    >
                        <div className="relative w-5 h-5">
                            <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                            <Moon className="w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                        </div>
                    </button>
            </header>

            {/* Desktop Sidebar */}
            <m.aside
                initial={false}
                animate={{ width: isCollapsed ? 80 : 256 }}
                className={cn(
                    "fixed top-0 left-0 h-screen hidden md:flex flex-col z-50 border-r border-border bg-background/50 backdrop-blur-xl"
                )}
                suppressHydrationWarning
                style={{ willChange: "width", contain: "layout paint style" }}
                transition={SIDEBAR_MOTION_SPRING}
            >
                {/* Header / Toggle */}
                <m.div
                    className={cn(
                        "flex items-center h-20 border-b border-border/50 shrink-0 relative",
                        isCollapsed ? "px-3" : "px-4"
                    )}
                >
                    <m.div className="w-14 flex items-center justify-center shrink-0">
                        <m.div
                            className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white shadow-glow"
                        >
                            H
                        </m.div>
                    </m.div>

                    <m.div
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
                    </m.div>

                    <m.button
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
                    </m.button>

                    <m.button
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
                    </m.button>
                </m.div>

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
                                        <m.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-xl pointer-events-none"
                                            transition={SIDEBAR_MOTION_SPRING}
                                        />
                                    )}

                                    {/* Icon Container - Fixed width keeps icon position stable relative to sidebar edge */}
                                    <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                                        <Icon className={cn("w-6 h-6 transition-transform group-hover:scale-110", isActive && "text-primary")} />
                                    </div>

                                    <m.span
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
                                    </m.span>
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
                            // Accurate origin: use exact click/touch point, fallback to button center
                            const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
                            const nativeEvent = e.nativeEvent as any;
                            const touch = nativeEvent.touches?.[0] || nativeEvent.changedTouches?.[0];
                            const x = (e.clientX > 0 ? e.clientX : (touch?.clientX || Math.round(rect.left + rect.width / 2)));
                            const y = (e.clientY > 0 ? e.clientY : (touch?.clientY || Math.round(rect.top + rect.height / 2)));
                            
                            // Inject actual coordinate animation (bypasses CSS variable inheritance limits on pseudo-elements)
                            injectViewTransitionOrigin(x, y);

                            requestAnimationFrame(() => {
                                if (!document.startViewTransition) {
                                    document.documentElement.classList.add("theme-transitioning");
                                    setTheme(newTheme);
                                    setTimeout(() => {
                                        document.documentElement.classList.remove("theme-transitioning");

                                    }, 500);
                                    return;
                                }
                                document.startViewTransition(() => {
                                    setTheme(newTheme);
                                    document.documentElement.classList.toggle("dark", newTheme === "dark");
                                });
                            });
                        }}
                        className="flex items-center h-12 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 relative overflow-hidden group cursor-pointer transition-colors duration-200"
                        title="Toggle theme"
                    >
                        <div className="w-12 h-12 flex items-center justify-center shrink-0 relative z-10">
                            <div className="relative w-6 h-6 transition-transform group-hover:scale-110">
                                <Sun className="w-6 h-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 absolute" />
                                <Moon className="w-6 h-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute" />
                            </div>
                        </div>
                        <m.span
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
                        </m.span>
                    </button>

                    {/* Settings */}
                    <Link
                        href="/settings"
                        className="flex items-center h-12 rounded-xl w-full text-muted-foreground hover:text-foreground hover:bg-foreground/5 relative overflow-hidden group transition-colors duration-200"
                    >
                        <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                            <Settings className="w-6 h-6 transition-transform group-hover:scale-110" />
                        </div>
                        <m.span
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
                        </m.span>
                    </Link>

                    {/* Logout */}
                    <form action={logout}>
                        <button
                            className="flex items-center h-12 rounded-xl w-full text-red-500/70 hover:text-red-500 hover:bg-red-500/10 relative overflow-hidden group cursor-pointer transition-colors duration-200"
                        >
                            <div className="w-14 flex items-center justify-center shrink-0 relative z-10">
                                <LogOut className="w-6 h-6 transition-transform group-hover:scale-110" />
                            </div>
                            <m.span
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
                            </m.span>
                        </button>
                    </form>
                </div>
            </m.aside>
        </LazyMotion>
    );
}
