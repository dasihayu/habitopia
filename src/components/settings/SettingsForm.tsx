"use client";

import { useState } from "react";
import { User, Camera, Save, Loader2 } from "lucide-react";
import { updateProfile } from "@/app/actions/settings";
import { toast } from "sonner";

interface SettingsFormProps {
    user: {
        username: string;
        avatarUrl: string | null;
    };
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await updateProfile(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Profile updated successfully!");
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="glass p-8 rounded-3xl space-y-8 border-white/5">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20" />
                        <input
                            name="username"
                            type="text"
                            defaultValue={user.username}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium text-foreground"
                            placeholder="HabitHero"
                            required
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
                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition font-medium text-foreground"
                            placeholder="https://example.com/image.png"
                        />
                    </div>
                    <p className="text-[10px] text-foreground/30 ml-1">Leave empty to use your default DiceBear avatar.</p>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:brightness-110 shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Save className="w-5 h-5" />
                )}
                {isLoading ? "Saving..." : "Save Changes"}
            </button>
        </form>
    );
}
