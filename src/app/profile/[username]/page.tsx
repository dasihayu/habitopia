import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProfileView from "@/components/profile/ProfileView";

interface PublicProfilePageProps {
    params: { username: string };
}

async function getPublicProfileData(username: string) {
    const user = await prisma.user.findUnique({
        where: { username },
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

    return user;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
    const session = await getSession();
    // In Next.js 15+, params is a Promise. If using older version, it's object. 
    // Safest to await if possible or treat as object depending on version. 
    // Provided info says Next.js 16.1.6, so params is a Promise.
    const { username } = await params;

    const user = await getPublicProfileData(username);

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <h1 className="text-4xl font-bold text-foreground/20">404</h1>
                <p className="text-foreground/50">User not found</p>
            </div>
        );
    }

    const isOwnProfile = session?.userId === user.id;

    if (isOwnProfile) {
        redirect("/profile");
    }

    return <ProfileView user={user} isOwnProfile={false} />;
}
