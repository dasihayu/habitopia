import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const achievements = [
        {
            name: "First Quest",
            description: "Complete your very first quest in Habitopia.",
            icon: "Award",
            xpBonus: 100,
            requirementKey: "first_quest",
        },
        {
            name: "3 Day Streak",
            description: "Maintain your habit for 3 consecutive days.",
            icon: "Zap",
            xpBonus: 300,
            requirementKey: "streak_3",
        },
        {
            name: "7 Day Streak",
            description: "A full week of productivity! Amazing.",
            icon: "Flame",
            xpBonus: 1000,
            requirementKey: "streak_7",
        },
        {
            name: "Night Owl",
            description: "Complete 5 quests during late night hours.",
            icon: "Moon",
            xpBonus: 500,
            requirementKey: "night_owl",
        },
        {
            name: "Early Bird",
            description: "Complete 5 quests before 8:00 AM.",
            icon: "Sun",
            xpBonus: 500,
            requirementKey: "early_bird",
        },
        {
            name: "Deep Focus",
            description: "Complete a focus session of at least 60 minutes.",
            icon: "Timer",
            xpBonus: 400,
            requirementKey: "deep_focus",
        },
        {
            name: "Marathon",
            description: "Complete 5 quests in a single day.",
            icon: "Trophy",
            xpBonus: 600,
            requirementKey: "marathon",
        },
    ];

    console.log("Seeding achievements...");
    for (const achievement of achievements) {
        await prisma.achievement.upsert({
            where: { name: achievement.name },
            update: {},
            create: achievement,
        });
    }
    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
