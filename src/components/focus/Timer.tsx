"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle, Volume2, VolumeX, Moon } from "lucide-react";
import { completeQuest } from "@/app/actions/quests";
import { useTimer } from "@/components/providers/TimerProvider";

interface TimerProps {
    initialMinutes?: number;
    questId?: string | null;
}

const Digit = ({ value }: { value: string }) => {
    return (
        <div className="relative h-[1.1em] w-[0.6em] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={value}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 0.8
                    }}
                    className="absolute"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
};

export default function Timer({ initialMinutes = 25, questId }: TimerProps) {
    const { timeLeft, setTimeLeft, isActive, setIsActive, questId: activeQuestId, setQuestId, resetTimer: contextReset } = useTimer();
    const [isMuted, setIsMuted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Initialize questId if provided and not already playing something else
    useEffect(() => {
        if (questId && questId !== activeQuestId && !isActive) {
            setQuestId(questId);
        }
    }, [questId, activeQuestId, isActive, setQuestId]);

    // Sync with tab title
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            document.title = `(${mins}:${secs < 10 ? "0" : ""}${secs}) Habitopia | Focus`;
        } else {
            document.title = "Habitopia | Focus";
        }
        return () => {
            document.title = "Habitopia | Productivity RPG";
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        contextReset(initialMinutes);
        setIsCompleted(false);
    };

    const handleFinish = useCallback(async () => {
        setIsActive(false);
        setIsCompleted(true);
        if (!isMuted) {
            // Audio notification could go here
        }

        if (activeQuestId) {
            await completeQuest(activeQuestId);
            setQuestId(undefined);
        }
    }, [activeQuestId, isMuted, setIsActive, setQuestId]);

    // Check completion condition
    useEffect(() => {
        if (timeLeft === 0 && !isCompleted && !isActive) {
            // Note: TimerContext sets isActive to false when timeLeft hit 0
            handleFinish();
        }
    }, [timeLeft, isCompleted, isActive, handleFinish]);

    const getTimeParts = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        
        const mStr = mins.toString().padStart(2, '0');
        const sStr = secs.toString().padStart(2, '0');
        
        return {
            m1: mStr[0],
            m2: mStr[1],
            s1: sStr[0],
            s2: sStr[1]
        };
    };

    const { m1, m2, s1, s2 } = getTimeParts(timeLeft);

    const circumference = 2 * Math.PI * 120;
    const progress = (timeLeft / (initialMinutes * 60)) * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-12">
            <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Progress Circle */}
                <svg className="w-full h-full -rotate-90 transform">
                    <circle
                        cx="160"
                        cy="160"
                        r="120"
                        className="stroke-white/5"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="160"
                        cy="160"
                        r="120"
                        className="stroke-primary shadow-glow"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={circumference}
                        animate={{ strokeDashoffset: circumference - progress }}
                        transition={{ duration: 0.5, ease: "linear" }}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute flex flex-col items-center">
                    <div className="text-7xl font-black text-white flex items-center tabular-nums">
                        <Digit value={m1} />
                        <Digit value={m2} />
                        <span className="mx-1 opacity-50 relative -top-1">:</span>
                        <Digit value={s1} />
                        <Digit value={s2} />
                    </div>
                    <span className="text-foreground/40 text-sm font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Moon className="w-4 h-4" /> Focus Mode
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-4 glass rounded-2xl text-foreground/50 hover:text-white transition cursor-pointer"
                >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-shadow shadow-glow cursor-pointer ${isActive ? "bg-white/10 text-white" : "bg-primary text-white"
                        }`}
                >
                    {isActive ? <Pause className="fill-current w-8 h-8" /> : <Play className="fill-current w-8 h-8 ml-1" />}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9, rotate: -45 }}
                    onClick={resetTimer}
                    className="p-4 glass rounded-2xl text-foreground/50 hover:text-white transition cursor-pointer"
                >
                    <RotateCcw className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Completion Modal / State */}
            <AnimatePresence>
                {isCompleted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass p-8 rounded-3xl text-center space-y-4 border-primary/30"
                    >
                        <CheckCircle className="w-12 h-12 text-primary mx-auto" />
                        <h4 className="text-2xl font-bold">Focus Session Complete</h4>
                        <p className="text-foreground/50">Great work! Your quest has been rewarded with XP.</p>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={resetTimer}
                            className="px-8 py-3 bg-primary rounded-xl font-bold shadow-glow text-white w-full cursor-pointer"
                        >
                            Start Another Session
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
