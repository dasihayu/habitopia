"use server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession, getSession } from "@/lib/auth";
import { generateDailyQuests } from "@/lib/quest-engine";
import { Intensity } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const VALID_INTENSITIES = new Set<Intensity>(["CASUAL", "BALANCED", "HARDCORE"]);
const VALID_ACTIVE_HOURS = new Set(["morning", "afternoon", "night"]);
const VALID_INTERESTS = new Set([
    "study",
    "fitness",
    "reading",
    "coding",
    "health",
    "productivity",
]);

function parseListField(value: FormDataEntryValue | null) {
    if (typeof value !== "string") return [];

    return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

export async function register(formData: FormData) {
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (!username || !password) {
        return { error: "Username and password are required" };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return { error: "Username already taken" };
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                passwordHash,
                interests: [],
                activeHours: [],
                intensity: "BALANCED",
                isOnboarded: false,
            },
        });

        await createSession(user.id);
    } catch (e) {
        console.error(e);
        return { error: "Something went wrong" };
    }

    redirect("/onboarding");
}

export async function login(formData: FormData) {
    const username = formData.get("username")?.toString().trim() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    if (!username || !password) {
        return { error: "Username and password are required" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return { error: "Invalid credentials" };
        }

        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return { error: "Invalid credentials" };
        }

        await createSession(user.id);
    } catch (e) {
        console.error(e);
        return { error: "Something went wrong" };
    }

    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}

export async function completeOnboarding(formData: FormData) {
    const session = await getSession();
    if (!session) redirect("/login");

    const interests = parseListField(formData.get("interests")).filter((interest) => VALID_INTERESTS.has(interest));
    const intensity = formData.get("intensity")?.toString() ?? "";
    const activeHours = parseListField(formData.get("activeHours")).filter((hour) => VALID_ACTIVE_HOURS.has(hour));

    if (interests.length === 0) {
        return { error: "Select at least one supported interest" };
    }

    if (!VALID_INTENSITIES.has(intensity as Intensity)) {
        return { error: "Invalid intensity" };
    }

    if (activeHours.length === 0) {
        return { error: "Select at least one active hour" };
    }

    try {
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                interests,
                intensity: intensity as Intensity,
                activeHours,
                isOnboarded: true,
            },
        });

        // Generate first week of quests (or just first day for now as per system logic)
        await generateDailyQuests(session.userId);

        revalidatePath("/dashboard");
    } catch (e) {
        console.error(e);
        return { error: "Failed to save preferences" };
    }

    redirect("/dashboard");
}
