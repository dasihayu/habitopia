"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    const bio = formData.get("bio") as string;
    const interests = formData.get("interests")?.toString().split(",").filter(Boolean) || [];

    // Basic validation or sanitization could go here

    try {
        await prisma.user.update({
            where: { id: session.userId },
            data: {
                bio,
                interests,
            },
        });

        revalidatePath("/profile");
        return { success: true };
    } catch (error) {
        console.error("Failed to update profile:", error);
        return { error: "Failed to update profile" };
    }
}

export async function toggleFollow(targetUserId: string) {
    const session = await getSession();
    if (!session) return { error: "Not authenticated" };

    if (session.userId === targetUserId) {
        return { error: "Cannot follow yourself" };
    }

    try {
        const currentUser = await prisma.user.findUnique({
            where: { id: session.userId },
            include: { following: true }
        });

        const isFollowing = currentUser?.following.some((u: any) => u.id === targetUserId);

        if (isFollowing) {
            // Unfollow
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    following: {
                        disconnect: { id: targetUserId }
                    }
                }
            });
        } else {
            // Follow
            await prisma.user.update({
                where: { id: session.userId },
                data: {
                    following: {
                        connect: { id: targetUserId }
                    }
                }
            });
        }

        revalidatePath(`/profile/${targetUserId}`);
        revalidatePath("/profile");
        return { success: true, isFollowing: !isFollowing };
    } catch (error) {
        console.error("Failed to toggle follow", error);
        return { error: "Failed to update follow status" };
    }
}
