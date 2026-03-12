"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-border/50 bg-background/30 backdrop-blur-md pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Col */}
                    <div className="col-span-1 md:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center font-bold text-white shadow-glow">
                                H
                            </div>
                            <span className="font-bold text-lg tracking-tight">Habitopia</span>
                        </Link>
                        <p className="text-sm text-foreground/50 leading-relaxed">
                            The productivity RPG for the modern world. Level up your life, one habit at a time.
                        </p>
                    </div>

                    {/* Links Cols */}
                    <div>
                        <h4 className="font-bold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><Link href="#features" className="text-sm text-foreground/50 hover:text-primary transition-colors">Features</Link></li>
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Roadmap</Link></li>
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">API</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Careers</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="text-sm text-foreground/50 hover:text-primary transition-colors">Cookie Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-foreground/40 text-center md:text-left">
                        © {new Date().getFullYear()} Habitopia. Built for the habit builders.
                    </p>
                    <div className="flex items-center gap-6">
                        {/* Placeholder for social icons */}
                        <div className="w-5 h-5 bg-foreground/10 rounded-full hover:bg-primary/20 transition-colors cursor-pointer" />
                        <div className="w-5 h-5 bg-foreground/10 rounded-full hover:bg-primary/20 transition-colors cursor-pointer" />
                        <div className="w-5 h-5 bg-foreground/10 rounded-full hover:bg-primary/20 transition-colors cursor-pointer" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
