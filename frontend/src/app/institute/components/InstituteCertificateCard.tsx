"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, ExternalLink, QrCode, ChevronUp, ShieldOff, Loader2, Link } from "lucide-react";

interface Cert {
  id: bigint;
  ipfsHash: string;
  student: string;
  institute: string;
  approved: boolean;
  revoked: boolean;
}

interface Props {
  cert: Cert;
  onRevoke: (id: bigint) => Promise<void>;
  revoking: boolean;
}

export default function InstituteCertificateCard({ cert, onRevoke, revoking }: Props) {
  const [confirmRevoke, setConfirmRevoke] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const gold = "#b8893a";
  const shortStudent = `${cert.student.slice(0, 6)}…${cert.student.slice(-4)}`;
  const ipfsUrl = `https://ipfs.io/ipfs/${cert.ipfsHash}`;
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.vercel.app"}/verify?certId=${cert.id}`;

  const isActive = !cert.revoked;

  const statusConfig = isActive ? {
    label: "Active",
    dotColor: "#16a34a",
    textColor: "#16a34a",
    badgeBg: "rgba(22,163,74,0.08)",
    badgeBorder: "rgba(22,163,74,0.25)",
    accentBar: "linear-gradient(180deg,#16a34a,#4ade80)",
    cardBorder: "rgba(22,163,74,0.18)",
    pulse: true,
  } : {
    label: "Revoked",
    dotColor: "#dc2626",
    textColor: "#dc2626",
    badgeBg: "rgba(220,38,38,0.07)",
    badgeBorder: "rgba(220,38,38,0.22)",
    accentBar: "linear-gradient(180deg,#dc2626,#f87171)",
    cardBorder: "rgba(220,38,38,0.18)",
    pulse: false,
  };

  function copyAddress() {
    navigator.clipboard.writeText(cert.student);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-200"
      style={{
        background: cert.revoked ? "rgba(255,255,255,0.38)" : "rgba(255,255,255,0.62)",
        border: `1px solid ${statusConfig.cardBorder}`,
        boxShadow: "0 2px 16px rgba(120,90,40,0.06)",
        opacity: cert.revoked ? 0.72 : 1,
      }}
    >
      {/* ── Left accent bar + content ── */}
      <div className="flex flex-1">

        {/* Vertical accent bar */}
        <div className="w-1 shrink-0" style={{ background: statusConfig.accentBar }} />

        <div className="flex-1 p-5 flex flex-col gap-4">

          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase font-light mb-0.5" style={{ color: "#b5a795" }}>Certificate</p>
              <p className="font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1e1a14" }}>
                #{cert.id.toString().padStart(3, "0")}
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium"
              style={{ background: statusConfig.badgeBg, border: `1px solid ${statusConfig.badgeBorder}`, color: statusConfig.textColor }}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusConfig.pulse ? "animate-pulse" : ""}`}
                style={{ background: statusConfig.dotColor }} />
              {statusConfig.label}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(184,137,58,0.2), transparent)" }} />

          {/* ── Student ── */}
          <div className="space-y-1">
            <p className="text-[9px] tracking-[0.2em] uppercase font-medium" style={{ color: "#b5a795" }}>Student</p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(184,137,58,0.3), rgba(201,162,74,0.15))", border: "1px solid rgba(184,137,58,0.3)" }} />
              <span className="font-mono text-xs flex-1" style={{ color: "#4a3f30" }}>{shortStudent}</span>
              <button onClick={copyAddress}
                className="shrink-0 p-0.5 rounded-md transition-all hover:bg-black/5"
                style={{ color: copied ? "#16a34a" : "#b5a795" }}>
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          </div>

          {/* ── Document ── */}
          <div className="space-y-1.5">
            <p className="text-[9px] tracking-[0.2em] uppercase font-medium" style={{ color: "#b5a795" }}>Document</p>
            <a href={ipfsUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
              style={{ background: "rgba(184,137,58,0.07)", border: "1px solid rgba(184,137,58,0.18)", color: gold }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,137,58,0.13)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(184,137,58,0.07)"; }}>
              <Link size={12} />
              <span className="flex-1 truncate font-mono">
                {cert.ipfsHash.slice(0, 16)}…{cert.ipfsHash.slice(-6)}
              </span>
              <ExternalLink size={10} style={{ color: "rgba(184,137,58,0.5)", flexShrink: 0 }} />
            </a>
          </div>

          {/* ── Footer ── */}
          <div className="mt-auto pt-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(184,137,58,0.1)" }}>
            <p className="text-[10px] font-light" style={{ color: "#b5a795" }}>Use ID to verify</p>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-semibold" style={{ color: "#1e1a14" }}>
                #{cert.id.toString()}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ── QR toggle (active only) ── */}
      {isActive && (
        <>
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all"
            style={{
              borderTop: "1px solid rgba(184,137,58,0.1)",
              background: showQR ? "rgba(184,137,58,0.06)" : "rgba(255,255,255,0.3)",
              color: showQR ? gold : "#9a8a78",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,137,58,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = gold; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = showQR ? "rgba(184,137,58,0.06)" : "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = showQR ? gold : "#9a8a78"; }}
          >
            {showQR ? <ChevronUp size={13} /> : <QrCode size={13} />}
            {showQR ? "Hide QR" : "Show QR Code"}
          </button>

          {showQR && (
            <div className="flex flex-col items-center gap-3 px-5 py-5"
              style={{ borderTop: "1px solid rgba(184,137,58,0.1)", background: "rgba(255,255,255,0.4)" }}>
              <div className="p-3 rounded-2xl"
                style={{ background: "#fefcf7", border: "2px solid rgba(184,137,58,0.2)", boxShadow: "0 4px 16px rgba(120,90,40,0.1)" }}>
                <QRCodeSVG value={verifyUrl} size={130} bgColor="#fefcf7" fgColor="#1e1a14" level="M" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-medium" style={{ color: "#7a6d5e" }}>Scan to verify</p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: "#b5a795" }}>
                  Certificate #{cert.id.toString().padStart(3, "0")}
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Revoke section ── */}
      {isActive && (
        <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(184,137,58,0.1)", background: "rgba(255,255,255,0.3)" }}>
          {confirmRevoke ? (
            <div className="space-y-2">
              <p className="text-[11px] text-center font-light mb-2" style={{ color: "#7a6d5e" }}>
                This action cannot be undone. Are you sure?
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirmRevoke(false)}
                  className="flex-1 h-9 rounded-xl text-xs font-medium transition-all"
                  style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.18)", color: "#9a8a78" }}>
                  Cancel
                </button>
                <button
                  onClick={async () => { setConfirmRevoke(false); await onRevoke(cert.id); }}
                  disabled={revoking}
                  className="flex-1 h-9 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all disabled:opacity-40"
                  style={{ background: "rgba(220,38,38,0.09)", border: "1px solid rgba(220,38,38,0.25)", color: "#dc2626" }}>
                  {revoking
                    ? <><Loader2 size={12} className="animate-spin" /> Revoking…</>
                    : <><ShieldOff size={12} /> Confirm Revoke</>}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRevoke(true)}
              className="w-full h-9 rounded-xl text-xs font-medium transition-all duration-200"
              style={{ background: "rgba(255,255,255,0.4)", border: "1px solid rgba(184,137,58,0.14)", color: "#b5a795" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.07)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.22)"; (e.currentTarget as HTMLButtonElement).style.color = "#dc2626"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.4)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,137,58,0.14)"; (e.currentTarget as HTMLButtonElement).style.color = "#b5a795"; }}>
              Revoke Certificate
            </button>
          )}
        </div>
      )}
    </div>
  );
}