"use client";

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

export default function PlayerHUD({ user, actionSlot }: PlayerHUDProps) {
    // Simple XP formula for level progress: (XP / (Level * 1000)) * 100
    const xpNeeded = user.level * 1000;
    const progress = Math.min((user.xp / xpNeeded) * 100, 100);

    const defaultAvatar = `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass p-6 rounded-3xl mb-8 relative overflow-hidden group"
        >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] group-hover:bg-primary/30 transition-all pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
                {/* Avatar & Level Badge */}
                <div className="relative">
                    <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-glow cursor-pointer"
                    >
                        <img
                            src={user.avatarUrl || defaultAvatar}
                            alt={user.username}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                    </motion.div>
                    <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-accent shadow-glow"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
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
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="glass bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center border-white/5 min-w-[100px] cursor-pointer"
                        >
                            <Zap className="w-6 h-6 text-orange-400 mb-1" />
                            <span className="text-xl font-bold">{user.streak}</span>
                            <span className="text-[10px] text-foreground/40 uppercase tracking-tighter">Streak</span>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            className="glass bg-white/5 p-4 rounded-2xl flex flex-col items-center justify-center border-white/5 min-w-[100px] cursor-pointer"
                        >
                            <Trophy className="w-6 h-6 text-yellow-500 mb-1" />
                            <span className="text-xl font-bold">12</span>
                            <span className="text-[10px] text-foreground/40 uppercase tracking-tighter">Badges</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
