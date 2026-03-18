"use client";

import { useState } from "react";
import { completeQuest } from "@/app/actions/quests";
import { Sword, CheckCircle, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Quest {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    difficulty: "EASY" | "MEDIUM" | "HARD" | "LEGENDARY";
    category: string;
}

interface QuestListProps {
    initialQuests: Quest[];
}

export default function QuestList({ initialQuests }: QuestListProps) {
    const [quests, setQuests] = useState<Quest[]>(initialQuests);
    const [completing, setCompleting] = useState<string | null>(null);

    async function handleComplete(id: string) {
        setCompleting(id);
        const res = await completeQuest(id);
        if ('success' in res && res.success) {
            setQuests(prev => prev.filter(q => q.id !== id));
            // In a real app, you might want to show a level-up animation or toast here
        }
        setCompleting(null);
    }

    return (
        <div className="space-y-6">
            <AnimatePresence mode="popLayout">
                {quests.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="glass p-16 text-center rounded-3xl border-dashed border-border/40 bg-foreground/[0.02]"
                    >
                        <CheckCircle className="w-16 h-16 text-primary/20 mx-auto mb-6" />
                        <h3 className="text-2xl font-bold mb-2">Victory!</h3>
                        <p className="text-foreground/40 max-w-xs mx-auto">You've mastered all your challenges for today. Come back tomorrow for a new set of quests.</p>
                    </motion.div>
                ) : (
                    quests.map((quest) => (
                        <motion.div
                            key={quest.id}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0 }}
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className="glass p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 group relative overflow-hidden"
                        >
                            {/* Visual Accent */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${quest.difficulty === 'HARD' ? 'bg-red-500' :
                                quest.difficulty === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'
                                } opacity-50`} />

                            <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                                <Target className="w-8 h-8 text-primary/60 group-hover:text-primary transition-colors" />
                            </div>

                            <div className="flex-1 min-w-0 text-center md:text-left space-y-1">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
                                    <span className="text-[10px] bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-full text-foreground/40 font-bold uppercase tracking-wider">
                                        {quest.category}
                                    </span>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${quest.difficulty === 'HARD' ? 'text-red-400 bg-red-400/10' :
                                        quest.difficulty === 'MEDIUM' ? 'text-orange-400 bg-orange-400/10' : 'text-green-400 bg-green-400/10'
                                        }`}>
                                        {quest.difficulty}
                                    </span>
                                </div>
                                <h4 className="text-xl font-bold group-hover:text-primary transition-colors uppercase tracking-tight truncate">{quest.title}</h4>
                                <p className="text-sm text-foreground/50 leading-relaxed line-clamp-2">{quest.description}</p>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
                                <div className="text-3xl font-black gradient-text">+{quest.xpReward} XP</div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleComplete(quest.id)}
                                    disabled={completing === quest.id}
                                    className="px-8 py-3 bg-primary/20 text-primary border border-primary/30 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all shadow-glow flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group-hover:bg-primary/30"
                                >
                                    {completing === quest.id ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>Complete <CheckCircle className="w-4 h-4 transition-transform group-hover:scale-125 group-hover:rotate-12" /></>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    ))
                )}
            </AnimatePresence>
        </div>
    );
}
