"use client";

import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw, CheckCircle, Volume2, VolumeX, Moon } from "lucide-react";
import { completeQuest } from "@/app/actions/quests";
import { useTimer } from "@/components/providers/TimerProvider";

interface TimerProps {
    initialMinutes?: number;
    questId?: string | null;
}

// Circumference is constant for r=142, computed once at module load
const CIRCLE_RADIUS = 142;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS;

// Digit spring transition — constant prevents re-creation on each render
const DIGIT_TRANSITION = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 0.8,
};

// Digit: memo prevents re-render when value unchanged (3 of 4 digits don't change each second)
const Digit = memo(function Digit({ value }: { value: string }) {
    return (
        <div className="relative h-[1.1em] w-[0.6em] flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                    key={value}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={DIGIT_TRANSITION}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute"
                >
                    {value}
                </motion.span>
            </AnimatePresence>
        </div>
    );
});

export default function Timer({ initialMinutes = 25, questId }: TimerProps) {
    const { timeLeft, setTimeLeft, isActive, setIsActive, questId: activeQuestId, setQuestId, resetTimer: contextReset } = useTimer();
    const [isMuted, setIsMuted] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

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
        return () => { document.title = "Habitopia | Productivity RPG"; };
    }, [isActive, timeLeft]);

    const toggleTimer = useCallback(() => setIsActive(!isActive), [isActive, setIsActive]);

    const resetTimer = useCallback(() => {
        contextReset(initialMinutes);
        setIsCompleted(false);
    }, [contextReset, initialMinutes]);

    const handleFinish = useCallback(async () => {
        setIsActive(false);
        setIsCompleted(true);
        if (activeQuestId) {
            await completeQuest(activeQuestId);
            setQuestId(undefined);
        }
    }, [activeQuestId, setIsActive, setQuestId]);

    useEffect(() => {
        if (timeLeft === 0 && !isCompleted && !isActive) {
            handleFinish();
        }
    }, [timeLeft, isCompleted, isActive, handleFinish]);

    // Memoize time parts — only recalculates when timeLeft changes
    const { m1, m2, s1, s2 } = useMemo(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        const mStr = mins.toString().padStart(2, '0');
        const sStr = secs.toString().padStart(2, '0');
        return { m1: mStr[0], m2: mStr[1], s1: sStr[0], s2: sStr[1] };
    }, [timeLeft]);

    // Memoize SVG progress — only recalculates when timeLeft or initialMinutes changes
    const strokeDashoffset = useMemo(
        () => CIRCUMFERENCE - (timeLeft / (initialMinutes * 60)) * CIRCUMFERENCE,
        [timeLeft, initialMinutes]
    );

    return (
        <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-12 w-full max-w-[320px] mx-auto">
            <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] flex items-center justify-center shrink-0">
                {/* Progress Circle */}
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 320 320" preserveAspectRatio="xMidYMid meet">
                    <circle
                        cx="160"
                        cy="160"
                        r={CIRCLE_RADIUS}
                        className="stroke-foreground/10"
                        strokeWidth="12"
                        fill="transparent"
                    />
                    <motion.circle
                        cx="160"
                        cy="160"
                        r={CIRCLE_RADIUS}
                        className="stroke-primary"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={CIRCUMFERENCE}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: "linear" }}
                    />
                </svg>

                {/* Time Display */}
                <div className="absolute flex flex-col items-center">
                    <div className="text-5xl sm:text-6xl tracking-tight font-extrabold text-foreground/50 dark:text-white flex items-center tabular-nums">
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
                    onClick={() => setIsMuted(m => !m)}
                    className="p-4 glass rounded-2xl text-foreground/50 dark:text-white/50 hover:text-foreground dark:hover:text-white transition cursor-pointer"
                >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleTimer}
                    className="w-20 h-20 rounded-3xl flex items-center justify-center bg-primary text-white shadow-glow transition-all cursor-pointer"
                >
                    {isActive ? <Pause className="fill-current w-8 h-8" /> : <Play className="fill-current w-8 h-8 ml-1" />}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1, rotate: -15 }}
                    whileTap={{ scale: 0.9, rotate: -45 }}
                    onClick={resetTimer}
                    className="p-4 glass rounded-2xl text-foreground/50 dark:text-white/50 hover:text-foreground dark:hover:text-white transition cursor-pointer"
                >
                    <RotateCcw className="w-6 h-6" />
                </motion.button>
            </div>

            {/* Completion State */}
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
