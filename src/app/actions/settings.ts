"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const username = formData.get("username") as string;
    const file = formData.get("avatar") as File;
    console.log("FILE:", file);

    try {
        let avatarUrl = undefined;

         if (file && file.size > 0) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const fileName = Date.now() + "-" + file.name;

            const fs = require("fs");
            const path = `./public/uploads/${fileName}`;

            fs.writeFileSync(path, buffer);

            avatarUrl = `/uploads/${fileName}`;
        }

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
