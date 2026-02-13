import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileView from "@/components/profile/ProfileView";

async function getProfileData() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        include: {
            questHistory: {
                orderBy: { completedAt: "desc" },
                take: 10,
            },
            achievements: {
                include: { achievement: true },
            },
            followedBy: true,
            following: true,
        },
    });

    if (!user) redirect("/login");

    return user;
}

export default async function ProfilePage() {
    const user = await getProfileData();
    return <ProfileView user={user} isOwnProfile={true} />;
}
