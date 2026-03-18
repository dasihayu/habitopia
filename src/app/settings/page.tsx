import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
<<<<<<< HEAD
import { Settings, User, Camera, Shield, Save } from "lucide-react";
=======
import { Settings, Shield } from "lucide-react";
>>>>>>> origin/jidan
import SettingsForm from "@/components/settings/SettingsForm";

async function getUserData() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            username: true,
            avatarUrl: true,
        }
    });

    if (!user) redirect("/login");
    return user;
}

export default async function SettingsPage() {
    const user = await getUserData();

    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-12">
            <header className="space-y-2">
                <h2 className="text-4xl font-extrabold flex items-center gap-3 gradient-text">
                    <Settings className="w-10 h-10" />
                    Settings
                </h2>
                <p className="text-foreground/50 text-lg">Configure your player profile and preferences.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                    <SettingsForm user={user} />
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-3xl bg-primary/5 border-primary/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-6 h-6 text-primary" />
                            <h4 className="font-bold">Privacy & Data</h4>
                        </div>
                        <p className="text-sm text-foreground/50 leading-relaxed mb-6">
                            Your data is stored securely on our RPG servers. We never sell your habit data to third parties.
                        </p>
                        <button className="text-sm font-bold text-red-400 hover:underline">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
