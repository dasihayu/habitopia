"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";
import { createCustomQuest } from "@/app/actions/custom-quest";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";

import { m } from "framer-motion";

export default function CreateQuestModal() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        const result = await createCustomQuest(formData);
        if (result.success) {
            toast.success("Quest created!");
            setIsOpen(false);
            router.refresh();
        } else {
            toast.error(result.error);
        }
    }

    return (
        <>
            <m.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-bold hover:brightness-110 shadow-glow"
            >
                <Plus className="w-5 h-5" />
                Create Quest
            </m.button>

            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Custom Quest">
                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-bold text-foreground/70">Quest Title</label>
                        <input
                            type="text"
                            name="title"
                            required
                            placeholder="e.g. Read 10 pages"
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:scale-[1.01]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-bold text-foreground/70">Description</label>
                        <textarea
                            name="description"
                            required
                            placeholder="Describe your goal..."
                            className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 min-h-[100px] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:scale-[1.01]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="difficulty" className="text-sm font-bold text-foreground/70">Difficulty</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['EASY', 'MEDIUM', 'HARD'].map((level) => (
                                <m.label whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} key={level} className="cursor-pointer">
                                    <input type="radio" name="difficulty" value={level} className="peer sr-only" required defaultChecked={level === 'EASY'} />
                                    <div className="p-3 rounded-xl border border-black/10 dark:border-white/10 text-center text-sm font-bold peer-checked:bg-primary/20 peer-checked:border-primary peer-checked:text-primary transition-all hover:bg-black/5 dark:hover:bg-white/5">
                                        {level}
                                    </div>
                                </m.label>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-primary mt-0.5 animate-pulse" />
                        <div className="text-xs text-foreground/60">
                            XP Reward will be calculated automatically based on difficulty and your current level.
                        </div>
                    </div>

                    <m.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:brightness-110 shadow-glow cursor-pointer"
                    >
                        Create Quest
                    </m.button>
                </form>
            </Modal>
        </>
    );
}
