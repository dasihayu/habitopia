"use client";

import { useState } from "react";
import { User, Shield, Zap, TrendingUp, History, Star, Trophy, Calendar, Pencil, Share2, UserPlus, UserCheck } from "lucide-react";
import PlayerHUD from "@/components/dashboard/PlayerHUD";
import Modal from "@/components/ui/Modal";
import { updateProfile, toggleFollow } from "@/app/actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileView({ user, isOwnProfile }: { user: any, isOwnProfile: boolean }) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false); // Should be passed as prop for public view
    const router = useRouter();

    async function handleUpdateProfile(formData: FormData) {
        const result = await updateProfile(formData);
        if (result.success) {
            toast.success("Profile updated!");
            setIsEditModalOpen(false);
            router.refresh();
        } else {
            toast.error(result.error);
        }
    }

    async function handleFollow() {
        if (isOwnProfile) return;
        // This is a placeholder; real implementation needs current user context check
        toast.info("Follow feature coming soon to public profiles!");
    }

    return (
        <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
            <div className="flex flex-col gap-4">
                <PlayerHUD
                    user={user}
                    actions={
                        isOwnProfile ? (
                            <>
                                <button
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="glass p-3 rounded-xl hover:bg-white/10 transition-colors"
                                    title="Edit Profile"
                                >
                                    <Pencil className="w-5 h-5 text-foreground/70" />
                                </button>
                                <button
                                    className="glass p-3 rounded-xl hover:bg-white/10 transition-colors"
                                    title="Share Profile"
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${window.location.origin}/profile/${user.username}`);
                                        toast.success("Profile link copied!");
                                    }}
                                >
                                    <Share2 className="w-5 h-5 text-foreground/70" />
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleFollow}
                                className={`glass px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors ${isFollowing ? 'bg-primary/20 text-primary' : 'hover:bg-white/10'}`}
                            >
                                {isFollowing ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                {isFollowing ? "Following" : "Follow"}
                            </button>
                        )
                    }
                />
            </div>

            {/* Bio Section */}
            {user.bio && (
                <div className="glass p-6 rounded-3xl text-center md:text-left">
                    <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-2">About</h4>
                    <p className="text-foreground/80 leading-relaxed">{user.bio}</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats Cards */}
                <div className="space-y-6">
                    <div className="glass p-8 rounded-3xl border-primary/20">
                        <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Player Statistics
                        </h4>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Total XP Gained</span>
                                <span className="text-xl font-bold text-primary">{user.xp + (user.level > 1 ? (user.level - 1) * 1000 : 0)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Level</span>
                                <span className="text-xl font-bold">{user.level}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Quests Completed</span>
                                <span className="text-xl font-bold">{user.questHistory.length}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Longest Streak</span>
                                <span className="text-xl font-bold">{user.streak} days</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Followers</span>
                                <span className="text-xl font-bold">{user.followedBy?.length || 0}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-foreground/60">Following</span>
                                <span className="text-xl font-bold">{user.following?.length || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl bg-primary/5">
                        <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Star className="w-4 h-4 text-yellow-500" />
                            Recent Achievements
                        </h4>
                        <div className="flex flex-wrap gap-3">
                            {user.achievements.slice(0, 4).map((ua: any) => (
                                <div key={ua.id} className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 hover:border-primary/50 transition-colors cursor-help" title={ua.achievement.name}>
                                    <Trophy className="w-6 h-6 text-primary" />
                                </div>
                            ))}
                            {user.achievements.length === 0 && <p className="text-xs text-foreground/30 italic">No achievements yet.</p>}
                        </div>
                    </div>
                </div>

                {/* Right Column: Quest History */}
                <div className="lg:col-span-2">
                    <div className="glass p-8 rounded-3xl h-full border-white/5 bg-white/[0.01]">
                        <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-8 flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            Activity History
                        </h4>

                        <div className="space-y-4">
                            {user.questHistory.length === 0 ? (
                                <div className="text-center py-20 text-foreground/20">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No activity recorded yet.</p>
                                </div>
                            ) : (
                                user.questHistory.map((item: any) => (
                                    <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                                        <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-foreground/40 group-hover:text-primary transition-colors">
                                            <Shield className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-bold">{item.title}</div>
                                            <div className="text-[10px] text-foreground/30 uppercase font-black flex items-center gap-2 mt-0.5">
                                                <span className="text-green-500/50">Mastered</span> • {new Date(item.completedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-primary font-black">+{item.xpGained} XP</div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile">
                <form action={handleUpdateProfile} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-bold text-foreground/70">Bio</label>
                        <textarea
                            name="bio"
                            id="bio"
                            defaultValue={user.bio || ""}
                            className="w-full bg-black/5 border border-white/10 rounded-xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Tell us about yourself..."
                        />
                    </div>
                    {/* Add more fields like interests here if needed */}
                    <button type="submit" className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 transition-all">
                        Save Changes
                    </button>
                </form>
            </Modal>
        </div>
    );
}
