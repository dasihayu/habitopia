"use strict";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function register(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

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
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

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

import { getSession } from "@/lib/auth";

export async function completeOnboarding(formData: FormData) {
    const session = await getSession();
    if (!session) redirect("/login");

    const interests = formData.get("interests")?.toString().split(",") || [];
    const intensity = formData.get("intensity") as string;
    const activeHours = formData.get("activeHours")?.toString().split(",") || [];

    try {
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                interests,
                intensity: intensity as any, // Cast to enum
                activeHours,
                isOnboarded: true,
            },
        });

        revalidatePath("/dashboard");
    } catch (e) {
        console.error(e);
        return { error: "Failed to save preferences" };
    }

    redirect("/dashboard");
}
