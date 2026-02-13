"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle, Volume2, VolumeX, Moon } from "lucide-react";
import { completeQuest } from "@/app/actions/quests";

interface TimerProps {
    initialMinutes?: number;
    questId?: string | null;
}

export default function Timer({ initialMinutes = 25, questId }: TimerProps) {
    const [seconds, setSeconds] = useState(initialMinutes * 60);
    const [isActive, setIsActive] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Sync with tab title
    useEffect(() => {
        if (isActive && seconds > 0) {
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            document.title = `(${mins}:${secs < 10 ? "0" : ""}${secs}) Habitopia | Focus`;
        } else {
            document.title = "Habitopia | Focus";
        }
        return () => {
            document.title = "Habitopia | Productivity RPG";
        };
    }, [isActive, seconds]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(initialMinutes * 60);
        setIsCompleted(false);
    };

    const handleFinish = useCallback(async () => {
        setIsActive(false);
        setIsCompleted(true);
        if (!isMuted) {
            // Audio notification could go here
        }

        if (questId) {
            await completeQuest(questId);
        }
    }, [questId, isMuted]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && seconds > 0) {
            interval = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);
        } else if (seconds === 0 && !isCompleted) {
            handleFinish();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive, seconds, isCompleted, handleFinish]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const circumference = 2 * Math.PI * 120;
    const progress = (seconds / (initialMinutes * 60)) * circumference;

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
                    <motion.span
                        className="text-7xl font-black text-white"
                        key={seconds}
                        initial={{ scale: 0.95, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                    >
                        {formatTime(seconds)}
                    </motion.span>
                    <span className="text-foreground/40 text-sm font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                        <Moon className="w-4 h-4" /> Focus Mode
                    </span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-4 glass rounded-2xl text-foreground/50 hover:text-white transition"
                >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>

                <button
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all shadow-glow ${isActive ? "bg-white/10 text-white" : "bg-primary text-white"
                        }`}
                >
                    {isActive ? <Pause className="fill-current w-8 h-8" /> : <Play className="fill-current w-8 h-8 ml-1" />}
                </button>

                <button
                    onClick={resetTimer}
                    className="p-4 glass rounded-2xl text-foreground/50 hover:text-white transition"
                >
                    <RotateCcw className="w-6 h-6" />
                </button>
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
                        <button
                            onClick={resetTimer}
                            className="px-8 py-3 bg-primary rounded-xl font-bold shadow-glow"
                        >
                            Start Another Session
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
