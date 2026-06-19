import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center flex-1 min-h-screen px-6 py-24 overflow-hidden bg-bg-deep text-foreground">
      {/* Premium ambient glow background */}
      <div className="glow-backdrop" />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Animated Brand Header */}
        <div className="mb-6 hover:scale-[1.02] transition-transform duration-300">
          <Image
            src="/logo.png"
            alt="Pertu MI Logo"
            width={280}
            height={100}
            priority
            className="object-contain"
          />
        </div>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-muted mb-12">
          Local-first, zero-config multi-screen display system for live podcast operators.
        </p>

        {/* Dual Mode Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 max-w-3xl mx-auto text-left">
          {/* Operator Panel Card */}
          <Link
            href="/control"
            className="group block relative p-8 rounded-2xl glass-panel border border-slate-border hover:border-indigo-primary/40 transition-all duration-300 hover:shadow-[0_0_30px_hsla(var(--primary)/0.15)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-primary/10 text-indigo-primary font-bold text-lg border border-indigo-primary/20 group-hover:scale-105 transition-transform">
                🎛️
              </span>
              <h2 className="text-xl font-bold group-hover:text-indigo-primary transition-colors font-sans">
                Operator Dashboard
              </h2>
            </div>
            <p className="text-slate-muted leading-relaxed font-sans">
              Open on the host laptop. Type prompts, responses, and click broadcast to dynamically update the presenter view.
            </p>
            <div className="mt-6 flex items-center text-sm font-semibold text-indigo-primary group-hover:translate-x-1 transition-transform">
              Launch Control Panel &rarr;
            </div>
          </Link>

          {/* Projector View Card */}
          <Link
            href="/projector"
            className="group block relative p-8 rounded-2xl glass-panel border border-slate-border hover:border-accent-amber/40 transition-all duration-300 hover:shadow-[0_0_30px_hsla(var(--accent)/0.15)]"
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent-amber/10 text-accent-amber font-bold text-lg border border-accent-amber/20 group-hover:scale-105 transition-transform">
                📺
              </span>
              <h2 className="text-xl font-bold group-hover:text-accent-amber transition-colors font-sans">
                Presenter Canvas
              </h2>
            </div>
            <p className="text-slate-muted leading-relaxed font-sans">
              Open on the guest monitor or projector screen. Displays floating logos, wipes prompts, and types out responses.
            </p>
            <div className="mt-6 flex items-center text-sm font-semibold text-accent-amber group-hover:translate-x-1 transition-transform">
              Launch Presenter Screen &rarr;
            </div>
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-sm text-slate-muted/60 font-sans">
          Pertu MI &bull; Offline-first local memory sync
        </footer>
      </div>
    </main>
  );
}
