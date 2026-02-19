"use client";

import { useState } from "react";
import { type Cert } from "./CertificateList2";

function truncate(str: string, start = 6, end = 4): string {
  if (!str || str === "0x0000000000000000000000000000000000000000") return "";
  if (str.length <= start + end + 3) return str;
  return `${str.slice(0, start)}…${str.slice(-end)}`;
}

function isZero(addr: string): boolean {
  return !addr || addr === "0x0000000000000000000000000000000000000000";
}

type Status = "Approved" | "Revoked" | "Pending";

function getStatus(cert: Cert): Status {
  if (cert.revoked)  return "Revoked";
  if (cert.approved) return "Approved";
  return "Pending";
}

const BADGE: Record<Status, string> = {
  Approved: "bg-green-50 text-green-700 border border-green-200",
  Revoked:  "bg-red-50 text-red-700 border border-red-200",
  Pending:  "bg-yellow-50 text-yellow-700 border border-yellow-200",
};

const BAR: Record<Status, string> = {
  Approved: "bg-green-500",
  Revoked:  "bg-red-500",
  Pending:  "bg-yellow-400",
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
    <button onClick={copy} className="ml-1 shrink-0 text-gray-400 hover:text-gray-700 transition-colors">
      {done
        ? <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><polyline points="2,8 6,12 14,4" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        : <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="5" y="5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 5V3.5A1.5 1.5 0 0 0 9.5 2h-6A1.5 1.5 0 0 0 2 3.5v6A1.5 1.5 0 0 0 3.5 11H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
      }
    </button>
  );
}

function Field({ label, value, full, empty = "Not assigned" }: {
  label: string; value?: string; full?: string; empty?: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      {value ? (
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1.5 min-w-0">
          <span className="font-mono text-xs text-gray-600 truncate min-w-0 flex-1">{value}</span>
          {full && <CopyBtn text={full} />}
        </div>
      ) : (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-md px-2.5 py-1.5">
          <span className="font-mono text-xs text-gray-400 italic">{empty}</span>
        </div>
      )}
    </div>
  );
}

export default function CertificateCard({ certificate }: { certificate: Cert }) {
  const status = getStatus(certificate);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Status bar */}
      <div className={`h-0.5 w-full ${BAR[status]}`} />

      {/* Body */}
      <div className="p-4 flex flex-col gap-3 flex-1">

        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-gray-900 shrink-0">Certificate</span>
            <span className="font-mono text-xs bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 shrink-0">
              #{String(certificate.id)}
            </span>
          </div>
          <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full shrink-0 ${BADGE[status]}`}>
            {status === "Pending" && (
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-400 mr-1.5 animate-pulse" />
            )}
            {status}
          </span>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-2.5">

          {/* Document / IPFS — security gated */}
          <div>
            <p className="text-[10px] font-mono font-medium text-gray-400 uppercase tracking-widest mb-1">Document</p>
            {certificate.approved ? (
              <div className="flex items-center bg-green-50 border border-green-200 rounded-md px-2.5 py-1.5 min-w-0">
                <span className="font-mono text-xs text-green-700 truncate min-w-0 flex-1">
                  {certificate.ipfsHash.slice(0, 18)}…{certificate.ipfsHash.slice(-6)}
                </span>
                <CopyBtn text={certificate.ipfsHash} />
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-md px-2.5 py-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#b45309" strokeWidth="1.4"/>
                  <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="#b45309" strokeWidth="1.4" strokeLinecap="round"/>
                  <circle cx="8" cy="11" r="1" fill="#b45309"/>
                </svg>
                <span className="font-mono text-xs text-yellow-700">
                  {status === "Revoked" ? "Access revoked" : "Hidden until approved"}
                </span>
              </div>
            )}
          </div>

          <Field
            label="Student"
            value={truncate(certificate.student, 8, 6) || undefined}
            full={certificate.student}
            empty="Unknown"
          />

          <Field
            label="Institute"
            value={isZero(certificate.institute) ? undefined : truncate(certificate.institute, 8, 6)}
            full={isZero(certificate.institute) ? undefined : certificate.institute}
            empty="Not yet assigned"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100 mx-4" />

      {/* Footer */}
      <div className="p-4 pt-3">
        {certificate.approved ? (
          <a
            href={`https://ipfs.io/ipfs/${certificate.ipfsHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 w-full h-8 bg-gray-50 hover:bg-gray-900 hover:text-white border border-gray-200 hover:border-gray-900 rounded-lg text-xs font-medium text-gray-600 transition-all duration-150"
          >
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M7 3H3.5A1.5 1.5 0 0 0 2 4.5v8A1.5 1.5 0 0 0 3.5 14h8A1.5 1.5 0 0 0 13 12.5V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M9 2h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="14" y1="2" x2="7" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            View on IPFS
          </a>
        ) : (
          <div className="flex items-center justify-center gap-1.5 w-full h-8 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-400 cursor-not-allowed select-none">
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3"/>
              <line x1="8" y1="5" x2="8" y2="8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="8" cy="11" r="0.8" fill="currentColor"/>
            </svg>
            {status === "Revoked" ? "Document revoked" : "Awaiting approval"}
          </div>
        )}
      </div>

    </div>
  );
}