"use client";

import { useEffect, useState } from "react";
import { getCertificateContract } from "@/lib/contracts";
import InstituteCertificateCard from "./InstituteCertificateCard";

interface Cert {
  id: bigint;
  ipfsHash: string;
  student: string;
  institute: string;
  approved: boolean;
  revoked: boolean;
}

interface Props {
  walletAddress: string;
  walletConnected: boolean;
  onCountLoaded?: (count: number) => void; // add this

}

function isValidAddress(addr: string): boolean {
  return typeof addr === "string" && addr.startsWith("0x") && addr.length === 42;
}

// export default function InstituteCertificateList({ walletAddress, walletConnected }: Props) {
export default function InstituteCertificateList({ walletAddress, walletConnected, onCountLoaded }: Props) {

  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revoking, setRevoking] = useState<string | null>(null);

  async function loadCerts(addr: string) {
    if (!isValidAddress(addr)) return;

    setLoading(true);
    setError("");

    try {
      const contract = await getCertificateContract();

      // Get list of cert IDs for this institute
      const ids: bigint[] = await contract.getInstituteCertificates(addr);

      // Use getCertificate() — no auth restrictions
      const loaded: Cert[] = await Promise.all(
        ids.map(async (id) => {
          const c = await contract.getCertificate(id);
          return {
            id:        c.id,
            ipfsHash:  c.ipfsHash,
            student:   c.student,
            institute: c.institute,
            approved:  c.approved,
            revoked:   c.revoked,
          };
        })
      );

    //   setCerts(loaded.reverse());
    const reversed = loaded.reverse();
    setCerts(reversed);
    onCountLoaded?.(reversed.length);
    } catch (err: any) {
      console.error("loadCerts error:", err);
      setError(err?.message || "Failed to load certificates");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (walletConnected && isValidAddress(walletAddress)) {
      loadCerts(walletAddress);
    }
  }, [walletConnected, walletAddress]);

  async function handleRevoke(certId: bigint) {
    setRevoking(certId.toString());
    try {
      const contract = await getCertificateContract();
      await contract.revokeCertificate.staticCall(certId);
      const tx = await contract.revokeCertificate(certId);
      await tx.wait();
      await loadCerts(walletAddress);
    } catch (err: any) {
      alert(err?.reason || err?.error?.data?.message || err?.message || "Revoke failed");
    } finally {
      setRevoking(null);
    }
  }

  if (!walletConnected || !isValidAddress(walletAddress)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0V4.5" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">Connect your wallet to view certificates</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-mono">Loading certificates…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex gap-3 max-w-2xl">
        <svg className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
        <div>
          <p className="text-red-400 text-sm font-semibold">Failed to load</p>
          <p className="text-red-400/70 text-xs mt-1 leading-relaxed">{error}</p>
          <button onClick={() => loadCerts(walletAddress)} className="text-xs text-red-400 underline mt-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (certs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">No certificates issued yet</p>
        <p className="text-gray-600 text-xs">Issue a certificate to see it here</p>
      </div>
    );
  }

  const active  = certs.filter((c) => !c.revoked);
  const revoked = certs.filter((c) => c.revoked);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        {[
          { label: "Total",   value: certs.length,  color: "text-white" },
          { label: "Active",  value: active.length,  color: "text-emerald-400" },
          { label: "Revoked", value: revoked.length, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="px-5 py-3 rounded-xl bg-white/8 border border-white/15 text-center min-w-[80px]">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">{s.label}</p>
          </div>
        ))}
        <button
          onClick={() => loadCerts(walletAddress)}
          className="ml-auto px-4 py-2 rounded-xl bg-white/5 border border-white/15
                     text-gray-400 text-xs hover:text-white hover:bg-white/10
                     transition-all flex items-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certs.map((cert) => (
          <InstituteCertificateCard
            key={cert.id.toString()}
            cert={cert}
            onRevoke={handleRevoke}
            revoking={revoking === cert.id.toString()}
          />
        ))}
      </div>
    </div>
  );
}