"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { type Cert } from "./CertificateList1";

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

const STATUS_STYLES: Record<StatusType, {
  badge: string;
  bar: string;
  dot: string;
  border: string;
  glow: string;
}> = {
  Approved: {
    badge:  "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400",
    bar:    "bg-gradient-to-r from-emerald-500 to-teal-500",
    dot:    "bg-emerald-400 animate-pulse",
    border: "border-emerald-500/20 hover:border-emerald-500/40",
    glow:   "hover:shadow-emerald-500/5",
  },
  Revoked: {
    badge:  "bg-red-500/15 border border-red-500/30 text-red-400",
    bar:    "bg-gradient-to-r from-red-500 to-rose-500",
    dot:    "bg-red-400",
    border: "border-red-500/20 hover:border-red-500/40",
    glow:   "hover:shadow-red-500/5",
  },
  Pending: {
    badge:  "bg-amber-500/15 border border-amber-500/30 text-amber-400",
    bar:    "bg-gradient-to-r from-amber-500 to-yellow-500",
    dot:    "bg-amber-400 animate-pulse",
    border: "border-white/15 hover:border-amber-500/30",
    glow:   "hover:shadow-amber-500/5",
  },
};

function CopyBtn({ text }: { text: string }) {
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
      className="text-gray-600 hover:text-gray-300 transition-colors ml-1 shrink-0">
      {done ? (
        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
        </svg>
      )}
    </button>
  );
}

export default function CertificateCard({ certificate }: { certificate: Cert }) {
  const status = getStatus(certificate);
  const s = STATUS_STYLES[status];
  const [showQR, setShowQR] = useState(false);

  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://yourapp.vercel.app"}/verify?certId=${certificate.id}`;

  return (
    <div className={`
      rounded-2xl border bg-white/5 overflow-hidden
      flex flex-col shadow-lg transition-all duration-200
      hover:shadow-xl hover:-translate-y-[1px]
      ${s.border} ${s.glow}
    `}>
      {/* Top color bar */}
      <div className={`h-[3px] w-full ${s.bar}`} />

      <div className="p-5 flex flex-col gap-4 flex-1">

        {/* Header row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Certificate</span>
            <span className="font-mono text-xs bg-white/8 border border-white/15 rounded-md px-2 py-0.5 text-gray-400">
              #{String(certificate.id)}
            </span>
          </div>
          <div className={`flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full ${s.badge}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
          </div>
        </div>

        {/* Document */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Document</p>
          {certificate.approved ? (
            <a
              href={`https://gateway.pinata.cloud/ipfs/${certificate.ipfsHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-xl
                         bg-emerald-500/10 border border-emerald-500/20
                         text-emerald-400 text-xs font-medium
                         hover:bg-emerald-500/15 transition-all group"
            >
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              View Document
              <svg className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-60 transition-opacity"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          ) : (
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs
              ${status === "Revoked"
                ? "bg-red-500/10 border border-red-500/20 text-red-400"
                : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
              }`}>
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {status === "Revoked" ? "Access revoked" : "Locked until approved"}
            </div>
          )}
        </div>

        {/* Student */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Student</p>
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30
                            border border-cyan-500/20 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
            </div>
            <span className="font-mono text-xs text-gray-300">
              {truncate(certificate.student, 8, 6)}
            </span>
            {certificate.student && <CopyBtn text={certificate.student} />}
          </div>
        </div>

        {/* Institute */}
        <div className="space-y-1.5">
          <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Institute</p>
          {isZero(certificate.institute) ? (
            <span className="text-xs text-gray-600 italic">Not yet assigned</span>
          ) : (
            <div className="flex items-center gap-1">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30
                              border border-purple-500/20 flex items-center justify-center shrink-0">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
              </div>
              <span className="font-mono text-xs text-gray-300">
                {truncate(certificate.institute, 8, 6)}
              </span>
              <CopyBtn text={certificate.institute} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-white/8 flex items-center justify-between">
          <p className="text-[10px] text-gray-600">Use ID to verify on Verify page</p>
          <div className="flex items-center gap-1.5 font-mono text-xs text-gray-400">
            <span>ID:</span>
            <span className="text-white font-semibold">#{certificate.id}</span>
            <CopyBtn text={String(certificate.id)} />
          </div>
        </div>

        {/* QR Code toggle — only for approved certs */}
        {certificate.approved && !certificate.revoked && (
          <div className="pt-1">
            <button
              onClick={() => setShowQR(!showQR)}
              className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200 ${
                showQR
                  ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                  : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
              </svg>
              {showQR ? "Hide QR Code" : "Show QR Code"}
            </button>

            {showQR && (
              <div className="mt-3 flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="p-3 bg-white rounded-xl">
                  <QRCodeSVG
                    value={verifyUrl}
                    size={140}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
                <div className="text-center">
                  <p className="text-[11px] text-gray-400">Scan to verify certificate</p>
                  <p className="text-[10px] text-gray-600 mt-0.5 font-mono">Certificate #{String(certificate.id)}</p>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}