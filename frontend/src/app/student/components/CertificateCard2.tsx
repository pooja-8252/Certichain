"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { type Cert } from "./CertificateList1";
import { Copy, Check, FileText, ExternalLink, QrCode, ChevronUp, Lock, ShieldOff } from "lucide-react";

function truncate(str: string, start = 6, end = 4): string {
  if (!str || str === "0x0000000000000000000000000000000000000000") return "";
  if (str.length <= start + end + 3) return str;
  return `${str.slice(0, start)}…${str.slice(-end)}`;
}

function isZero(addr: string): boolean {
  return !addr || addr === "0x0000000000000000000000000000000000000000";
}

type StatusType = "Approved" | "Revoked" | "Pending";

function getStatus(cert: Cert): StatusType {
  if (cert.revoked) return "Revoked";
  if (cert.approved) return "Approved";
  return "Pending";
}

const STATUS_CONFIG: Record<StatusType, {
  label: string;
  dotColor: string;
  textColor: string;
  badgeBg: string;
  badgeBorder: string;
  accentBar: string;
  cardBorder: string;
  cardHoverBorder: string;
  pulse: boolean;
}> = {
  Approved: {
    label: "Approved",
    dotColor: "#16a34a",
    textColor: "#16a34a",
    badgeBg: "rgba(22,163,74,0.08)",
    badgeBorder: "rgba(22,163,74,0.25)",
    accentBar: "linear-gradient(180deg, #16a34a, #4ade80)",
    cardBorder: "rgba(22,163,74,0.18)",
    cardHoverBorder: "rgba(22,163,74,0.35)",
    pulse: true,
  },
  Revoked: {
    label: "Revoked",
    dotColor: "#dc2626",
    textColor: "#dc2626",
    badgeBg: "rgba(220,38,38,0.07)",
    badgeBorder: "rgba(220,38,38,0.22)",
    accentBar: "linear-gradient(180deg, #dc2626, #f87171)",
    cardBorder: "rgba(220,38,38,0.18)",
    cardHoverBorder: "rgba(220,38,38,0.32)",
    pulse: false,
  },
  Pending: {
    label: "Pending",
    dotColor: "#d97706",
    textColor: "#d97706",
    badgeBg: "rgba(217,119,6,0.08)",
    badgeBorder: "rgba(217,119,6,0.25)",
    accentBar: "linear-gradient(180deg, #d97706, #fbbf24)",
    cardBorder: "rgba(184,137,58,0.2)",
    cardHoverBorder: "rgba(217,119,6,0.35)",
    pulse: true,
  },
};

function CopyBtn({ text, small = false }: { text: string; small?: boolean }) {
  const [done, setDone] = useState(false);
  function copy(e: React.MouseEvent) {
    e.preventDefault();
    navigator.clipboard.writeText(text).then(() => {
      setDone(true);
      setTimeout(() => setDone(false), 1500);
    });
  }
  return (
    <button onClick={copy}
      className="shrink-0 transition-all duration-150 rounded-md p-0.5 hover:bg-black/5"
      style={{ color: done ? "#16a34a" : "#b5a795" }}>
      {done
        ? <Check size={small ? 11 : 13} />
        : <Copy size={small ? 11 : 13} />}
    </button>
  );
}

export default function CertificateCard({ certificate }: { certificate: Cert }) {
  const status = getStatus(certificate);
  const s = STATUS_CONFIG[status];
  const [showQR, setShowQR] = useState(false);

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.vercel.app"}/verify?certId=${certificate.id}`;

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col transition-all duration-250 group"
      style={{
        background: "rgba(255,255,255,0.62)",
        border: `1px solid ${s.cardBorder}`,
        boxShadow: "0 2px 16px rgba(120,90,40,0.06)",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${s.cardHoverBorder}`; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 28px rgba(120,90,40,0.1)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.border = `1px solid ${s.cardBorder}`; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 16px rgba(120,90,40,0.06)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >
      {/* ── Left accent bar + main content ── */}
      <div className="flex flex-1">

        {/* Vertical accent bar */}
        <div className="w-1 shrink-0 rounded-tl-2xl" style={{ background: s.accentBar }} />

        <div className="flex-1 p-5 flex flex-col gap-4">

          {/* ── Card header ── */}
          <div className="flex items-start justify-between gap-2">
            {/* Certificate ID — stamp style */}
            <div>
              <p className="text-[9px] tracking-[0.2em] uppercase font-light mb-0.5" style={{ color: "#b5a795" }}>
                Certificate
              </p>
              <p className="font-bold leading-none" style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", color: "#1e1a14" }}>
                #{String(certificate.id).padStart(3, "0")}
              </p>
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-[11px] font-medium"
              style={{ background: s.badgeBg, border: `1px solid ${s.badgeBorder}`, color: s.textColor }}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.pulse ? "animate-pulse" : ""}`}
                style={{ background: s.dotColor }} />
              {s.label}
            </div>
          </div>

          {/* ── Divider ── */}
          <div className="h-px" style={{ background: "linear-gradient(90deg, rgba(184,137,58,0.2), transparent)" }} />

          {/* ── Document row ── */}
          <div className="space-y-1.5">
            <p className="text-[9px] tracking-[0.2em] uppercase font-medium" style={{ color: "#b5a795" }}>
              Document
            </p>
            {certificate.approved && !certificate.revoked ? (
              <a href={`https://gateway.pinata.cloud/ipfs/${certificate.ipfsHash}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)", color: "#16a34a" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(22,163,74,0.12)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(22,163,74,0.07)"; }}
              >
                <FileText size={13} />
                <span className="flex-1">View Document</span>
                <ExternalLink size={11} style={{ color: "rgba(22,163,74,0.5)" }} />
              </a>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs"
                style={{
                  background: status === "Revoked" ? "rgba(220,38,38,0.06)" : "rgba(217,119,6,0.06)",
                  border: `1px solid ${status === "Revoked" ? "rgba(220,38,38,0.18)" : "rgba(217,119,6,0.18)"}`,
                  color: status === "Revoked" ? "#dc2626" : "#d97706",
                }}>
                {status === "Revoked" ? <ShieldOff size={13} /> : <Lock size={13} />}
                <span>{status === "Revoked" ? "Access revoked" : "Locked until approved"}</span>
              </div>
            )}
          </div>

          {/* ── Student row ── */}
          <div className="space-y-1">
            <p className="text-[9px] tracking-[0.2em] uppercase font-medium" style={{ color: "#b5a795" }}>Student</p>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full shrink-0"
                style={{ background: "linear-gradient(135deg, rgba(184,137,58,0.3), rgba(201,162,74,0.15))", border: "1px solid rgba(184,137,58,0.3)" }} />
              <span className="font-mono text-xs flex-1 truncate" style={{ color: "#4a3f30" }}>
                {truncate(certificate.student, 8, 6)}
              </span>
              {certificate.student && <CopyBtn text={certificate.student} small />}
            </div>
          </div>

          {/* ── Institute row ── */}
          <div className="space-y-1">
            <p className="text-[9px] tracking-[0.2em] uppercase font-medium" style={{ color: "#b5a795" }}>Institute</p>
            {isZero(certificate.institute) ? (
              <p className="text-xs font-light italic" style={{ color: "#b5a795" }}>Not yet assigned</p>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.1))", border: "1px solid rgba(99,102,241,0.25)" }} />
                <span className="font-mono text-xs flex-1 truncate" style={{ color: "#4a3f30" }}>
                  {truncate(certificate.institute, 8, 6)}
                </span>
                <CopyBtn text={certificate.institute} small />
              </div>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="mt-auto pt-3 flex items-center justify-between"
            style={{ borderTop: "1px solid rgba(184,137,58,0.1)" }}>
            <p className="text-[10px] font-light" style={{ color: "#b5a795" }}>
              Use ID to verify
            </p>
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-xs font-semibold" style={{ color: "#1e1a14" }}>
                #{certificate.id}
              </span>
              <CopyBtn text={String(certificate.id)} small />
            </div>
          </div>

        </div>
      </div>

      {/* ── QR section (approved only) ── */}
      {certificate.approved && !certificate.revoked && (
        <>
          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-all"
            style={{
              borderTop: "1px solid rgba(184,137,58,0.1)",
              background: showQR ? "rgba(184,137,58,0.06)" : "rgba(255,255,255,0.3)",
              color: showQR ? "#b8893a" : "#9a8a78",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(184,137,58,0.08)"; (e.currentTarget as HTMLButtonElement).style.color = "#b8893a"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = showQR ? "rgba(184,137,58,0.06)" : "rgba(255,255,255,0.3)"; (e.currentTarget as HTMLButtonElement).style.color = showQR ? "#b8893a" : "#9a8a78"; }}
          >
            {showQR ? <ChevronUp size={13} /> : <QrCode size={13} />}
            {showQR ? "Hide QR" : "Show QR Code"}
          </button>

          {showQR && (
            <div className="flex flex-col items-center gap-3 px-5 py-5"
              style={{ borderTop: "1px solid rgba(184,137,58,0.1)", background: "rgba(255,255,255,0.4)" }}>
              {/* QR in parchment frame */}
              <div className="p-3 rounded-2xl"
                style={{ background: "#fefcf7", border: "2px solid rgba(184,137,58,0.2)", boxShadow: "0 4px 16px rgba(120,90,40,0.1)" }}>
                <QRCodeSVG
                  value={verifyUrl}
                  size={130}
                  bgColor="#fefcf7"
                  fgColor="#1e1a14"
                  level="M"
                />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-medium" style={{ color: "#7a6d5e" }}>Scan to verify</p>
                <p className="text-[10px] font-mono mt-0.5" style={{ color: "#b5a795" }}>
                  Certificate #{String(certificate.id).padStart(3, "0")}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}