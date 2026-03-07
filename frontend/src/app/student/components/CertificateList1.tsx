"use client";

import { useEffect, useState, useCallback } from "react";
import { getCertificateContract } from "@/lib/contracts";
import CertificateCard from "./CertificateCard2";
import { RefreshCw, AlertCircle, ScrollText } from "lucide-react";

export type Cert = {
  id: number;
  ipfsHash: string;
  student: string;
  institute: string;
  approved: boolean;
  revoked: boolean;
};

function parseCert(raw: any): Cert {
  return {
    id:        Number(raw.id),
    ipfsHash:  raw.ipfsHash,
    student:   raw.student,
    institute: raw.institute,
    approved:  raw.approved,
    revoked:   raw.revoked,
  };
}

type Status = "loading" | "error" | "empty" | "ready";

export default function CertificateList() {
  const [certs, setCerts]   = useState<Cert[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errMsg, setErrMsg] = useState("");
  const [filter, setFilter] = useState<"all" | "approved" | "pending" | "revoked">("all");

  const fetchCertificates = useCallback(async () => {
    setStatus("loading");
    setErrMsg("");
    try {
      const contract = await getCertificateContract();
      const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
      const signerAddress = accounts[0];
      if (!signerAddress) throw new Error("Could not get wallet address.");

      const ids: bigint[] = await contract.getStudentCertificates(signerAddress);
      if (!ids || ids.length === 0) { setCerts([]); setStatus("empty"); return; }

      const rawCerts = await Promise.all(ids.map((id) => contract.getCertificate(id)));
      setCerts(rawCerts.map(parseCert).reverse());
      setStatus("ready");
    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg.includes("Wrong network"))      setErrMsg("Switch MetaMask to Sepolia Testnet.");
      else if (msg.includes("MetaMask"))      setErrMsg("MetaMask not detected.");
      else if (msg.includes("Not student"))   setErrMsg("Your wallet is not registered as a student.");
      else if (msg.includes("user rejected")) setErrMsg("MetaMask connection was rejected.");
      else setErrMsg(msg || "Unexpected blockchain error.");
      setStatus("error");
    }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  useEffect(() => {
    let contract: any;
    let mounted = true;
    async function subscribe() {
      try {
        contract = await getCertificateContract();
        const refresh = () => { if (mounted) fetchCertificates(); };
        contract.on("CertificateRequested", refresh);
        contract.on("CertificateApproved",  refresh);
        contract.on("CertificateRevoked",   refresh);
        contract.on("CertificateIssued",    refresh);
      } catch (e) { console.warn("Event subscription failed:", e); }
    }
    subscribe();
    return () => {
      mounted = false;
      if (contract?.removeAllListeners) {
        contract.removeAllListeners("CertificateRequested");
        contract.removeAllListeners("CertificateApproved");
        contract.removeAllListeners("CertificateRevoked");
        contract.removeAllListeners("CertificateIssued");
      }
    };
  }, [fetchCertificates]);

  useEffect(() => {
    window.addEventListener("focus", fetchCertificates);
    return () => window.removeEventListener("focus", fetchCertificates);
  }, [fetchCertificates]);

  const gold = "#b8893a";

  /* ── Loading ── */
  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(184,137,58,0.15)", borderTopColor: gold }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <ScrollText size={18} style={{ color: gold }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
            Fetching certificates
          </p>
          <p className="text-xs font-light mt-0.5" style={{ color: "#9a8a78" }}>Reading from blockchain…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (status === "error") {
    return (
      <div className="rounded-2xl overflow-hidden max-w-2xl"
        style={{ border: "1px solid rgba(220,38,38,0.2)" }}>
        <div className="px-5 py-3 flex items-center gap-2"
          style={{ background: "rgba(220,38,38,0.07)", borderBottom: "1px solid rgba(220,38,38,0.15)" }}>
          <AlertCircle size={14} style={{ color: "#dc2626" }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#dc2626" }}>Error</span>
        </div>
        <div className="px-5 py-4" style={{ background: "rgba(255,255,255,0.5)" }}>
          <p className="text-sm font-light leading-relaxed mb-4" style={{ color: "#7a6d5e" }}>{errMsg}</p>
          <button onClick={fetchCertificates}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:-translate-y-[1px]"
            style={{ background: "rgba(184,137,58,0.09)", border: "1px solid rgba(184,137,58,0.22)", color: gold }}>
            <RefreshCw size={12} /> Try again
          </button>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (status === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-2 rounded-xl rotate-6"
            style={{ background: "rgba(184,137,58,0.08)", border: "1px solid rgba(184,137,58,0.15)" }} />
          <div className="absolute inset-2 rounded-xl -rotate-3"
            style={{ background: "rgba(184,137,58,0.12)", border: "1px solid rgba(184,137,58,0.2)" }} />
          <div className="absolute inset-2 rounded-xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(184,137,58,0.25)" }}>
            <ScrollText size={20} style={{ color: gold }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-base font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
            No certificates yet
          </p>
          <p className="text-xs font-light mt-1" style={{ color: "#9a8a78" }}>
            Submit a request — it will appear here once confirmed.
          </p>
        </div>
      </div>
    );
  }

  const approved = certs.filter((c) => c.approved && !c.revoked);
  const pending  = certs.filter((c) => !c.approved && !c.revoked);
  const revoked  = certs.filter((c) => c.revoked);

  const filtered = filter === "all"      ? certs
                 : filter === "approved" ? approved
                 : filter === "pending"  ? pending
                 : revoked;

  const filters: {
    key: typeof filter; label: string; count: number;
    color: string; activeBg: string; activeBorder: string;
  }[] = [
    { key: "all",      label: "All",      count: certs.length,    color: "#1e1a14", activeBg: "rgba(184,137,58,0.12)", activeBorder: "rgba(184,137,58,0.35)" },
    { key: "approved", label: "Approved", count: approved.length, color: "#16a34a", activeBg: "rgba(22,163,74,0.1)",   activeBorder: "rgba(22,163,74,0.3)"   },
    { key: "pending",  label: "Pending",  count: pending.length,  color: "#d97706", activeBg: "rgba(217,119,6,0.1)",   activeBorder: "rgba(217,119,6,0.3)"   },
    { key: "revoked",  label: "Revoked",  count: revoked.length,  color: "#dc2626", activeBg: "rgba(220,38,38,0.08)",  activeBorder: "rgba(220,38,38,0.28)"  },
  ];

  return (
    <div className="space-y-6">

      {/* ── Filter bar + Refresh ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(184,137,58,0.14)" }}>
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              style={filter === f.key ? {
                background: f.activeBg,
                border: `1px solid ${f.activeBorder}`,
                color: f.color,
              } : {
                background: "transparent",
                border: "1px solid transparent",
                color: "#9a8a78",
              }}>
              {f.label}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={filter === f.key ? {
                  background: "rgba(255,255,255,0.5)", color: f.color,
                } : {
                  background: "rgba(184,137,58,0.08)", color: "#b5a795",
                }}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        <button onClick={fetchCertificates}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:-translate-y-[1px]"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.18)", color: gold }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Empty filter result ── */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm font-light" style={{ color: "#9a8a78" }}>No {filter} certificates.</p>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>

    </div>
  );
}