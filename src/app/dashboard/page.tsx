import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import PlayerHUD from "@/components/dashboard/PlayerHUD";
import { Sword, ArrowRight, Timer, CheckCircle, Flame } from "lucide-react";
import Link from "next/link";
import { generateDailyQuests } from "@/lib/quest-engine";
import DashboardAnimations from "@/components/dashboard/DashboardAnimations"; // [NEW] Wrapper

async function getDashboardData() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { quests: { where: { isCompleted: false }, orderBy: { createdAt: "desc" } } },
    });

    if (!user) redirect("/login");
    if (!user.isOnboarded) redirect("/onboarding");

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const existingQuests = await prisma.quest.findMany({
        where: { userId: session.userId, createdAt: { gte: startOfDay } },
        orderBy: { createdAt: "desc" },
    });

    if (existingQuests.length > 0) {
        return { user, quests: existingQuests.filter((quest) => !quest.isCompleted) };
    }

    await generateDailyQuests(session.userId);

    const refreshedUser = await prisma.user.findUnique({
        where: { id: session.userId },
        include: { quests: { where: { isCompleted: false }, orderBy: { createdAt: "desc" } } },
    });

    if (!refreshedUser) redirect("/login");

    return { user: refreshedUser, quests: refreshedUser.quests };
}

export default async function DashboardPage() {
    const { user, quests } = await getDashboardData();

    return (
        <DashboardAnimations>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {/* Player Card / HUD */}
                <PlayerHUD user={user} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Today's Quests */}
                    <div className="lg:col-span-8 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-bold flex items-center gap-3">
                                <Sword className="text-primary w-6 h-6" />
                                Active Quests
                            </h3>
                            <Link
                                href="/quests"
                                className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="space-y-4">
                            {quests.length === 0 ? (
                                <div className="glass p-12 text-center rounded-3xl border-dashed border-white/5 bg-white/[0.02]">
                                    <CheckCircle className="w-12 h-12 text-foreground/10 mx-auto mb-4" />
                                    <p className="text-foreground/40 font-medium">All quests completed for today!</p>
                                    <button className="mt-4 text-primary font-bold text-sm">Generate Bonus Quests</button>
                                </div>
                            ) : (
                                quests.slice(0, 3).map((quest) => (
                                    <div
                                        key={quest.id}
                                        className="glass p-6 rounded-2xl flex items-center gap-6 group hover:bg-white/[0.07] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-glow transition-all duration-300 cursor-pointer border-white/5"
                                    >
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                            <Timer className="text-foreground/40 group-hover:text-primary w-7 h-7" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-lg mb-0.5 truncate">{quest.title}</h4>
                                            <p className="text-sm text-foreground/50 line-clamp-1">{quest.description}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-primary font-black text-lg">+{quest.xpReward}</div>
                                            <div className="text-[10px] text-foreground/30 uppercase font-bold tracking-widest">{quest.difficulty}</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Column: Daily Bonus & Status */}
                    <div className="lg:col-span-4 space-y-8">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <Flame className="text-orange-500 w-6 h-6" />
                            Daily Bonus
                        </h3>

                        <div className="glass p-8 rounded-3xl relative overflow-hidden flex flex-col items-center hover:scale-[1.02] transition-transform duration-300">
                            <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
                            <div className="relative z-10 text-center space-y-6">
                                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                                    <Flame className="w-10 h-10 text-orange-500" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold mb-1">Streak Bonus</h4>
                                    <p className="text-sm text-foreground/50">Complete 1 quest today to maintain your {user.streak} day streak.</p>
                                </div>
                                <Link
                                    href="/focus"
                                    className="inline-block w-full py-4 bg-primary rounded-2xl font-bold text-center hover:brightness-110 shadow-glow transition-all"
                                >
                                    Quick Start Focus
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardAnimations>
    );
}
