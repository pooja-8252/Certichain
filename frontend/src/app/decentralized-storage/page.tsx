'use client';

import { Database, Shield, Lock, Cloud, Server, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DecentralizedStorage() {
  const features = [
    { icon: Database, title: "IPFS Integration", desc: "Distributed file storage across globally connected nodes." },
    { icon: Lock, title: "Encrypted Storage", desc: "End-to-end encryption for every certificate stored." },
    { icon: Server, title: "No Single Point of Failure", desc: "Data replicated across the entire IPFS network." },
    { icon: Shield, title: "Immutable Records", desc: "Once stored on-chain, records cannot be altered." },
  ];

  const techStack = [
    { name: "IPFS", desc: "InterPlanetary File System", icon: "🌐", color: "border-cyan-500/20 hover:border-cyan-500/40" },
    { name: "Pinata", desc: "IPFS pinning service", icon: "📌", color: "border-indigo-500/20 hover:border-indigo-500/40" },
    { name: "Filecoin", desc: "Decentralized storage", icon: "💾", color: "border-blue-500/20 hover:border-blue-500/40" },
    { name: "Arweave", desc: "Permanent data storage", icon: "♾️", color: "border-cyan-500/20 hover:border-cyan-500/40" },
  ];

  const steps = [
    { step: "01", title: "Certificate Upload", desc: "Institution uploads certificate PDF/image to the platform." },
    { step: "02", title: "Hash Generation", desc: "System generates a unique cryptographic hash (SHA-256)." },
    { step: "03", title: "IPFS Storage", desc: "Certificate stored on IPFS with a unique Content ID." },
    { step: "04", title: "Blockchain Record", desc: "Hash + IPFS CID permanently recorded on Ethereum." },
    { step: "05", title: "Distributed Nodes", desc: "File replicated across IPFS nodes globally." },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-white">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-cyan-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[11px] tracking-[0.18em] uppercase font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            IPFS · Decentralized · Immutable
          </div>
          <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 w-fit mx-auto mb-6">
            <Database size={36} className="text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Decentralized{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Storage</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Certificates stored securely on IPFS to prevent tampering. No central server means no single point of failure.
          </p>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">How It Works</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Steps */}
        <section className="pb-16 space-y-3">
          {steps.map(({ step, title, desc }) => (
            <div key={step} className="group flex gap-5 p-5 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/20 transition-all duration-300">
              <div className="shrink-0 w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <span className="text-[11px] font-bold text-cyan-400">{step}</span>
              </div>
              <div className="pt-1">
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Key Features</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Features */}
        <section className="pb-16 grid md:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-cyan-500/20 transition-all duration-300">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 w-fit mb-4">
                <Icon size={18} className="text-cyan-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-16">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Technology Stack</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Tech Stack */}
        <section className="pb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {techStack.map(({ name, desc, icon, color }) => (
            <div key={name} className={`p-5 rounded-2xl border bg-white/[0.02] hover:bg-white/[0.04] ${color} transition-all duration-300 text-center`}>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{name}</h3>
              <p className="text-gray-600 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="pb-20 text-center">
          <div className="p-8 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 w-fit mx-auto mb-4">
              <Cloud size={28} className="text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Store Securely?</h2>
            <p className="text-gray-500 text-sm mb-6">Upload your first certificate to IPFS</p>
            <Link href="/">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] hover:-translate-y-[1px] transition-all duration-300">
                Get Started
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}