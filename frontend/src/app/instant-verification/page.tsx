'use client';

import { Globe, Zap, QrCode, Search, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function InstantVerification() {
  return (
    <div className="min-h-screen bg-[#080c14] text-white">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[11px] tracking-[0.18em] uppercase font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Public · Instant · Trustless
          </div>
          <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 w-fit mx-auto mb-6">
            <Globe size={36} className="text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Instant Public{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Verification</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Anyone can verify credentials transparently in seconds. No login required, completely public and open.
          </p>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">3 Ways to Verify</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Methods */}
        <section className="pb-16 grid md:grid-cols-3 gap-4">
          {[
            { icon: QrCode, title: "Scan QR Code", desc: "Scan the QR on any printed or digital certificate instantly.", color: "text-cyan-400", border: "hover:border-cyan-500/20", bg: "bg-cyan-500/10 border-cyan-500/20" },
            { icon: Search, title: "Search by Hash", desc: "Enter the certificate ID or hash to pull on-chain data.", color: "text-indigo-400", border: "hover:border-indigo-500/20", bg: "bg-indigo-500/10 border-indigo-500/20" },
            { icon: Globe, title: "Public URL", desc: "Share a permanent verification link with anyone, anywhere.", color: "text-blue-400", border: "hover:border-blue-500/20", bg: "bg-blue-500/10 border-blue-500/20" },
          ].map(({ icon: Icon, title, desc, color, border, bg }) => (
            <div key={title} className={`group p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] ${border} hover:bg-white/[0.04] transition-all duration-300 text-center`}>
              <div className={`p-3 rounded-xl border ${bg} w-fit mx-auto mb-4`}>
                <Icon size={22} className={color} />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Live Demo</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Live Demo Card */}
        <section className="pb-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] p-8">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                placeholder="Enter certificate hash (0x...)"
                className="flex-1 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white placeholder-gray-700 text-sm focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
              />
              <button className="px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:-translate-y-[1px] transition-all duration-200">
                Verify
              </button>
            </div>

            {/* Sample result */}
            <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/[0.03] p-5">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <CheckCircle size={16} className="text-cyan-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">Certificate Verified ✓</p>
                  <p className="text-gray-500 text-xs">Issued by MIT University</p>
                </div>
                <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" /> On-Chain
                </span>
              </div>
              <div className="space-y-2.5">
                {[["Holder", "John Doe"], ["Course", "Computer Science"], ["Issue Date", "Jan 15, 2024"]].map(([label, value]) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-white/[0.04] last:border-0">
                    <span className="text-gray-600 text-xs">{label}</span>
                    <span className="text-gray-300 text-xs font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Why It Matters</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Benefits */}
        <section className="pb-16 grid md:grid-cols-2 gap-4">
          {[
            { icon: Clock, title: "Instant Results", desc: "Verification completes in under 3 seconds on-chain." },
            { icon: Globe, title: "Globally Accessible", desc: "Verify credentials from anywhere in the world." },
            { icon: CheckCircle, title: "100% Transparent", desc: "Every verification is publicly auditable on Ethereum." },
            { icon: Zap, title: "No Login Required", desc: "Fully open verification — zero friction for employers." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group flex gap-4 p-5 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/20 transition-all duration-300">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 h-fit shrink-0">
                <Icon size={16} className="text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="p-8 rounded-2xl border border-white/[0.05] bg-white/[0.02] text-center">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 w-fit mx-auto mb-4">
              <Zap size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Verify Your First Certificate</h2>
            <p className="text-gray-500 text-sm mb-6">Join the future of credential verification</p>
            <Link href="/verify">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] hover:-translate-y-[1px] transition-all duration-300">
                Start Verifying Now
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}