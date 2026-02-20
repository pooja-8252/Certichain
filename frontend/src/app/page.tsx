"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import { ShieldCheck, FileCheck2, Globe2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <main className="min-h-screen bg-[#080c14] text-white relative overflow-hidden">

      {/* ── Multi-layer atmospheric depth ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary cyan orb — top center */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-500/[0.07] rounded-full blur-[120px]" />
        {/* Indigo orb — bottom left */}
        <div className="absolute bottom-0 -left-40 w-[500px] h-[500px] bg-indigo-600/[0.08] rounded-full blur-[100px]" />
        {/* Blue orb — right */}
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-blue-500/[0.06] rounded-full blur-[100px]" />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        {/* Top border glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">

        {/* ── Hero ── */}
        <section className="flex flex-col items-center text-center pt-32 pb-16 px-6">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[11px] tracking-[0.18em] uppercase font-medium mb-10 shadow-[0_0_20px_rgba(6,182,212,0.08)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Powered by Ethereum & IPFS
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-[4.5rem] font-bold leading-[1.08] tracking-[-0.02em] max-w-4xl">
            <span className="text-white">Blockchain-Based</span>
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Certificate Verification
              </span>
              {/* Underline accent */}
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
            </span>
          </h1>

          <p className="mt-8 text-[15px] text-gray-500 max-w-lg leading-relaxed">
            Secure, transparent, and tamper-proof certificate issuance powered by smart contracts and decentralized storage.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => setShowAuth(true)}
              className="group flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-medium text-sm shadow-[0_0_30px_rgba(99,102,241,0.25)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(99,102,241,0.45)] hover:-translate-y-[2px] active:translate-y-0"
            >
              Get Started
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            <Link href="/learn-more">
              <button className="px-7 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-gray-400 text-sm hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white transition-all duration-200">
                Learn More
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 flex items-center gap-12 flex-wrap justify-center">
            {[["100%", "Tamper-Proof"], ["< 2s", "Verification"], ["On-Chain", "Storage"]].map(([val, label], i) => (
              <div key={label} className="flex items-center gap-12">
                <div className="text-center">
                  <div className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">{val}</div>
                  <div className="text-[10px] text-gray-600 tracking-[0.16em] uppercase mt-1">{label}</div>
                </div>
                {i < 2 && <div className="w-px h-8 bg-white/[0.07]" />}
              </div>
            ))}
          </div>
        </section>

        {/* ── Divider ── */}
        <div className="flex items-center gap-4 px-8 max-w-5xl mx-auto w-full my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Core Features</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* ── Feature Cards ── */}
        <section className="px-6 pb-20 grid md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full mt-6">
          {[
            {
              icon: <FileCheck2 size={20} />,
              title: "Decentralized Storage",
              desc: "Certificates stored securely on IPFS to prevent tampering.",
              href: "/decentralized-storage",
              accent: "from-cyan-500/10 to-transparent",
              border: "hover:border-cyan-500/20",
              iconColor: "text-cyan-400",
            },
            {
              icon: <ShieldCheck size={20} />,
              title: "Smart Contract Validation",
              desc: "Role-based blockchain enforcement ensures authenticity.",
              href: "/smart-contract-page",
              accent: "from-indigo-500/10 to-transparent",
              border: "hover:border-indigo-500/20",
              iconColor: "text-indigo-400",
            },
            {
              icon: <Globe2 size={20} />,
              title: "Instant Public Verification",
              desc: "Anyone can verify credentials transparently in seconds.",
              href: "/instant-verification",
              accent: "from-blue-500/10 to-transparent",
              border: "hover:border-blue-500/20",
              iconColor: "text-blue-400",
            },
          ].map(({ icon, title, desc, href, accent, border, iconColor }) => (
            <Link href={href} key={title}>
              <div className={`group relative h-full p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] ${border} transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.04] overflow-hidden`}>
                {/* Card inner glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                <div className="relative">
                  <div className={`${iconColor} mb-4 p-2 rounded-lg bg-white/[0.04] w-fit`}>{icon}</div>
                  <h3 className="text-white font-semibold text-sm mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  <div className={`mt-4 flex items-center gap-1 ${iconColor} text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                    Explore <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>

        {/* ── Footer ── */}
        <footer className="mt-auto border-t border-white/[0.04] py-6 text-center">
          <p className="text-gray-700 text-xs tracking-widest uppercase">© 2026 E-Certify · Built by Alpha</p>
        </footer>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </main>
  );
}