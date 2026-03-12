"use client";

import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { Sword, Trophy, Timer, Sparkles, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="relative min-h-screen bg-background overflow-x-hidden font-sans">
      <Header />

      {/* Premium Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-40 translate-z-0">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[80px] animate-mesh" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[80px] animate-mesh" style={{ animationDelay: "-5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full scale-110 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full scale-90 pointer-events-none" />
      </div>

      <main className="relative z-10 pt-32 pb-20">
        {/* Hero Section */}
        <section className="px-6 mb-32">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-pill border-white/10 mb-8 text-sm font-medium text-primary shadow-glow relative overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span>Next Gen Productivity is Here</span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 sm:mb-8 leading-[1.1]"
            >
              Master Your Habits,<br />
              <span className="gradient-text italic">Conquer Your Life.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed px-4"
            >
              The first self-generating productivity RPG. Habitopia turns your daily goals into epic quests, leveling up your digital character while you level up in real life.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-6">
              <Link
                href="/register"
                className="w-full sm:w-auto group relative px-8 sm:px-10 py-4 sm:py-5 bg-primary text-white rounded-2xl font-black text-lg shadow-glow hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden shimmer-effect"
              >
                Start Your Journey
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 glass-premium rounded-2xl font-bold text-lg hover:bg-white/5 active:scale-95 transition-all text-foreground/80 text-center"
              >
                Resume Adventure
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="px-6 mb-32">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-5xl font-black mb-4">Core Mechanics</h2>
              <p className="text-foreground/50">Everything you need to turn discipline into a game.</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Automated Quests",
                  desc: "Our AI engine analyzes your habits and goals to generate customized daily quests that keep you challenged but not overwhelmed.",
                  icon: Sword,
                  color: "from-blue-500/20 to-cyan-500/20",
                  textColor: "text-blue-400"
                },
                {
                  title: "RPG Progression",
                  desc: "Earn XP, gain levels, and find rare loot. Every habit successfully built strengthens your character's stats and unlocks new perks.",
                  icon: Trophy,
                  color: "from-amber-500/20 to-orange-500/20",
                  textColor: "text-amber-400"
                },
                {
                  title: "Deep Focus Flow",
                  desc: "Enter 'The Zone' with our gamified focus timer. Block distractions and earn bonus rewards for sustained productive sessions.",
                  icon: Timer,
                  color: "from-purple-500/20 to-pink-500/20",
                  textColor: "text-purple-400"
                }
              ].map((feat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass-premium p-10 rounded-[2.5rem] border-white/5 flex flex-col items-start relative overflow-hidden group"
                >
                  <div className={cn("absolute top-0 right-0 w-32 h-32 blur-[80px] -mr-10 -mt-10 opacity-20 transition-opacity group-hover:opacity-40", feat.color)} />
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-2xl bg-background/50 border border-white/5", feat.textColor)}>
                    <feat.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black mb-4">{feat.title}</h3>
                  <p className="text-foreground/50 leading-relaxed text-sm">
                    {feat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto rounded-[3rem] overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
            
            <div className="relative z-10 py-20 px-10 text-center text-white">
              <Zap className="w-12 h-12 mx-auto mb-6 text-white animate-pulse" />
              <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to Level Up?</h2>
              <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto mb-10">
                Join thousands of players who have transformed their lives into a high-performance adventure.
              </p>
              <Link
                href="/register"
                className="inline-block px-12 py-5 bg-white text-primary rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-2xl"
              >
                Create Free Account
              </Link>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
