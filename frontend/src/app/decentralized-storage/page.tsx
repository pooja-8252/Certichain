'use client';

import { Database, Shield, Lock, Cloud, Server, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DecentralizedStorage() {
  const features = [
    { icon: Database, title: "IPFS Integration",            desc: "Distributed file storage across globally connected nodes." },
    { icon: Lock,     title: "Encrypted Storage",           desc: "End-to-end encryption for every certificate stored." },
    { icon: Server,   title: "No Single Point of Failure",  desc: "Data replicated across the entire IPFS network." },
    { icon: Shield,   title: "Immutable Records",           desc: "Once stored on-chain, records cannot be altered." },
  ];

  const techStack = [
    { name: "IPFS",     desc: "InterPlanetary File System", icon: "🌐" },
    { name: "Pinata",   desc: "IPFS pinning service",       icon: "📌" },
    { name: "Filecoin", desc: "Decentralized storage",      icon: "💾" },
    { name: "Arweave",  desc: "Permanent data storage",     icon: "♾️" },
  ];

  const steps = [
    { step: "01", title: "Certificate Upload",  desc: "Institution uploads certificate PDF/image to the platform." },
    { step: "02", title: "Hash Generation",     desc: "System generates a unique cryptographic hash (SHA-256)." },
    { step: "03", title: "IPFS Storage",        desc: "Certificate stored on IPFS with a unique Content ID." },
    { step: "04", title: "Blockchain Record",   desc: "Hash + IPFS CID permanently recorded on Ethereum." },
    { step: "05", title: "Distributed Nodes",   desc: "File replicated across IPFS nodes globally." },
  ];

  const gold = { color: "#b8893a" };
  const goldBorder = "border border-[rgba(184,137,58,0.18)]";
  const card = `rounded-2xl ${goldBorder} bg-white/50 hover:bg-white/80 hover:border-[rgba(184,137,58,0.35)] transition-all duration-300`;

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
            IPFS · Decentralized · Immutable
          </div>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
            <Database size={30} style={gold} />
          </div>

          <h1 className="text-5xl font-normal leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
            Decentralized{" "}
            <em className="italic font-semibold" style={gold}>Storage</em>
          </h1>
          <p className="max-w-xl mx-auto leading-relaxed text-[14px] font-light" style={{ color: "#6b5f4e" }}>
            Certificates stored securely on IPFS to prevent tampering. No central server means no single point of failure.
          </p>
        </section>

        {/* Section label helper */}
        {["How It Works", "Key Features", "Technology Stack"].map((label, i) => null)}

        {/* ── How It Works ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,137,58,0.2))" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#b5a795" }}>How It Works</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(184,137,58,0.2))" }} />
        </div>

        <section className="pb-14 space-y-2.5">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className={`${card} flex gap-5 p-5`}>
              <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-semibold"
                style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.2)", color: "#b8893a" }}>
                {step}
              </div>
              <div className="pt-1">
                <h3 className="font-semibold text-sm mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>{title}</h3>
                <p className="text-sm font-light leading-relaxed" style={{ color: "#7a6d5e" }}>{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Key Features ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,137,58,0.2))" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#b5a795" }}>Key Features</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(184,137,58,0.2))" }} />
        </div>

        <section className="pb-14 grid md:grid-cols-2 gap-3">
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

        {/* ── Tech Stack ── */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(184,137,58,0.2))" }} />
          <span className="text-[10px] tracking-[0.2em] uppercase font-light" style={{ color: "#b5a795" }}>Technology Stack</span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, rgba(184,137,58,0.2))" }} />
        </div>

        <section className="pb-14 grid grid-cols-2 md:grid-cols-4 gap-3">
          {techStack.map(({ name, desc, icon }) => (
            <div key={name} className={`${card} p-5 text-center`}>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-sm mb-1" style={{ color: "#1e1a14" }}>{name}</h3>
              <p className="text-xs font-light" style={{ color: "#9a8a78" }}>{desc}</p>
            </div>
          ))}
        </section>

        {/* ── CTA ── */}
        <section className="pb-20">
          <div className={`${card} p-8 text-center`}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
              <Cloud size={26} style={gold} />
            </div>
            <h2 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
              Ready to Store <em className="italic" style={gold}>Securely?</em>
            </h2>
            <p className="text-sm font-light mb-6" style={{ color: "#7a6d5e" }}>Upload your first certificate to IPFS</p>
            <Link href="/">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[2px]"
                style={{ background: "linear-gradient(135deg, #c9a24a, #b8893a)", boxShadow: "0 4px 20px rgba(184,137,58,0.3)" }}>
                Get Started
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}