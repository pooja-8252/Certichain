"use client";

import { useEffect, useState, useCallback } from "react";
import { getCertificateContract } from "@/lib/contracts";
import CertificateCard from "./CertificateCard2";
// import CertificateCard from "./CertificateCard1";


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

  const fetchCertificates = useCallback(async () => {
    setStatus("loading");
    setErrMsg("");

    try {
      const contract = await getCertificateContract();

      // const signerAddress = await contract.runner?.getAddress?.();
      // if (!signerAddress) throw new Error("Could not get wallet address.");

      const accounts = await window.ethereum.request({ method: "eth_accounts" }) as string[];
      const signerAddress = accounts[0];
      if (!signerAddress) throw new Error("Could not get wallet address.");



      const ids: bigint[] = await contract.getStudentCertificates(signerAddress);

      if (!ids || ids.length === 0) {
        setCerts([]);
        setStatus("empty");
        return;
      }

      // Use getCertificate — no auth restrictions
      const rawCerts = await Promise.all(ids.map((id) => contract.getCertificate(id)));
      setCerts(rawCerts.map(parseCert).reverse());
      setStatus("ready");

    } catch (err: any) {
      const msg: string = err?.message ?? "";
      if (msg.includes("Wrong network"))    setErrMsg("Switch MetaMask to Monad Testnet (Chain ID 10143).");
      else if (msg.includes("MetaMask"))    setErrMsg("MetaMask not detected.");
      else if (msg.includes("Not student")) setErrMsg("Your wallet is not registered as a student.");
      else if (msg.includes("user rejected")) setErrMsg("MetaMask connection was rejected.");
      else setErrMsg(msg || "Unexpected blockchain error.");
      setStatus("error");
    }
  }, []);

  useEffect(() => { fetchCertificates(); }, [fetchCertificates]);

  // Real-time event refresh
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

  /* ── UI ── */

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-mono">Loading certificates…</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex gap-3 max-w-2xl">
        <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <div>
          <p className="text-red-400 text-sm font-semibold mb-1">Failed to load certificates</p>
          <p className="text-red-400/70 text-xs leading-relaxed">{errMsg}</p>
          <button onClick={fetchCertificates}
            className="mt-3 px-4 py-1.5 rounded-lg bg-white/8 border border-white/15
                       text-white text-xs font-medium hover:bg-white/12 transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-gray-300 text-sm font-medium">No certificates yet</p>
        <p className="text-gray-600 text-xs">Submit a request — it will appear here once confirmed.</p>
      </div>
    );
  }

  const approved = certs.filter((c) => c.approved && !c.revoked);
  const pending  = certs.filter((c) => !c.approved && !c.revoked);
  const revoked  = certs.filter((c) => c.revoked);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="flex items-center gap-3">
        {[
          { label: "Total",    value: certs.length,    color: "text-white" },
          { label: "Approved", value: approved.length, color: "text-emerald-400" },
          { label: "Pending",  value: pending.length,  color: "text-amber-400" },
          { label: "Revoked",  value: revoked.length,  color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="px-5 py-3 rounded-xl bg-white/8 border border-white/15 text-center min-w-[80px]">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
        <button onClick={fetchCertificates}
          className="ml-auto px-4 py-2 rounded-xl bg-white/5 border border-white/15
                     text-gray-400 text-xs hover:text-white hover:bg-white/10
                     transition-all flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {certs.map((cert) => (
          <CertificateCard key={cert.id} certificate={cert} />
        ))}
      </div>
    </div>
  );
}