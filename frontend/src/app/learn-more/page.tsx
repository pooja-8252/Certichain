'use client';

import { Shield, Lock, Zap, Globe, Award, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LearnMore() {
  const features = [
    { icon: Shield, title: "Blockchain Security", desc: "Immutable records stored on a distributed Ethereum ledger.", accent: "cyan" },
    { icon: Lock, title: "Tamper-Proof", desc: "Cryptographic hashing ensures zero possibility of forgery.", accent: "indigo" },
    { icon: Zap, title: "Instant Verification", desc: "On-chain verification completes in under 3 seconds.", accent: "cyan" },
    { icon: Globe, title: "Global Access", desc: "Verify credentials from anywhere in the world, anytime.", accent: "indigo" },
    { icon: Award, title: "Smart Contracts", desc: "Automated validation with zero manual intervention.", accent: "cyan" },
    { icon: CheckCircle, title: "100% Authentic", desc: "No fake certificates — every record is on-chain truth.", accent: "indigo" },
  ];

  const steps = [
    { num: "01", title: "Upload Certificate", desc: "Institution uploads certificate data to the platform." },
    { num: "02", title: "Blockchain Storage", desc: "Cryptographic hash is permanently stored on Ethereum." },
    { num: "03", title: "Generate QR Code", desc: "A unique QR code is generated and linked to the record." },
    { num: "04", title: "Instant Verification", desc: "Anyone can verify authenticity in seconds, no login needed." },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-white">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[11px] tracking-[0.18em] uppercase font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Secure · Transparent · Decentralized
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">E-Certify</span>?
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            The most advanced blockchain certificate verification platform — built for institutions, trusted by everyone.
          </p>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Core Features</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Features */}
        <section className="pb-16 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, accent }) => (
            <div key={title}
              className={`group p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 ${
                accent === 'cyan' ? 'hover:border-cyan-500/20' : 'hover:border-indigo-500/20'}`}>
              <div className={`p-2 rounded-xl border w-fit mb-4 ${
                accent === 'cyan'
                  ? 'bg-cyan-500/10 border-cyan-500/20'
                  : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                <Icon size={18} className={accent === 'cyan' ? 'text-cyan-400' : 'text-indigo-400'} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">How It Works</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Steps */}
        <section className="pb-16 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map(({ num, title, desc }, i) => (
            <div key={num} className="relative group p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/20 transition-all duration-300">
              {/* connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 -right-2 w-4 h-px bg-white/[0.06] z-10" />
              )}
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
                <span className="text-[11px] font-bold text-cyan-400">{num}</span>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* Stats row */}
        <div className="mb-16 grid grid-cols-3 gap-4">
          {[["< 3s", "Verification Time"], ["100%", "Tamper-Proof"], ["On-Chain", "Permanent Storage"]].map(([val, label]) => (
            <div key={label} className="p-5 rounded-2xl border border-white/[0.05] bg-white/[0.02] text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">{val}</div>
              <div className="text-[10px] text-gray-600 tracking-widest uppercase">{label}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="pb-20">
          <div className="p-8 rounded-2xl border border-white/[0.05] bg-white/[0.02] text-center">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 w-fit mx-auto mb-4">
              <Sparkles size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Get Started?</h2>
            <p className="text-gray-500 text-sm mb-6">Experience the future of certificate verification</p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/verify">
                <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] hover:-translate-y-[1px] transition-all duration-300">
                  Verify a Certificate
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </Link>
              <Link href="/about">
                <button className="px-6 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-gray-300 text-sm hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200">
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