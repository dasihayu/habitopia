"use client";

import { motion } from "framer-motion";
import { Zap, Trophy, Shield, Star } from "lucide-react";

import { ReactNode } from "react";

interface PlayerHUDProps {
    user: {
        username: string;
        level: number;
        xp: number;
        streak: number;
        avatarUrl?: string | null;
    };
    actions?: ReactNode;
}

export default function PlayerHUD({ user, actions }: PlayerHUDProps) {
    // Simple XP formula for level progress: (XP / (Level * 1000)) * 100
    const xpNeeded = user.level * 1000;
    const progress = Math.min((user.xp / xpNeeded) * 100, 100);

    const defaultAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`;

    return (
        <div className="glass p-6 rounded-3xl mb-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] group-hover:bg-primary/30 transition-all pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                {/* Avatar & Level Badge */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-glow">
                        <img
                            src={user.avatarUrl || defaultAvatar}
                            alt={user.username}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold text-lg shadow-glow border border-white/20">
                        {user.level}
                    </div>
                </div>

                {/* Info & XP Bar */}
                <div className="flex-1 w-full space-y-4 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h2 className="text-2xl font-bold flex flex-wrap items-center justify-center md:justify-start gap-2">
                                {user.username}
                                <Shield className="w-5 h-5 text-primary" />
                            </h2>
                            <p className="text-sm text-foreground/50">Master of Productivity</p>
                        </div>
                        {actions && (
                            <div className="flex items-center gap-2">
                                {actions}
                            </div>
                        )}
                    </div>

                    <div className="space-y-1.5 w-full">
                        <div className="flex justify-between text-xs font-medium px-1">
                            <span className="text-foreground/60 uppercase tracking-wider flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-500" />
                                EXPERIENCE
                            </span>
                            <span>{user.xp} / {xpNeeded} XP</span>
                        </div>
                        <div className="h-3 w-full bg-foreground/10 rounded-full overflow-hidden border border-foreground/5 relative">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-accent shadow-glow absolute left-0 top-0"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats Grid */}
                <div className="flex flex-col gap-4 w-full md:w-auto mt-4 md:mt-0">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass bg-foreground/5 p-4 rounded-2xl flex flex-col items-center justify-center border-foreground/5 min-w-[100px]">
                            <Zap className="w-6 h-6 text-orange-400 mb-1" />
                            <span className="text-xl font-bold">{user.streak}</span>
                            <span className="text-[10px] text-foreground/40 uppercase tracking-tighter">Streak</span>
                        </div>
                        <div className="glass bg-foreground/5 p-4 rounded-2xl flex flex-col items-center justify-center border-foreground/5 min-w-[100px]">
                            <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
                            <span className="text-xl font-bold">12</span>
                            <span className="text-[10px] text-foreground/40 uppercase tracking-tighter">Badges</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
