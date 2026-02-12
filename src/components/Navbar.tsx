"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Sword, Trophy, User, Settings, Timer, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";

const NAV_ITEMS = [
    { href: "/dashboard", label: "HUD", icon: LayoutDashboard },
    { href: "/quests", label: "Quests", icon: Sword },
    { href: "/focus", label: "Focus", icon: Timer },
    { href: "/achievements", label: "Rewards", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
];

export default function Navbar() {
    const pathname = usePathname();

    // Don't show navbar on auth/onboarding/landing pages
    const isAuthPage = ["/", "/login", "/register", "/onboarding"].includes(pathname);
    if (isAuthPage) return null;

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 px-4 pb-6 md:top-0 md:bottom-auto md:w-20 md:h-screen md:p-0">
            <div className="glass md:h-full md:flex-col flex items-center justify-around md:justify-center gap-2 p-3 rounded-2xl md:rounded-none md:border-r border-white/10">
                <div className="hidden md:flex flex-col items-center mb-12">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold text-xl shadow-glow">
                        H
                    </div>
                </div>

                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex flex-col md:flex-row items-center gap-1 p-3 rounded-xl transition-all ${isActive
                                    ? "bg-primary/20 text-primary shadow-glow ring-1 ring-primary/30"
                                    : "text-foreground/50 hover:text-foreground/80 hover:bg-white/5"
                                }`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-[10px] md:hidden font-medium">{label}</span>
                        </Link>
                    );
                })}

                <div className="mt-auto hidden md:flex flex-col gap-4 items-center pb-8 p-3">
                    <Link href="/settings" className="text-foreground/50 hover:text-foreground transition">
                        <Settings className="w-6 h-6" />
                    </Link>
                    <form action={logout}>
                        <button className="text-red-400/70 hover:text-red-400 transition">
                            <LogOut className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </div>
        </nav>
    );
}
