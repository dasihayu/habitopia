"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Zap, Trophy, Shield, Star } from "lucide-react";

interface PlayerHUDProps {
    user: {
        username: string;
        level: number;
        xp: number;
        streak: number;
        avatarUrl?: string | null;
    };
    actionSlot?: React.ReactNode;
}

// Stat card: use CSS hover instead of motion.div to avoid per-card spring tracking
const StatCard = memo(function StatCard({ icon, value, label }: { icon: React.ReactNode; value: React.ReactNode; label: string }) {
    return (
        <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-4 rounded-2xl flex flex-col items-center justify-center min-w-[100px] cursor-pointer transition-transform duration-200 ease-out hover:scale-105 hover:-translate-y-1 active:scale-95">
            {icon}
            <span className="text-xl font-bold">{value}</span>
            <span className="text-[10px] text-foreground/40 uppercase tracking-tighter">{label}</span>
        </div>
    );
});

const BADGE_FLOAT = { y: [0, -4, 0] };
const BADGE_TRANSITION = { duration: 3, repeat: Infinity, ease: "easeInOut" as const };
const AVATAR_HOVER = { scale: 1.05, rotate: 2 } as const;
const AVATAR_TRANSITION = { type: "spring" as const, stiffness: 400, damping: 20 };

export default memo(function PlayerHUD({ user, actionSlot }: PlayerHUDProps) {
    // Guard against level=0 to avoid division-by-zero / NaN in progress
    const xpNeeded = useMemo(() => Math.max(1, user.level) * 1000, [user.level]);
    const progress = useMemo(() => Math.min((user.xp / xpNeeded) * 100, 100), [user.xp, xpNeeded]);
    const defaultAvatar = useMemo(
        () => `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`,
        [user.username]
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass p-6 rounded-3xl mb-8 relative overflow-hidden group"
        >
            {/* Background Glow — pointer-events off, no transition-all (expensive paint) */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                {/* Avatar & Level Badge */}
                <div className="relative">
                    <motion.div
                        whileHover={AVATAR_HOVER}
                        transition={AVATAR_TRANSITION}
                        className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-glow cursor-pointer"
                    >
                        <img
                            src={user.avatarUrl || defaultAvatar}
                            alt={user.username}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                        />
                    </motion.div>
                    <motion.div
                        animate={BADGE_FLOAT}
                        transition={BADGE_TRANSITION}
                        style={{ willChange: "transform" }}
                        className="absolute -bottom-3 -right-3 w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center font-bold text-lg shadow-[0_0_20px_rgba(var(--primary),0.5)] border border-white/20"
                    >
                        {user.level}
                    </motion.div>
                </div>

                {/* Info & XP Bar */}
                <div className="flex-1 w-full space-y-4 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
                            {user.username}
                            <Shield className="w-5 h-5 text-primary" />
                        </h2>
                        <p className="text-sm text-foreground/50">Master of Productivity</p>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-medium px-1">
                            <span className="text-foreground/60 uppercase tracking-wider flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400" />
                                Experience
                            </span>
                            <span>{user.xp} / {xpNeeded} XP</span>
                        </div>
                        <div className="h-3 w-full bg-black/10 dark:bg-white/5 rounded-full overflow-hidden border border-black/10 dark:border-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-accent relative overflow-hidden rounded-r-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {/* Shine effect — uses transform only (GPU composited) */}
                                <motion.div
                                    animate={{ x: ["-100%", "250%"] }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                        repeatDelay: 1.5
                                    }}
                                    style={{ willChange: "transform", transform: "skewX(-20deg)" }}
                                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                />
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Actions & Stats */}
                <div className="flex flex-col items-stretch md:items-end gap-4 w-full md:w-auto">
                    {actionSlot && (
                        <div className="flex justify-end gap-2">
                            {actionSlot}
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <StatCard icon={<Zap className="w-6 h-6 text-orange-400 mb-1" />} value={user.streak} label="Streak" />
                        <StatCard icon={<Trophy className="w-6 h-6 text-yellow-500 mb-1" />} value={12} label="Badges" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
});
