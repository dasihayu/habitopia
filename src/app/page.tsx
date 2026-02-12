import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
      </div>

      <header className="relative z-10 mb-12 animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-glow">
            <span className="text-3xl font-bold">H</span>
          </div>
        </div>
        <h1 className="text-6xl font-extrabold tracking-tight mb-4 gradient-text">
          Habitopia
        </h1>
        <p className="text-xl text-foreground/70 max-w-lg mx-auto">
          The self-generating productivity RPG. Stop planning. Start playing.
        </p>
      </header>

      <main className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Automated Quests</h3>
          <p className="text-sm text-foreground/60">System generates daily quests based on your behavior and interests.</p>
        </div>
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">RPG Leveling</h3>
          <p className="text-sm text-foreground/60">Earn XP, level up, and unlock achievements as you build real-life habits.</p>
        </div>
        <div className="glass p-8 rounded-2xl">
          <h3 className="text-xl font-bold mb-2">Deep Focus</h3>
          <p className="text-sm text-foreground/60">Built-in gamified timer to keep you in the zone and track progress.</p>
        </div>
      </main>

      <footer className="relative z-10 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <Link
          href="/register"
          className="px-8 py-4 bg-primary rounded-xl font-bold hover:brightness-110 transition shadow-glow"
        >
          Start Your Journey
        </Link>
        <Link
          href="/login"
          className="px-8 py-4 glass rounded-xl font-bold hover:bg-white/10 transition"
        >
          Resume Adventure
        </Link>
      </footer>
    </div>
  );
}
