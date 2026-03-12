"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on scroll
    useEffect(() => {
        if (isMobileMenuOpen) {
            const closeOnScroll = () => setIsMobileMenuOpen(false);
            window.addEventListener("scroll", closeOnScroll);
            return () => window.removeEventListener("scroll", closeOnScroll);
        }
    }, [isMobileMenuOpen]);

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "About", href: "#about" },
        { name: "Pricing", href: "#pricing" }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-[999] pointer-events-none flex justify-center px-3 sm:px-6">
            <div
                className={cn(
                    "pointer-events-auto relative flex flex-col",
                    "transition-[max-width,margin,padding,border-radius,background,border-color,box-shadow,backdrop-filter] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isScrolled || isMobileMenuOpen
                        ? "mt-3 w-full max-w-5xl rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                        : "mt-0 w-full max-w-7xl rounded-none border border-transparent bg-transparent shadow-none"
                )}
            >
                {/* Header Row */}
                <div className={cn(
                    "flex items-center justify-between w-full transition-[padding] duration-500",
                    isScrolled || isMobileMenuOpen ? "py-2.5 px-5" : "py-4 sm:py-5 px-4 sm:px-6"
                )}>
                    {/* Logo */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0 z-10">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 group active:scale-95 transition-transform">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-accent rounded-lg sm:rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                                <span className="text-lg sm:text-xl font-bold text-white">H</span>
                            </div>
                            <span className="text-lg sm:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                Habitopia
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav Links - Centered */}
                    <nav className="hidden md:flex items-center justify-center absolute inset-0 pointer-events-none">
                        <div className="flex items-center gap-8 pointer-events-auto">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors duration-300 relative group/link active:scale-95",
                                        isScrolled ? "text-foreground/80 hover:text-primary" : "text-foreground/60 hover:text-primary"
                                    )}
                                >
                                    {item.name}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover/link:w-full duration-300" />
                                </Link>
                            ))}
                        </div>
                    </nav>

                    {/* Auth CTAs */}
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0 z-10">
                        <Link
                            href="/login"
                            className={cn(
                                "text-sm font-semibold transition-colors duration-300 hidden sm:block active:scale-95",
                                isScrolled ? "text-foreground/80 hover:text-primary" : "text-foreground/60 hover:text-primary"
                            )}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/register"
                            className="glass-pill px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold shadow-glow hover:brightness-110 transition-all duration-300 active:scale-95 text-primary"
                        >
                            Get Started
                        </Link>
                        
                        {/* Mobile Menu Toggle */}
                        <button 
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 md:hidden active:scale-90 transition-transform text-foreground/70"
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {isMobileMenuOpen ? (
                                    <motion.span
                                        key="close"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <X className="w-6 h-6" />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="menu"
                                        initial={{ rotate: 90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: -90, opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <Menu className="w-6 h-6" />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation — Connected via height animation */}
                <AnimatePresence initial={false}>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.25, ease: "easeInOut" }
                            }}
                            className="md:hidden overflow-hidden w-full"
                        >
                            <div className="flex flex-col gap-5 px-6 pb-6 pt-3 border-t border-white/[0.06]">
                                {navLinks.map((item, i) => (
                                    <motion.div
                                        key={item.name}
                                        initial={{ opacity: 0, x: -16 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -16 }}
                                        transition={{
                                            delay: 0.08 + i * 0.06,
                                            duration: 0.25,
                                            ease: [0.4, 0, 0.2, 1]
                                        }}
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-lg font-bold text-foreground/80 hover:text-primary transition-colors active:translate-x-2 block"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    initial={{ opacity: 0, x: -16 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -16 }}
                                    transition={{
                                        delay: 0.08 + navLinks.length * 0.06,
                                        duration: 0.25,
                                        ease: [0.4, 0, 0.2, 1]
                                    }}
                                    className="pt-3 border-t border-white/[0.06]"
                                >
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-bold text-primary active:translate-x-2 block"
                                    >
                                        Sign In
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Scrim overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 bg-black/50 z-[-1] md:hidden pointer-events-auto"
                    />
                )}
            </AnimatePresence>
        </header>
    );
}
