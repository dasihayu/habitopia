import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { User, Shield, Zap, TrendingUp, History, Star, Trophy, Calendar } from "lucide-react";
import PlayerHUD from "@/components/dashboard/PlayerHUD";

async function getProfileData() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            questHistory: {
                orderBy: { completedAt: "desc" },
                take: 10,
            },
            achievements: {
                include: { achievement: true },
            },
        },
    });

    if (!user) redirect("/login");

    return user;
}

export default async function ProfilePage() {
    const user = await getProfileData();

    const totalXP = user.questHistory.reduce((acc, curr) => acc + curr.xpGained, 0);

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <PlayerHUD user={user} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats Cards */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-3xl border-primary/20">
                        <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Player Statistics
                        </h4>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Total XP Gained</span>
                                <span className="text-xl font-bold text-primary">{user.xp + (user.level > 1 ? (user.level - 1) * 1000 : 0)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Quests Completed</span>
                                <span className="text-xl font-bold">{user.questHistory.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Longest Streak</span>
                                <span className="text-xl font-bold">{user.streak} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Account Age</span>
                                <span className="text-xl font-bold">{Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}d</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl bg-primary/5">
                        <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            Recent Achievements
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {user.achievements.slice(0, 4).map((ua) => (
                                <div key={ua.id} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors cursor-help" title={ua.achievement.name}>
                                    <Trophy className="w-6 h-6 text-primary" />
                                </div>
                            ))}
                            {user.achievements.length === 0 && <p className="text-xs text-foreground/30 italic">No achievements yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quest History */}
                <div className="lg:col-span-2">
                    <div className="glass p-8 rounded-3xl h-full border-white/5 bg-white/[0.01]">
                        <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Activity History
                        </h4>

                        <div className="space-y-4">
                            {user.questHistory.length === 0 ? (
                                <div className="text-center py-20 text-foreground/20">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No activity recorded yet.</p>
                                </div>
                            ) : (
                                user.questHistory.map((item) => (
                                    <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-foreground/40 group-hover:text-primary transition-colors">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold">{item.title}</div>
                                            <div className="text-[10px] text-foreground/30 uppercase font-black flex items-center gap-2 mt-0.5">
                                                <span className="text-green-500/50">Mastered</span> • {new Date(item.completedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-primary font-black">+{item.xpGained} XP</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {user.questHistory.length > 0 && (
                            <button className="w-full mt-8 py-4 text-sm font-bold text-foreground/40 hover:text-primary transition-colors border-t border-white/5">
                                View Full Logs
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
