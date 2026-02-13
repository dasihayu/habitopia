import { QuestType, Difficulty } from "@prisma/client";
import prisma from "./prisma";

interface QuestTemplate {
    title: string;
    description: string;
    type: QuestType;
    category: string;
    difficulty: Difficulty;
    targetValue?: number;
}

const TEMPLATES: Record<string, QuestTemplate[]> = {
    fitness: [
        { title: "Power Pushups", description: "Complete a set of pushups to build strength.", type: "COUNT", category: "fitness", difficulty: "EASY", targetValue: 20 },
        { title: "Morning Run", description: "Go for a brisk run to boost your stamina.", type: "DURATION", category: "fitness", difficulty: "MEDIUM", targetValue: 30 },
        { title: "Plank Challenge", description: "Hold a plank and feel the burn.", type: "DURATION", category: "fitness", difficulty: "EASY", targetValue: 2 },
    ],
    coding: [
        { title: "Logic Master", description: "Solve one medium-level algorithm challenge.", type: "BINARY", category: "coding", difficulty: "MEDIUM" },
        { title: "Deep Work Session", description: "Focus on building a new feature without distractions.", type: "DURATION", category: "coding", difficulty: "HARD", targetValue: 60 },
        { title: "Bug Hunter", description: "Find and fix one bug in your current project.", type: "BINARY", category: "coding", difficulty: "EASY" },
    ],
    study: [
        { title: "Focus Study", description: "Intense study session on your current topic.", type: "DURATION", category: "study", difficulty: "MEDIUM", targetValue: 45 },
        { title: "Quick Review", description: "Review your notes from yesterday.", type: "BINARY", category: "study", difficulty: "EASY" },
    ],
    reading: [
        { title: "Chapter Dive", description: "Read at least two chapters of your current book.", type: "COUNT", category: "reading", difficulty: "EASY", targetValue: 2 },
        { title: "Daily Wisdom", description: "Read for 20 minutes before bed.", type: "DURATION", category: "reading", difficulty: "EASY", targetValue: 20 },
    ],
    productivity: [
        { title: "Inbox Zero", description: "Clear your primary email inbox.", type: "BINARY", category: "productivity", difficulty: "EASY" },
        { title: "Day Planning", description: "Plan your top 3 objectives for tomorrow.", type: "BINARY", category: "productivity", difficulty: "EASY" },
    ],
    health: [
        { title: "Hydration Hero", description: "Drink 8 glasses of water today.", type: "COUNT", category: "health", difficulty: "EASY", targetValue: 8 },
        { title: "No Sugar Day", description: "Avoid refined sugar for the entire day.", type: "BINARY", category: "health", difficulty: "MEDIUM" },
    ],
};

function getXPReward(difficulty: Difficulty, level: number): number {
    const baseXP: Record<Difficulty, number> = {
        EASY: 100,
        MEDIUM: 250,
        HARD: 500,
        LEGENDARY: 1000,
    };
    const xp = baseXP[difficulty];

    // Increase XP slightly with level to feel progression
    return Math.floor(xp * (1 + (level - 1) * 0.1));
}

export async function generateDailyQuests(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { interests: true, level: true },
    });

    if (!user) return [];

    // Get templates matching user interests
    let availableTemplates: QuestTemplate[] = [];
    user.interests.forEach((interest: string) => {
        const templates = TEMPLATES[interest.toLowerCase()];
        if (templates) availableTemplates = [...availableTemplates, ...templates];
    });

    // Fallback to productivity if no interests match
    if (availableTemplates.length === 0) {
        availableTemplates = TEMPLATES.productivity;
    }

    // Shuffle and pick 5
    const shuffled = availableTemplates.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 5);

    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    const quests = await Promise.all(
        selected.map((template) =>
            prisma.quest.create({
                data: {
                    userId,
                    title: template.title,
                    description: template.description,
                    type: template.type,
                    difficulty: template.difficulty,
                    category: template.category,
                    targetValue: template.targetValue,
                    xpReward: getXPReward(template.difficulty, user.level),
                    expiresAt,
                }
            })
        )
    );

    return quests;
}
