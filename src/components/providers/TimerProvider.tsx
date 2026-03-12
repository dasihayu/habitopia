"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface TimerContextType {
    timeLeft: number;
    isActive: boolean;
    questId: string | undefined;
    setTimeLeft: (time: number) => void;
    setIsActive: (active: boolean) => void;
    setQuestId: (id: string | undefined) => void;
    resetTimer: (minutes: number) => void;
    toggleTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [questId, setQuestId] = useState<string | undefined>(undefined);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = (minutes: number) => {
        setIsActive(false);
        setTimeLeft(minutes * 60);
    };

    return (
        <TimerContext.Provider value={{
            timeLeft,
            isActive,
            questId,
            setTimeLeft,
            setIsActive,
            setQuestId,
            resetTimer,
            toggleTimer
        }}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
}
