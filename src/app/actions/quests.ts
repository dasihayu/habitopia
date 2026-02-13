"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function completeQuest(questId: string) {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    try {
        return await prisma.$transaction(async (tx) => {
            const quest = await tx.quest.findUnique({
                where: { id: questId },
                include: { user: true },
            });

            if (!quest || quest.isCompleted) {
                return { error: "Quest not found or already completed" };
            }

            if (quest.userId !== session.userId) {
                return { error: "Unauthorized" };
            }

            // 1. Mark quest as completed
            await tx.quest.update({
                where: { id: questId },
                data: { isCompleted: true },
            });

            // 2. Update user stats (XP, Streak, Level)
            let newXP = quest.user.xp + quest.xpReward;
            let newLevel = quest.user.level;
            let newStreak = quest.user.streak;

            // Level up logic (Simple: Level * 1000 XP)
            while (newXP >= newLevel * 1000) {
                newXP -= newLevel * 1000;
                newLevel += 1;
            }

            // Streak logic: If first completion of the day, increment streak
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const lastLogin = quest.user.lastLogin;
            if (!lastLogin || lastLogin < today) {
                newStreak += 1;
            }

            await tx.user.update({
                where: { id: session.userId },
                data: {
                    xp: newXP,
                    level: newLevel,
                    streak: newStreak,
                    lastLogin: new Date(),
                },
            });

            // 3. Record in history
            await tx.questHistory.create({
                data: {
                    userId: session.userId,
                    questId: quest.id,
                    title: quest.title,
                    xpGained: quest.xpReward,
                },
            });

            // 4. Check for Achievements (simplified)
            const achievements = await tx.achievement.findMany();
            const userAchievements = await tx.userAchievement.findMany({
                where: { userId: session.userId },
            });

            const unlockedKeys = userAchievements.map(ua => ua.achievementId);

            // First Quest achievement
            const firstQuest = achievements.find(a => a.requirementKey === "first_quest");
            if (firstQuest && !unlockedKeys.includes(firstQuest.id)) {
                await tx.userAchievement.create({
                    data: {
                        userId: session.userId,
                        achievementId: firstQuest.id,
                    },
                });
            }

            revalidatePath("/dashboard");
            revalidatePath("/quests");
            revalidatePath("/profile");

            return { success: true, levelUp: newLevel > quest.user.level };
        });
    } catch (e) {
        console.error(e);
        return { error: "Failed to complete quest" };
    }
}
