"use client";

import { login } from "@/app/actions/auth";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        const result = await login(formData);
        if (result?.error) {
            setError(result.error);
        }
        setLoading(false);
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <div className="w-full max-w-md glass p-8 rounded-2xl animate-fade-in shadow-glow">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold gradient-text">Welcome Back</h2>
                    <p className="text-foreground/60">Continue your quest in Habitopia</p>
                </div>

                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/70 ml-1">Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                            placeholder="HabitHero"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground/70 ml-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
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
                        className="w-full py-4 bg-primary rounded-xl font-bold hover:brightness-110 transition shadow-glow flex items-center justify-center gap-2"
                    >
                        {loading ? "Authenticating..." : "Enter World"}
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-foreground/50">
                    New to the realm?{" "}
                    <Link href="/register" className="text-primary hover:underline font-bold">
                        Start Your Journey
                    </Link>
                </p>
            </div>
        </div>
    );
}
