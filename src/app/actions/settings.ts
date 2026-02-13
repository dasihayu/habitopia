"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const username = formData.get("username") as string;
    const avatarUrl = formData.get("avatarUrl") as string;

    try {
        // Check if username is taken by someone else
        if (username) {
            const existing = await prisma.user.findUnique({
                where: { username },
            });
            if (existing && existing.id !== session.userId) {
                return { error: "Username already taken" };
            }
        }

        await prisma.user.update({
            where: { id: session.userId },
            data: {
                username: username || undefined,
                avatarUrl: avatarUrl || undefined,
            },
        });

        revalidatePath("/profile");
        revalidatePath("/dashboard");
        revalidatePath("/settings");

        return { success: true };
    } catch (e) {
        console.error(e);
        return { error: "Failed to update profile" };
    }
}
