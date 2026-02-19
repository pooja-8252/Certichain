"use client";

export default function About() {
  return (
    <div className="min-h-screen bg-[#080c14] flex items-center justify-center px-6 py-20 font-[system-ui]">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Badge */}
        <div className="flex justify-center mb-8">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-xs tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Blockchain Verified
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-center text-5xl font-bold tracking-tight text-white mb-4">
          About{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            E-Certify
          </span>
        </h1>

        <p className="text-center text-gray-500 text-sm tracking-widest uppercase mb-14">
          Decentralized · Immutable · Trusted
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-4">
          {[
            {
              icon: "🔐",
              title: "Fraud-Proof Authentication",
              desc: "Certificates are cryptographically signed and stored on-chain, making tampering mathematically impossible.",
            },
            {
              icon: "🌐",
              title: "IPFS Storage",
              desc: "Files are pinned on the InterPlanetary File System — decentralized, permanent, and censorship-resistant.",
            },
            {
              icon: "⚡",
              title: "Smart Contract Validation",
              desc: "Every certificate is validated through Ethereum smart contracts with zero reliance on a central authority.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="group flex gap-4 p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/20 transition-all duration-300"
            >
              <span className="text-2xl mt-0.5">{icon}</span>
              <div>
                <h3 className="text-white font-semibold mb-1">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer line */}
        <p className="text-center text-gray-600 text-xs mt-10 tracking-wide">
          Built with Next.js · Ethereum · IPFS
        </p>
      </div>
    </div>
  );
}