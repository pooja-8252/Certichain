"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import { ShieldCheck, ArrowRight, Lock, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Outfit:wght@300;400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-outfit   { font-family: 'Outfit', sans-serif; }

        .page-bg {
          background-color: #f9f5ef;
          background-image:
            radial-gradient(ellipse 60% 60% at 80% 20%, rgba(184,137,58,0.1) 0%, transparent 55%),
            radial-gradient(ellipse 50% 50% at 5% 70%, rgba(160,130,90,0.08) 0%, transparent 50%);
        }

        .hero-rule {
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(184,137,58,0.3) 30%, rgba(184,137,58,0.3) 70%, transparent);
        }

        .big-year {
          font-family: 'Playfair Display', serif;
          font-size: 11rem;
          font-weight: 700;
          color: rgba(184,137,58,0.06);
          line-height: 1;
          user-select: none;
          letter-spacing: -0.04em;
        }

        .btn-gold {
          background: linear-gradient(135deg, #c9a24a 0%, #b8893a 100%);
          box-shadow: 0 4px 20px rgba(184,137,58,0.3), inset 0 1px 0 rgba(255,255,255,0.15);
          transition: all 0.3s ease;
          color: #fff;
        }
        .btn-gold:hover {
          box-shadow: 0 8px 32px rgba(184,137,58,0.45);
          transform: translateY(-2px);
        }
        .btn-ghost {
          border: 1px solid rgba(184,137,58,0.22);
          background: rgba(255,255,255,0.5);
          color: #6b5f4e;
          transition: all 0.25s ease;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.9);
          border-color: rgba(184,137,58,0.4);
          color: #1e1a14;
        }

        .ticker-wrap {
          border-top: 1px solid rgba(184,137,58,0.12);
          border-bottom: 1px solid rgba(184,137,58,0.12);
          background: rgba(255,255,255,0.3);
          overflow: hidden;
        }
        .ticker-track {
          display: flex;
          animation: ticker 20s linear infinite;
          width: max-content;
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 32px;
          white-space: nowrap;
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #b5a795;
          font-weight: 400;
          border-right: 1px solid rgba(184,137,58,0.1);
        }
        .ticker-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #b8893a;
          opacity: 0.5;
          flex-shrink: 0;
        }

        .feature-card {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(184,137,58,0.13);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .feature-card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #b8893a, transparent);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .feature-card:hover {
          background: rgba(255,255,255,0.88);
          border-color: rgba(184,137,58,0.3);
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(120,90,40,0.1);
        }
        .feature-card:hover::after { transform: scaleX(1); }

        .card-num-bg {
          font-family: 'Playfair Display', serif;
          font-size: 7rem;
          font-weight: 700;
          color: rgba(184,137,58,0.06);
          line-height: 1;
          position: absolute;
          top: -10px; right: -8px;
          user-select: none;
          pointer-events: none;
          letter-spacing: -0.04em;
        }

        .icon-circle {
          background: linear-gradient(135deg, rgba(184,137,58,0.12), rgba(184,137,58,0.06));
          border: 1px solid rgba(184,137,58,0.18);
        }

        .arrow-btn {
          background: rgba(184,137,58,0.08);
          border: 1px solid rgba(184,137,58,0.18);
          color: #b8893a;
          transition: all 0.2s ease;
        }
        .arrow-btn:hover {
          background: #b8893a;
          color: #fff;
          border-color: #b8893a;
        }

        .g-pulse { position: relative; }
        .g-pulse::before, .g-pulse::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
        }
        .g-pulse::before { background: #b8893a; }
        .g-pulse::after {
          background: rgba(184,137,58,0.3);
          animation: rpl 2s ease-out infinite;
        }
        @keyframes rpl {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }
      `}</style>

      <main className="page-bg font-outfit min-h-screen text-[#1e1a14] relative overflow-hidden flex flex-col">
        <div className="relative z-10 flex flex-col min-h-screen">

          {/* ── HERO — Asymmetric left/right split ── */}
          <section className="relative px-8 md:px-16 pt-24 pb-10 max-w-6xl mx-auto w-full">

            <div className="big-year absolute right-0 top-10 select-none pointer-events-none hidden md:block">'26</div>

            <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-16">

              {/* Left — headline */}
              <div className="flex-1">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border mb-8"
                  style={{ borderColor: "rgba(184,137,58,0.25)", background: "rgba(184,137,58,0.07)" }}>
                  <div className="g-pulse w-1.5 h-1.5" />
                  <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: "#b8893a" }}>
                    Live on Sepolia Testnet
                  </span>
                </div>

                <h1 className="font-playfair font-normal leading-[1.06]"
                  style={{ fontSize: "clamp(2.6rem, 5.5vw, 4rem)", color: "#1e1a14" }}>
                  The Future of
                  <br />
                  <em className="font-playfair italic" style={{ color: "#b8893a" }}>Credential Trust</em>
                  <br />
                  is On-Chain.
                </h1>

                <div className="flex gap-3 mt-9 flex-wrap">
                  <button onClick={() => setShowAuth(true)}
                    className="btn-gold group flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm">
                    Issue a Certificate
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <Link href="/learn-more">
                    <button className="btn-ghost px-6 py-3 rounded-xl text-sm font-medium">
                      How it works
                    </button>
                  </Link>
                </div>
              </div>

              {/* Vertical rule */}
              <div className="hero-rule hidden md:block self-stretch" />

              {/* Right — stats */}
              <div className="flex md:flex-col gap-8 md:gap-7 flex-wrap md:pb-2">
                {[
                  { val: "100%", label: "Tamper-Proof" },
                  { val: "< 2s",  label: "Verification Time" },
                  { val: "∞",     label: "Storage Lifespan" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="font-playfair font-bold text-[2rem] leading-none" style={{ color: "#1e1a14" }}>{val}</div>
                    <div className="text-[10px] tracking-[0.16em] uppercase mt-1 font-light" style={{ color: "#b5a795" }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tag row */}
            <div className="flex items-center gap-6 mt-10 flex-wrap">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg, rgba(184,137,58,0.3), transparent)" }} />
              {["Decentralized", "Immutable", "Permissionless"].map((t) => (
                <span key={t} className="text-[10px] tracking-[0.18em] uppercase font-light" style={{ color: "#b5a795" }}>{t}</span>
              ))}
            </div>
          </section>

          {/* ── Ticker ── */}
          <div className="ticker-wrap my-6">
            <div className="ticker-track">
              {[...Array(2)].flatMap((_, i) =>
                ["Ethereum Smart Contracts", "IPFS Pinning", "Zero Central Authority", "Instant Verification", "Cryptographic Signing", "Role-Based Access", "Open Standards", "Fraud Prevention"].map((t) => (
                  <div className="ticker-item" key={`${t}-${i}`}>
                    <span className="ticker-dot" />
                    {t}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Feature Cards ── */}
          <section className="px-8 md:px-16 pb-20 max-w-6xl mx-auto w-full">

            <div className="flex items-center gap-4 mb-8">
              <span className="text-[11px] tracking-[0.22em] uppercase font-light" style={{ color: "#b5a795" }}>What we offer</span>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(184,137,58,0.2), transparent)" }} />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  num: "1",
                  icon: <Lock size={18} />,
                  title: "Immutable Records",
                  subtitle: "Stored on IPFS",
                  desc: "Once issued, certificates cannot be altered or deleted. Every credential lives permanently on decentralized storage.",
                  href: "/decentralized-storage",
                  cta: "Explore Storage",
                },
                {
                  num: "2",
                  icon: <ShieldCheck size={18} />,
                  title: "Contract-Enforced Trust",
                  subtitle: "Ethereum Smart Contracts",
                  desc: "Issuance and revocation are governed by audited smart contracts — no middlemen, no single point of failure.",
                  href: "/smart-contract-page",
                  cta: "View Contracts",
                },
                {
                  num: "3",
                  icon: <Zap size={18} />,
                  title: "One-Click Verification",
                  subtitle: "Public & Instant",
                  desc: "Employers or institutions can verify the authenticity of a credential in under two seconds — no login needed.",
                  href: "/instant-verification",
                  cta: "Try Verifier",
                },
              ].map(({ num, icon, title, subtitle, desc, href, cta }) => (
                <div key={title} className="feature-card rounded-2xl p-7 flex flex-col gap-5">
                  <div className="card-num-bg">{num}</div>

                  <div>
                    <div className="icon-circle w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ color: "#b8893a" }}>
                      {icon}
                    </div>
                    <p className="text-[10px] tracking-[0.18em] uppercase font-light mb-1" style={{ color: "#b5a795" }}>
                      {subtitle}
                    </p>
                    <h3 className="font-playfair font-semibold text-[17px]" style={{ color: "#1e1a14" }}>
                      {title}
                    </h3>
                  </div>

                  <div className="h-px w-full" style={{ background: "rgba(184,137,58,0.12)" }} />

                  <p className="text-[13px] font-light leading-[1.75] flex-1" style={{ color: "#7a6d5e" }}>
                    {desc}
                  </p>

                  <Link href={href}>
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-medium" style={{ color: "#b8893a" }}>{cta}</span>
                      <div className="arrow-btn w-8 h-8 rounded-lg flex items-center justify-center">
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── Footer ── */}
          <footer className="mt-auto py-6 px-8 flex items-center justify-between flex-wrap gap-3"
            style={{ borderTop: "1px solid rgba(184,137,58,0.12)" }}>
            <p className="text-[11px] tracking-widest uppercase font-light" style={{ color: "#b5a795" }}>© 2026 </p>
            <p className="text-[11px] tracking-widest uppercase font-light" style={{ color: "#b5a795" }}>Built by Kalyani</p>
          </footer>

        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}