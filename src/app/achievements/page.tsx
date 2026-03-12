import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Trophy, Award, Zap, Flame, Moon, Sun, Timer, Lock, Star } from "lucide-react";
import DashboardAnimations from "@/components/dashboard/DashboardAnimations";

const ICON_MAP: Record<string, any> = {
    Award,
    Zap,
    Flame,
    Moon,
    Sun,
    Timer,
    Trophy,
};

async function getAchievementsData() {
    const session = await getSession();
    if (!session) redirect("/login");

    const allAchievements = await prisma.achievement.findMany();
    const userAchievements = await prisma.userAchievement.findMany({
        where: { userId: session.userId },
    });

    const unlockedIds = new Set(userAchievements.map((ua) => ua.achievementId));

    return { allAchievements, unlockedIds };
}

export default async function AchievementsPage() {
    const { allAchievements, unlockedIds } = await getAchievementsData();

    return (
        <DashboardAnimations>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                <header className="space-y-2 text-center md:text-left">
                    <h2 className="text-4xl font-extrabold flex items-center justify-center md:justify-start gap-3 gradient-text">
                        <Trophy className="w-10 h-10" />
                        Achievement Gallery
                    </h2>
                    <p className="text-foreground/50 text-lg">Collect badges as you master your habits.</p>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {allAchievements.map((achievement) => {
                        const isUnlocked = unlockedIds.has(achievement.id);
                        const Icon = ICON_MAP[achievement.icon] || Trophy;

                        return (
                            <div
                                key={achievement.id}
                                className={`glass p-8 rounded-3xl flex flex-col items-center text-center transition-all ${isUnlocked
                                    ? "border-primary/40 bg-primary/5 hover:-translate-y-2 hover:shadow-glow"
                                    : "opacity-40 grayscale"
                                    }`}
                            >
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 relative ${isUnlocked ? "bg-primary/20 shadow-glow" : "bg-white/5"
                                    }`}>
                                    <Icon className={`w-10 h-10 ${isUnlocked ? "text-primary" : "text-foreground/20"}`} />
                                    {!isUnlocked && (
                                        <div className="absolute -top-2 -right-2 bg-background p-1.5 rounded-lg border border-white/5">
                                            <Lock className="w-4 h-4 text-foreground/20" />
                                        </div>
                                    )}
                                </div>

                                <h4 className={`text-xl font-bold mb-2 ${isUnlocked ? "text-white" : "text-foreground/40"}`}>
                                    {achievement.name}
                                </h4>
                                <p className="text-sm text-foreground/30 mb-6 leading-relaxed">
                                    {achievement.description}
                                </p>

                                {isUnlocked ? (
                                    <div className="flex items-center gap-1.5 text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                                        <Star className="w-3.5 h-3.5 fill-current" />
                                        Claimed
                                    </div>
                                ) : (
                                    <div className="text-xs font-bold text-foreground/40 uppercase tracking-widest">
                                        Worth {achievement.xpBonus} XP
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </DashboardAnimations >
    );
}
