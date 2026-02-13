import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Settings, User, Camera, Shield, Save } from "lucide-react";
import { updateProfile } from "@/app/actions/settings";

async function getUserData() {
    const session = await getSession();
    if (!session) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
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
                    <form action={updateProfile} className="glass p-8 rounded-3xl space-y-8 border-white/5">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                                    <input
                                        name="username"
                                        type="text"
                                        defaultValue={user.username}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium"
                                        placeholder="HabitHero"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Profile Picture URL</label>
                                <div className="relative">
                                    <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                                    <input
                                        name="avatarUrl"
                                        type="text"
                                        defaultValue={user.avatarUrl || ""}
                                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium"
                                        placeholder="https://example.com/image.png"
                                    />
                                </div>
                                <p className="text-[10px] text-foreground/30 ml-1">Leave empty to use your default DiceBear avatar.</p>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-glow transition-all"
                        >
                            <Save className="w-5 h-5" />
                            Save Changes
                        </button>
                    </form>
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
