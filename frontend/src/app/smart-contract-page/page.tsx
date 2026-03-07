'use client';

import { Code, Shield, CheckCircle, Lock, Zap, FileCode, ArrowRight } from 'lucide-react';

export default function SmartContractValidation() {
  const features = [
    { icon: Lock,        title: "Role-Based Access",     desc: "Only authorized institutions can issue certificates on-chain." },
    { icon: CheckCircle, title: "Automated Validation",  desc: "Instant smart contract validation with zero manual steps." },
    { icon: Shield,      title: "Immutable Verification",desc: "Cannot be modified or deleted once recorded on Ethereum." },
    { icon: Zap,         title: "Gas Optimized",         desc: "Efficient contract code minimizes transaction costs." },
  ];

  const techStack = [
    { name: "Solidity",  desc: "Smart contract language", icon: "📜" },
    { name: "Hardhat",   desc: "Development environment", icon: "⚒️" },
    { name: "Ethers.js", desc: "Web3 library",            icon: "🌐" },
  ];

  const gold = { color: "#b8893a" };
  const card = `rounded-2xl border border-[rgba(184,137,58,0.18)] bg-white/50 hover:bg-white/80 hover:border-[rgba(184,137,58,0.35)] transition-all duration-300`;
  const divider = (label: string) => (
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
            Ethereum · Solidity · Trustless
          </div>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
            <Code size={30} style={gold} />
          </div>

          <h1 className="text-5xl font-normal leading-tight mb-4" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
            Smart Contract{" "}
            <em className="italic font-semibold" style={gold}>Validation</em>
          </h1>
          <p className="max-w-xl mx-auto leading-relaxed text-[14px] font-light" style={{ color: "#6b5f4e" }}>
            Role-based blockchain enforcement ensures authenticity. Automated verification through Ethereum smart contracts.
          </p>
        </section>

        {/* ── Contract Overview ── */}
        {divider("Contract Overview")}

        <section className="pb-14">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(184,137,58,0.2)", boxShadow: "0 4px 32px rgba(120,90,40,0.07)" }}>

            {/* Code bar header */}
            <div className="flex items-center justify-between px-5 py-3" style={{ background: "rgba(255,248,235,0.9)", borderBottom: "1px solid rgba(184,137,58,0.13)" }}>
              <div className="flex items-center gap-2">
                <FileCode size={13} style={gold} />
                <span className="text-[11px] font-mono font-medium" style={{ color: "#9a8a78" }}>CertificateVerification.sol</span>
              </div>
              {/* Traffic lights */}
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(220,38,38,0.35)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(217,119,6,0.35)" }} />
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(22,163,74,0.35)" }} />
              </div>
            </div>

            {/* Code body */}
            <pre className="p-6 text-xs font-mono leading-[1.8] overflow-x-auto"
              style={{ background: "rgba(254,252,247,0.97)", color: "#5a4a30" }}>
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

        {/* ── Contract Features ── */}
        {divider("Contract Features")}

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

        {/* ── Built With ── */}
        {divider("Built With")}

        <section className="pb-14 grid grid-cols-3 gap-3">
          {techStack.map(({ name, desc, icon }) => (
            <div key={name} className={`${card} p-6 text-center`}>
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
              <Shield size={26} style={gold} />
            </div>
            <h2 className="text-2xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
              Secure &{" "}<em className="italic" style={gold}>Trustless</em>
            </h2>
            <p className="text-sm font-light mb-6" style={{ color: "#7a6d5e" }}>
              Experience blockchain-powered certificate validation
            </p>
            <a href="https://etherscan.io" target="_blank" rel="noopener noreferrer">
              <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white transition-all duration-300 hover:-translate-y-[2px]"
                style={{ background: "linear-gradient(135deg, #c9a24a, #b8893a)", boxShadow: "0 4px 20px rgba(184,137,58,0.3)" }}>
                View Live Contract
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}