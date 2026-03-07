"use client";

export default function About() {
  const features = [
    {
      num: "01",
      icon: "🔐",
      title: "Fraud-Proof Authentication",
      desc: "Certificates are cryptographically signed and stored on-chain, making tampering mathematically impossible.",
    },
    {
      num: "02",
      icon: "🌐",
      title: "IPFS Storage",
      desc: "Files are pinned on the InterPlanetary File System — decentralized, permanent, and censorship-resistant.",
    },
    {
      num: "03",
      icon: "⚡",
      title: "Smart Contract Validation",
      desc: "Every certificate is validated through Ethereum smart contracts with zero reliance on a central authority.",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-outfit   { font-family: 'Outfit', sans-serif; }
        .page-bg {
          background-color: #f8f3ec;
          background-image:
            radial-gradient(ellipse 70% 50% at 65% 15%, rgba(184,137,58,0.08) 0%, transparent 60%),
            radial-gradient(ellipse 50% 40% at 15% 85%, rgba(160,130,90,0.07) 0%, transparent 55%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b8893a' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .watermark-e {
          font-family: 'Playfair Display', serif;
          font-size: clamp(280px, 45vw, 520px);
          font-weight: 700;
          color: rgba(184,137,58,0.045);
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }
        .gold-pulse { position: relative; }
        .gold-pulse::before, .gold-pulse::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }
        .gold-pulse::before { background: #b8893a; }
        .gold-pulse::after {
          background: rgba(184,137,58,0.35);
          animation: ripple 2s ease-out infinite;
        }
        @keyframes ripple {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .card-row { transition: background 0.25s ease, box-shadow 0.25s ease; }
        .card-row:hover {
          background: rgba(255,255,255,0.92) !important;
          box-shadow: inset 3px 0 0 #b8893a;
        }
      `}</style>

      <div className="page-bg font-outfit min-h-screen flex items-center justify-center px-5 py-20 relative overflow-hidden">

        {/* Watermark */}
        <div className="watermark-e absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          E
        </div>

        <div className="relative w-full max-w-2xl">

          {/* Eyebrow divider */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, #b8893a)" }} />
            <div className="flex items-center gap-2.5">
              <div className="gold-pulse w-2 h-2" />
              <span className="text-[10px] font-medium tracking-[0.22em] uppercase" style={{ color: "#b8893a" }}>
                Blockchain Verified
              </span>
            </div>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(270deg, transparent, #b8893a)" }} />
          </div>

          {/* Centered heading block */}
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-[0.2em] uppercase font-light mb-3" style={{ color: "#b5a795" }}>
              Certificate Authentication Platform
            </p>

            <h1 className="font-playfair font-normal leading-[1.08] mb-5" style={{ fontSize: "clamp(2.8rem,8vw,4.2rem)", color: "#1e1a14" }}>
              About{" "}
              <em className="font-playfair font-semibold italic" style={{ color: "#b8893a" }}>
                E-Certify
              </em>
            </h1>

            {/* Ornamental divider */}
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="h-px w-20" style={{ background: "linear-gradient(90deg, transparent, #b8893a 60%)" }} />
              <span className="text-xs" style={{ color: "#b8893a" }}>◆</span>
              <div className="h-px w-20" style={{ background: "linear-gradient(270deg, transparent, #b8893a 60%)" }} />
            </div>

            <p className="text-[13.5px] font-light leading-relaxed max-w-md mx-auto" style={{ color: "#6b5f4e" }}>
              A decentralized platform that makes credential fraud a thing of the past —
              secured by cryptography and stored forever on the blockchain.
            </p>

            {/* Status pills */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {["Decentralized", "Immutable", "Trusted"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] tracking-widest uppercase font-medium px-3 py-1 rounded-full border"
                  style={{ color: "#b8893a", borderColor: "rgba(184,137,58,0.25)", background: "rgba(184,137,58,0.07)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Feature cards */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(184,137,58,0.15)",
              background: "rgba(255,255,255,0.38)",
              boxShadow: "0 8px 48px rgba(120,90,40,0.07)",
            }}
          >
            {features.map(({ num, icon, title, desc }, i) => (
              <div
                key={title}
                className="card-row flex items-start gap-5 px-7 py-6"
                style={{
                  background: "rgba(255,255,255,0.45)",
                  borderBottom: i < features.length - 1 ? "1px solid rgba(184,137,58,0.09)" : "none",
                }}
              >
                <span className="font-playfair italic text-xs pt-1 select-none w-5 shrink-0" style={{ color: "#c9b99a" }}>
                  {num}
                </span>
                <span className="text-xl leading-none pt-0.5 shrink-0">{icon}</span>
                <div>
                  <h3 className="font-playfair font-semibold text-[15.5px] mb-1.5 tracking-wide" style={{ color: "#1e1a14" }}>
                    {title}
                  </h3>
                  <p className="text-[13px] font-light leading-[1.7]" style={{ color: "#7a6d5e" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between mt-7 pt-6 flex-wrap gap-3"
            style={{ borderTop: "1px solid rgba(184,137,58,0.12)" }}
          >
            <p className="text-[11px] tracking-[0.14em] uppercase font-light" style={{ color: "#b5a795" }}>
              Built on open standards
            </p>
            <div className="flex gap-2">
              {["Next.js", "Ethereum", "IPFS"].map((t) => (
                <span
                  key={t}
                  className="text-[10px] tracking-widest uppercase font-medium px-3 py-1 rounded-full border"
                  style={{ color: "#b8893a", borderColor: "rgba(184,137,58,0.2)", background: "rgba(184,137,58,0.07)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}