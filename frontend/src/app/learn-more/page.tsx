'use client';

import { Shield, Lock, Zap, Globe, Award, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LearnMore() {
  const features = [
    { icon: Shield,      title: "Blockchain Security",   desc: "Immutable records stored on a distributed Ethereum ledger." },
    { icon: Lock,        title: "Tamper-Proof",          desc: "Cryptographic hashing ensures zero possibility of forgery." },
    { icon: Zap,         title: "Instant Verification",  desc: "On-chain verification completes in under 3 seconds." },
    { icon: Globe,       title: "Global Access",         desc: "Verify credentials from anywhere in the world, anytime." },
    { icon: Award,       title: "Smart Contracts",       desc: "Automated validation with zero manual intervention." },
    { icon: CheckCircle, title: "100% Authentic",        desc: "No fake certificates — every record is on-chain truth." },
  ];

  const steps = [
    { num: "01", title: "Upload Certificate",  desc: "Institution uploads certificate data to the platform." },
    { num: "02", title: "Blockchain Storage",  desc: "Cryptographic hash is permanently stored on Ethereum." },
    { num: "03", title: "Generate QR Code",    desc: "A unique QR code is generated and linked to the record." },
    { num: "04", title: "Instant Verification",desc: "Anyone can verify authenticity in seconds, no login needed." },
  ];

  const gold = { color: "#b8893a" };
  const card = `rounded-2xl border border-[rgba(184,137,58,0.18)] bg-white/50 hover:bg-white/80 hover:border-[rgba(184,137,58,0.35)] transition-all duration-300`;

  const Divider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,137,58,0.2))" }} />
      <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#b5a795" }}>{label}</span>
      <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(184,137,58,0.2))" }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "#f9f5ef", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');`}</style>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(184,137,58,0.07)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(160,130,90,0.06)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* ── Hero ── */}
        <section className="pt-20 pb-14 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border mb-8 text-[10px] font-medium tracking-[0.2em] uppercase"
            style={{ borderColor: "rgba(184,137,58,0.25)", background: "rgba(184,137,58,0.07)", color: "#b8893a" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#b8893a" }} />
            Secure · Transparent · Decentralized
          </div>

          <h1 className="text-5xl font-normal leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
            Why Choose{" "}
            <em className="italic font-semibold" style={gold}>CertiChain</em>?
          </h1>

          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #b8893a 60%)" }} />
            <span style={{ color: "#b8893a", fontSize: 12 }}>◆</span>
            <div className="h-px w-14" style={{ background: "linear-gradient(270deg, transparent, #b8893a 60%)" }} />
          </div>

          <p className="max-w-xl mx-auto leading-relaxed text-[14px] font-light" style={{ color: "#6b5f4e" }}>
            The most advanced blockchain certificate verification platform — built for institutions, trusted by everyone.
          </p>
        </section>

        {/* ── Core Features ── */}
        <Divider label="Core Features" />

        <section className="pb-14 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className={`${card} p-6`}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.18)" }}>
                <Icon size={17} style={gold} />
              </div>
              <h3 className="font-semibold mb-1.5 text-[15px]" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>{title}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "#7a6d5e" }}>{desc}</p>
            </div>
          ))}
        </section>

        {/* ── How It Works ── */}
        <Divider label="How It Works" />

        <section className="pb-14 grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className={`${card} relative p-6`}>
              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-9 -right-1.5 w-3 h-px z-10"
                  style={{ background: "rgba(184,137,58,0.25)" }} />
              )}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 text-[11px] font-semibold"
                style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.2)", color: "#b8893a" }}>
                {num}
              </div>
              <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>{title}</h3>
              <p className="text-xs font-light leading-relaxed" style={{ color: "#7a6d5e" }}>{desc}</p>
            </div>
          ))}
        </section>

        {/* ── Stats ── */}
        <div className="mb-14 grid grid-cols-3 gap-3">
          {[["< 3s", "Verification Time"], ["100%", "Tamper-Proof"], ["On-Chain", "Permanent Storage"]].map(([val, label]) => (
            <div key={label} className={`${card} p-5 text-center`}>
              <div className="text-2xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", ...gold }}>{val}</div>
              <div className="text-[10px] tracking-widest uppercase font-light" style={{ color: "#b5a795" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <section className="pb-20">
          <div className={`${card} p-8 text-center`}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
              <Sparkles size={26} style={gold} />
            </div>
            <h2 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
              Ready to Get <em className="italic" style={gold}>Started?</em>
            </h2>
            <p className="text-sm font-light mb-6" style={{ color: "#7a6d5e" }}>
              Experience the future of certificate verification
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/verify">
                <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[2px]"
                  style={{ background: "linear-gradient(135deg, #c9a24a, #b8893a)", boxShadow: "0 4px 20px rgba(184,137,58,0.3)" }}>
                  Verify a Certificate
                  <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/about">
                <button className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{ border: "1px solid rgba(184,137,58,0.22)", background: "rgba(255,255,255,0.5)", color: "#6b5f4e" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.9)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.5)"; }}>
                  Learn About Us
                </button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}