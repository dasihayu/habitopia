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

    const navLinks = [
        { name: "Features", href: "#features" },
        { name: "About", href: "#about" },
        { name: "Pricing", href: "#pricing" }
    ];

    const menuVariants = {
        closed: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: {
                staggerChildren: 0.05,
                staggerDirection: -1
            }
        },
        open: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 30,
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, x: -10 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-[999] pointer-events-none flex justify-center px-3 sm:px-6">
            <div
                className={cn(
                    "pointer-events-auto flex items-center justify-between relative",
                    "transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]",
                    isScrolled
                        ? "mt-3 w-full max-w-5xl py-2 px-5 rounded-2xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                        : "mt-0 w-full max-w-7xl py-4 sm:py-5 px-4 sm:px-6 rounded-none border border-transparent bg-transparent shadow-none",
                    isMobileMenuOpen ? "overflow-visible" : "overflow-hidden"
                )}
            >
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
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop overlay */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] md:hidden"
                            />
                            
                            <motion.div
                                variants={menuVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-white/10 md:hidden p-8 flex flex-col gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[1000] origin-top transform-gpu"
                            >
                                {navLinks.map((item) => (
                                    <motion.div key={item.name} variants={itemVariants}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-lg font-bold text-foreground/80 hover:text-primary transition-colors active:translate-x-2 block"
                                        >
                                            {item.name}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div variants={itemVariants} className="pt-4 border-t border-white/5">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-lg font-bold text-primary active:translate-x-2 block"
                                    >
                                        Sign In
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
