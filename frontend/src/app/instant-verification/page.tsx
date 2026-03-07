'use client';

import { Globe, Zap, QrCode, Search, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InstantVerification() {
  const methods = [
    { icon: QrCode,  title: "Scan QR Code",   desc: "Scan the QR on any printed or digital certificate instantly." },
    { icon: Search,  title: "Search by ID",    desc: "Enter the certificate ID or hash to pull on-chain data." },
    { icon: Globe,   title: "Public URL",      desc: "Share a permanent verification link with anyone, anywhere." },
  ];

  const benefits = [
    { icon: Clock,       title: "Instant Results",      desc: "Verification completes in under 3 seconds on-chain." },
    { icon: Globe,       title: "Globally Accessible",  desc: "Verify credentials from anywhere in the world." },
    { icon: CheckCircle, title: "100% Transparent",     desc: "Every verification is publicly auditable on Ethereum." },
    { icon: Zap,         title: "No Login Required",    desc: "Fully open verification — zero friction for employers." },
  ];

  const gold = { color: "#b8893a" };
  const card = `rounded-2xl border border-[rgba(184,137,58,0.18)] bg-white/50 hover:bg-white/80 hover:border-[rgba(184,137,58,0.35)] transition-all duration-300`;

  return (
    <div className="min-h-screen" style={{ background: "#f9f5ef", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');`}</style>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(184,137,58,0.07)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(160,130,90,0.06)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* ── Hero ── */}
        <section className="pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-8 text-[10px] font-medium tracking-[0.2em] uppercase"
            style={{ borderColor: "rgba(184,137,58,0.25)", background: "rgba(184,137,58,0.07)", color: "#b8893a" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#b8893a" }} />
            Public · Instant · Trustless
          </div>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
            <Globe size={30} style={gold} />
          </div>

          <h1 className="text-5xl font-normal leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
            Instant Public{" "}
            <em className="italic font-semibold" style={gold}>Verification</em>
          </h1>
          <p className="max-w-xl mx-auto leading-relaxed text-[14px] font-light" style={{ color: "#6b5f4e" }}>
            Anyone can verify credentials transparently in seconds. No login required, completely public and open.
          </p>
        </section>

        {/* ── 3 Ways to Verify ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,137,58,0.2))" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#b5a795" }}>3 Ways to Verify</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(184,137,58,0.2))" }} />
        </div>

        <section className="pb-14 grid md:grid-cols-3 gap-3">
          {methods.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${card} p-6 text-center`}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.18)" }}>
                <Icon size={20} style={gold} />
              </div>
              <h3 className="font-semibold mb-1.5 text-[15px]" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>{title}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "#7a6d5e" }}>{desc}</p>
            </div>
          ))}
        </section>

        {/* ── Live Demo ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,137,58,0.2))" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#b5a795" }}>Live Demo</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(184,137,58,0.2))" }} />
        </div>

        <section className="pb-14">
          <div className="rounded-2xl p-7" style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.15)", boxShadow: "0 4px 32px rgba(120,90,40,0.06)" }}>
            {/* Input row */}
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Enter certificate hash (0x...)"
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(184,137,58,0.18)",
                  color: "#1e1a14",
                  fontFamily: "'Outfit', sans-serif",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(184,137,58,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(184,137,58,0.1)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(184,137,58,0.18)"; e.target.style.boxShadow = "none"; }}
              />
              <button className="px-5 py-3 rounded-xl text-sm font-medium text-white transition-all hover:-translate-y-[1px]"
                style={{ background: "linear-gradient(135deg, #c9a24a, #b8893a)", boxShadow: "0 4px 16px rgba(184,137,58,0.3)" }}>
                Verify
              </button>
            </div>

            {/* Sample result */}
            <div className="rounded-xl p-5" style={{ background: "rgba(184,137,58,0.05)", border: "1px solid rgba(184,137,58,0.15)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.2)" }}>
                  <CheckCircle size={15} style={{ color: "#16a34a" }} />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>Certificate Verified ✓</p>
                  <p className="text-xs font-light" style={{ color: "#7a6d5e" }}>Issued by MIT University</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide"
                  style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.2)", color: "#16a34a" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
                  On-Chain
                </span>
              </div>
              <div className="space-y-0">
                {[["Holder", "John Doe"], ["Course", "Computer Science"], ["Issue Date", "Jan 15, 2024"]].map(([label, value], i, arr) => (
                  <div key={label} className={`flex justify-between items-center py-2.5 ${i < arr.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: "rgba(184,137,58,0.1)" }}>
                    <span className="text-xs font-light" style={{ color: "#9a8a78" }}>{label}</span>
                    <span className="text-xs font-medium" style={{ color: "#4a3f30" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Why It Matters ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,137,58,0.2))" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#b5a795" }}>Why It Matters</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(184,137,58,0.2))" }} />
        </div>

        <section className="pb-14 grid md:grid-cols-2 gap-3">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${card} flex gap-4 p-5`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.18)" }}>
                <Icon size={16} style={gold} />
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>{title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "#7a6d5e" }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── CTA ── */}
        <section className="pb-20">
          <div className={`${card} p-8 text-center`}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
              <Zap size={26} style={gold} />
            </div>
            <h2 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
              Verify Your First <em className="italic" style={gold}>Certificate</em>
            </h2>
            <p className="text-sm font-light mb-6" style={{ color: "#7a6d5e" }}>Join the future of credential verification</p>
            <Link href="/verify">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[2px]"
                style={{ background: "linear-gradient(135deg, #c9a24a, #b8893a)", boxShadow: "0 4px 20px rgba(184,137,58,0.3)" }}>
                Start Verifying Now
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}