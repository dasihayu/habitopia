"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { completeOnboarding } from "@/app/actions/auth";
import {
    Dumbbell,
    Code,
    BookOpen,
    PenTool,
    Stethoscope,
    Zap,
    Users,
    Sparkles,
    Search,
    CheckCircle2
} from "lucide-react";

const INTERESTS = [
    { id: "study", label: "Study / Learning", icon: BookOpen },
    { id: "fitness", label: "Fitness", icon: Dumbbell },
    { id: "reading", label: "Reading", icon: Search },
    { id: "coding", label: "Coding", icon: Code },
    { id: "writing", label: "Writing", icon: PenTool },
    { id: "meditation", label: "Meditation", icon: Sparkles },
    { id: "health", label: "Health", icon: Stethoscope },
    { id: "creativity", label: "Creativity", icon: Zap },
    { id: "social", label: "Social", icon: Users },
    { id: "productivity", label: "Productivity", icon: CheckCircle2 },
];

const INTENSITIES = [
    { id: "CASUAL", label: "Casual", desc: "For a relaxed experience" },
    { id: "BALANCED", label: "Balanced", desc: "The standard RPG challenge" },
    { id: "HARDCORE", label: "Hardcore", desc: "Maximum growth, high effort" },
];

const HOURS = [
    { id: "morning", label: "Morning Owl", time: "6am - 12pm" },
    { id: "afternoon", label: "Midday Warrior", time: "12pm - 6pm" },
    { id: "night", label: "Night Shade", time: "6pm - 6am" },
];

export default function OnboardingPage() {
    const [step, setStep] = useState(1);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [intensity, setIntensity] = useState("BALANCED");
    const [activeHours, setActiveHours] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleHour = (id: string) => {
        setActiveHours(prev =>
            prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
        );
    };

    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    async function handleFinish() {
        setLoading(true);
        const formData = new FormData();
        formData.append("interests", selectedInterests.join(","));
        formData.append("intensity", intensity);
        formData.append("activeHours", activeHours.join(","));

        await completeOnboarding(formData);
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
            <div className="w-full max-w-2xl relative">
                {/* Progress Bar */}
                <div className="absolute -top-12 left-0 w-full h-1 bg-black/10 dark:bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary shadow-glow"
                        initial={{ width: "33%" }}
                        animate={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="glass p-8 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-2 gradient-text">Choose Interests</h2>
                            <p className="text-foreground/60 mb-8">Select at least 3 to help us generate your first quests.</p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {INTERESTS.map(({ id, label, icon: Icon }) => (
                                    <button
                                        key={id}
                                        onClick={() => toggleInterest(id)}
                                        className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all ${selectedInterests.includes(id)
                                                ? "bg-primary/20 border-primary shadow-glow"
                                                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10"
                                            }`}
                                    >
                                        <Icon className={`w-8 h-8 mb-3 ${selectedInterests.includes(id) ? "text-primary" : "text-foreground/60"}`} />
                                        <span className="text-sm font-medium">{label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button
                                    onClick={nextStep}
                                    disabled={selectedInterests.length < 1}
                                    className="px-8 py-3 bg-primary rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition hover:brightness-110"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="glass p-8 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-2 gradient-text">Choose Intensity</h2>
                            <p className="text-foreground/60 mb-8">How much effort do you want to invest daily?</p>

                            <div className="space-y-4">
                                {INTENSITIES.map(({ id, label, desc }) => (
                                    <button
                                        key={id}
                                        onClick={() => setIntensity(id)}
                                        className={`w-full text-left p-6 rounded-2xl border transition-all ${intensity === id
                                                ? "bg-primary/20 border-primary shadow-glow"
                                                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-xl font-bold">{label}</span>
                                            {intensity === id && <CheckCircle2 className="text-primary w-6 h-6" />}
                                        </div>
                                        <p className="text-sm text-foreground/60">{desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button onClick={prevStep} className="px-8 py-3 glass rounded-xl font-bold hover:bg-foreground/5 transition-colors">Back</button>
                                <button onClick={nextStep} className="px-8 py-3 bg-primary rounded-xl font-bold hover:brightness-110">Continue</button>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            className="glass p-8 rounded-2xl"
                        >
                            <h2 className="text-3xl font-bold mb-2 gradient-text">Active Hours</h2>
                            <p className="text-foreground/60 mb-8">When are you most productive?</p>

                            <div className="space-y-4">
                                {HOURS.map(({ id, label, time }) => (
                                    <button
                                        key={id}
                                        onClick={() => toggleHour(id)}
                                        className={`w-full text-left p-6 rounded-2xl border transition-all ${activeHours.includes(id)
                                                ? "bg-primary/20 border-primary shadow-glow"
                                                : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10"
                                            }`}
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <div>
                                                <span className="text-lg font-bold block">{label}</span>
                                                <span className="text-sm text-foreground/40">{time}</span>
                                            </div>
                                            {activeHours.includes(id) && <CheckCircle2 className="text-primary w-6 h-6" />}
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="mt-8 flex justify-between">
                                <button onClick={prevStep} className="px-8 py-3 glass rounded-xl font-bold hover:bg-foreground/5 transition-colors">Back</button>
                                <button
                                    onClick={handleFinish}
                                    disabled={loading || activeHours.length === 0}
                                    className="px-8 py-3 bg-primary rounded-xl font-bold hover:brightness-110 shadow-glow disabled:opacity-50"
                                >
                                    {loading ? "Generating Quests..." : "Enter Habitopia"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
