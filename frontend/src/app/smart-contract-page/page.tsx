'use client';

import { Code, Shield, CheckCircle, Lock, Zap, FileCode, ArrowRight } from 'lucide-react';

export default function SmartContractValidation() {
  const features = [
    { icon: Lock, title: "Role-Based Access", desc: "Only authorized institutions can issue certificates on-chain." },
    { icon: CheckCircle, title: "Automated Validation", desc: "Instant smart contract validation with zero manual steps." },
    { icon: Shield, title: "Immutable Verification", desc: "Cannot be modified or deleted once recorded on Ethereum." },
    { icon: Zap, title: "Gas Optimized", desc: "Efficient contract code minimizes transaction costs." },
  ];

  return (
    <div className="min-h-screen bg-[#080c14] text-white">

      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-500/[0.05] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">

        {/* Hero */}
        <section className="pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-[11px] tracking-[0.18em] uppercase font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Ethereum · Solidity · Trustless
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 w-fit mx-auto mb-6">
            <Code size={36} className="text-indigo-400" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Smart Contract{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Validation</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Role-based blockchain enforcement ensures authenticity. Automated verification through Ethereum smart contracts.
          </p>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Contract Overview</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Code Block */}
        <section className="pb-16">
          <div className="rounded-2xl border border-white/[0.06] bg-[#0d1117] overflow-hidden">
            {/* Code header bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
              <div className="flex items-center gap-2">
                <FileCode size={14} className="text-indigo-400" />
                <span className="text-[11px] text-gray-500 font-mono">CertificateVerification.sol</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
              </div>
            </div>
            <pre className="p-6 text-xs font-mono leading-relaxed overflow-x-auto text-green-400/80">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CertificateVerification {
    
    struct Certificate {
        string hash;
        address issuer;
        uint256 timestamp;
        bool isValid;
    }
    
    mapping(string => Certificate) public certificates;
    mapping(address => bool) public authorizedIssuers;
    
    event CertificateIssued(string hash, address issuer);
    event CertificateRevoked(string hash);
    
    modifier onlyAuthorized() {
        require(authorizedIssuers[msg.sender], "Not authorized");
        _;
    }
    
    function issueCertificate(string memory _hash) 
        public onlyAuthorized {
        certificates[_hash] = Certificate({
            hash: _hash,
            issuer: msg.sender,
            timestamp: block.timestamp,
            isValid: true
        });
        emit CertificateIssued(_hash, msg.sender);
    }
    
    function verifyCertificate(string memory _hash) 
        public view returns (bool, address, uint256) {
        Certificate memory cert = certificates[_hash];
        return (cert.isValid, cert.issuer, cert.timestamp);
    }
}`}
            </pre>
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Contract Features</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Features */}
        <section className="pb-16 grid md:grid-cols-2 gap-4">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all duration-300">
              <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 w-fit mb-4">
                <Icon size={18} className="text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </section>

        {/* Divider */}
        <div className="flex items-center gap-4 mb-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/[0.06]" />
          <span className="text-[10px] text-gray-700 tracking-[0.2em] uppercase">Built With</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/[0.06]" />
        </div>

        {/* Tech Stack */}
        <section className="pb-16 grid grid-cols-3 gap-4">
          {[
            { name: "Solidity", desc: "Smart contract language", icon: "📜", border: "hover:border-indigo-500/30" },
            { name: "Hardhat", desc: "Development environment", icon: "⚒️", border: "hover:border-cyan-500/30" },
            { name: "Ethers.js", desc: "Web3 library", icon: "🌐", border: "hover:border-blue-500/30" },
          ].map(({ name, desc, icon, border }) => (
            <div key={name} className={`p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] ${border} transition-all duration-300 text-center`}>
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{name}</h3>
              <p className="text-gray-600 text-xs">{desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <section className="pb-20 text-center">
          <div className="p-8 rounded-2xl border border-white/[0.05] bg-white/[0.02]">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 w-fit mx-auto mb-4">
              <Shield size={28} className="text-indigo-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Secure & Trustless</h2>
            <p className="text-gray-500 text-sm mb-6">Experience blockchain-powered certificate validation</p>
            <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white text-sm font-semibold shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.4)] hover:-translate-y-[1px] transition-all duration-300">
                View Live Contract
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}