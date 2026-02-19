"use client";

import { useState } from "react";

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

  const shortStudent = `${cert.student.slice(0, 6)}…${cert.student.slice(-4)}`;
  const ipfsUrl = `https://ipfs.io/ipfs/${cert.ipfsHash}`;

  const status = cert.revoked
    ? { label: "Revoked",  dot: "bg-red-400",     text: "text-red-400",     ring: "bg-red-500/8 border-red-500/15"       }
    : { label: "Active",   dot: "bg-emerald-400", text: "text-emerald-400", ring: "bg-emerald-500/8 border-emerald-500/15" };

  function copyAddress() {
    navigator.clipboard.writeText(cert.student);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`
      rounded-2xl border p-5 space-y-4 transition-all duration-200
      ${cert.revoked
        ? "bg-white/2 border-white/5 opacity-55"
        : "bg-white/3 border-white/8 hover:border-white/15 hover:bg-white/5"
      }
    `}>
      {/* Top row: cert ID + status */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-white/25">
          Cert #{cert.id.toString()}
        </span>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${status.ring} ${status.text}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status.dot} ${!cert.revoked ? "animate-pulse" : ""}`} />
          {status.label}
        </div>
      </div>

      {/* Student address */}
      <div className="space-y-1">
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Student</p>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
          </div>
          <p className="text-sm font-mono text-white/60">{shortStudent}</p>
          <button
            onClick={copyAddress}
            className="text-white/20 hover:text-white/50 transition-colors"
            title="Copy address"
          >
            {copied ? (
              <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* IPFS link */}
      <div className="space-y-1">
        <p className="text-[10px] font-mono text-white/25 uppercase tracking-widest">Document</p>
        <a
          href={ipfsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors group"
        >
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          <span className="truncate max-w-[180px] group-hover:underline underline-offset-2">
            {cert.ipfsHash.slice(0, 18)}…{cert.ipfsHash.slice(-6)}
          </span>
          <svg className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
          </svg>
        </a>
      </div>

      {/* Revoke action */}
      {!cert.revoked && (
        <div className="pt-2 border-t border-white/5">
          {confirmRevoke ? (
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmRevoke(false)}
                className="flex-1 h-8 rounded-lg bg-white/5 text-white/35 text-xs hover:bg-white/8 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setConfirmRevoke(false);
                  await onRevoke(cert.id);
                }}
                disabled={revoking}
                className="flex-1 h-8 rounded-lg bg-red-500/15 border border-red-500/20
                           text-red-400 text-xs font-medium hover:bg-red-500/25
                           transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {revoking && (
                  <div className="w-3 h-3 border border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                )}
                Confirm Revoke
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmRevoke(true)}
              className="w-full h-8 rounded-lg bg-white/3 border border-white/5
                         text-white/25 text-xs hover:bg-red-500/8 hover:border-red-500/20
                         hover:text-red-400 transition-all duration-200"
            >
              Revoke Certificate
            </button>
          )}
        </div>
      )}
    </div>
  );
}