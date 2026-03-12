import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import QuestList from "@/components/quests/QuestList";
import CreateQuestModal from "@/components/quests/CreateQuestModal";
import { Sword } from "lucide-react";
import DashboardAnimations from "@/components/dashboard/DashboardAnimations"; // [NEW] Wrapper

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
        orderBy: {
            difficulty: "desc",
        },
    });

    return quests;
}

export default async function QuestsPage() {
    const quests = await getQuests();

    return (
        <DashboardAnimations>
            <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <h2 className="text-4xl font-extrabold flex items-center gap-3 gradient-text">
                            <Sword className="w-10 h-10" />
                            Active Quests
                        </h2>
                        <p className="text-foreground/50 text-lg">Your daily challenges to build a better life.</p>
                    </div>
                    <CreateQuestModal />
                </header>

                <QuestList initialQuests={quests as any} />
            </div>
        </DashboardAnimations>
    );
}
