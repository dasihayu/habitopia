"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { QuestType, Difficulty } from "@prisma/client";

function calculateXP(difficulty: Difficulty, level: number) {
    const baseXP = {
        EASY: 100,
        MEDIUM: 250,
        HARD: 500,
        LEGENDARY: 1000,
    };
    return Math.floor(baseXP[difficulty] * (1 + (level - 1) * 0.1));
}

export async function createCustomQuest(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const difficulty = formData.get("difficulty") as Difficulty;
    const category = formData.get("category") as string || "custom";

    if (!title || !description || !difficulty) {
        return { error: "Missing required fields" };
    }

    try {
        const user = await prisma.user.findUnique({ where: { id: session.userId } });
        if (!user) return { error: "User not found" };

        const xpReward = calculateXP(difficulty, user.level);

        // Set expiry to end of today
        const expiresAt = new Date();
        expiresAt.setHours(23, 59, 59, 999);

        await prisma.quest.create({
            data: {
                userId: session.userId,
                title,
                description,
                type: "BINARY", // Default for custom quests
                difficulty,
                category,
                xpReward,
                isCustom: true,
                expiresAt,
            }
        });

        revalidatePath("/quests");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Failed to create quest:", error);
        return { error: "Failed to create quest" };
    }
}
