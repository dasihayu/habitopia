import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Timer from "@/components/focus/Timer";
import DashboardAnimations from "@/components/dashboard/DashboardAnimations";

async function getQuests() {
    const session = await getSession();
    if (!session) redirect("/login");

    const quests = await prisma.quest.findMany({
        where: {
            userId: session.userId,
            isCompleted: false,
            expiresAt: {
                gt: new Date(),
            },
        },
    });

    return quests;
}

export default async function FocusPage({
    searchParams,
}: {
    searchParams: Promise<{ questId?: string }>;
}) {
    const { questId } = await searchParams;
    const quests = await getQuests();
    const selectedQuest = quests.find(q => q.id === questId);

    return (
        <DashboardAnimations>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-100px)] flex flex-col items-center justify-center space-y-12">
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-extrabold gradient-text">Deep Focus</h2>
                    {selectedQuest ? (
                        <p className="text-foreground/60">
                            Focusing on: <span className="text-primary font-bold">{selectedQuest.title}</span>
                        </p>
                    ) : (
                        <p className="text-foreground/60 italic">Free focus session (No quest linked)</p>
                    )}
                </div>

                <Timer initialMinutes={25} questId={questId} />

                {!selectedQuest && quests.length > 0 && (
                    <div className="w-full max-w-sm space-y-4">
                        <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest block text-center">
                            Link to an Active Quest
                        </label>
                        <div className="flex flex-col gap-2">
                            {quests.slice(0, 3).map((q) => (
                                <a
                                    key={q.id}
                                    href={`/focus?questId=${q.id}`}
                                    className="glass p-4 rounded-2xl flex items-center justify-between hover:bg-foreground/5 transition border-border/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                                >
                                    <span className="font-bold text-sm truncate">{q.title}</span>
                                    <span className="text-xs text-primary font-black">+{q.xpReward} XP</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardAnimations >
    );
}
