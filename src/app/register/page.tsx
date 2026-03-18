"use client";

import { register } from "@/app/actions/auth";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        const result = await register(formData);
        if (result?.error) {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-background relative overflow-hidden">
            {/* Background elements to match landing */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px]" />
            </div>

            <div className="w-full max-w-[400px] glass-premium p-6 sm:p-10 rounded-[2rem] animate-fade-in shadow-2xl relative z-10 border-white/5">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center gap-3 mb-8 group active:scale-95 transition-transform">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                            <span className="text-2xl font-bold text-white">H</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Habitopia
                        </span>
                    </Link>
                    <h2 className="text-3xl font-black gradient-text mb-2">Create Account</h2>
                    <p className="text-foreground/50 text-sm">Begin your epic adventure today</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/70 ml-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                            placeholder="HabitHero"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/70 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg hover:brightness-110 active:scale-[0.98] transition-all shadow-glow flex items-center justify-center gap-2 overflow-hidden shimmer-effect"
                    >
                        {loading ? "Creating..." : "Start Adventure"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-foreground/50">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-bold">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
