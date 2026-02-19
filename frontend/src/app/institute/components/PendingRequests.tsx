"use client";

import { useEffect, useState } from "react";
import { getCertificateContract } from "@/lib/contracts";

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
}

function isValidAddress(addr: string): boolean {
  return typeof addr === "string" && addr.startsWith("0x") && addr.length === 42;
}

export default function PendingRequests({ walletAddress, walletConnected }: Props) {
  const [pending, setPending] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [approving, setApproving] = useState<string | null>(null);

  async function loadPending() {
    if (!isValidAddress(walletAddress)) return;
    setLoading(true);
    setError("");

    try {
      const contract = await getCertificateContract();

      // Get total cert count
      const count: bigint = await contract.getCertCount();
      const total = Number(count);

      if (total === 0) {
        setPending([]);
        return;
      }

      // Scan all certs and find unapproved ones
      const allCerts: Cert[] = await Promise.all(
        Array.from({ length: total }, (_, i) => BigInt(i + 1)).map(async (id) => {
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

      // Only show unapproved, unrevoked certs
      const unapproved = allCerts.filter((c) => !c.approved && !c.revoked);
      setPending(unapproved.reverse());
    } catch (err: any) {
      console.error("loadPending error:", err);
      setError(err?.message || "Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(certId: bigint) {
    setApproving(certId.toString());
    try {
      const contract = await getCertificateContract();
      await contract.approveCertificate.staticCall(certId);
      const tx = await contract.approveCertificate(certId);
      await tx.wait();
      await loadPending();
    } catch (err: any) {
      alert(err?.reason || err?.error?.data?.message || err?.message || "Approve failed");
    } finally {
      setApproving(null);
    }
  }

  useEffect(() => {
    if (walletConnected && isValidAddress(walletAddress)) loadPending();
  }, [walletConnected, walletAddress]);

  if (!walletConnected || !isValidAddress(walletAddress)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0V4.5" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">Connect your wallet to view pending requests</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-mono">Scanning for pending requests…</p>
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
          <p className="text-red-400/70 text-xs mt-1">{error}</p>
          <button onClick={loadPending} className="text-xs text-red-400 underline mt-2">Retry</button>
        </div>
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center">
          <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-400 text-sm">No pending requests</p>
        <p className="text-gray-600 text-xs">All student requests have been processed</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
            <p className="text-xl font-bold text-amber-400">{pending.length}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Pending</p>
          </div>
        </div>
        <button onClick={loadPending}
          className="px-4 py-2 rounded-xl bg-white/5 border border-white/15
                     text-gray-400 text-xs hover:text-white hover:bg-white/10
                     transition-all flex items-center gap-2">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Pending cert cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pending.map((cert) => {
          const shortStudent = `${cert.student.slice(0, 6)}…${cert.student.slice(-4)}`;
          const ipfsUrl = `https://ipfs.io/ipfs/${cert.ipfsHash}`;
          const isApproving = approving === cert.id.toString();

          return (
            <div key={cert.id.toString()}
              className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-4
                         hover:border-amber-500/40 transition-all duration-200">

              {/* Top row */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-gray-500">Cert #{cert.id.toString()}</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full
                                bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Pending Approval
                </div>
              </div>

              {/* Student */}
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Student</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30
                                  border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
                  </div>
                  <p className="text-sm font-mono text-gray-300">{shortStudent}</p>
                  <button onClick={() => navigator.clipboard.writeText(cert.student)}
                    className="text-gray-600 hover:text-gray-300 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* IPFS */}
              <div className="space-y-1">
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Document</p>
                <a href={ipfsUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs font-mono text-cyan-400/70
                             hover:text-cyan-400 transition-colors group">
                  <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span className="truncate max-w-[180px] group-hover:underline">
                    {cert.ipfsHash.slice(0, 18)}…{cert.ipfsHash.slice(-6)}
                  </span>
                </a>
              </div>

              {/* Approve button */}
              <div className="pt-2 border-t border-white/5">
                <button
                  onClick={() => handleApprove(cert.id)}
                  disabled={!!approving}
                  className="w-full h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500
                             text-white text-sm font-semibold shadow-lg shadow-emerald-500/20
                             hover:from-emerald-400 hover:to-teal-400 transition-all
                             disabled:opacity-40 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2"
                >
                  {isApproving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Approving…
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve Certificate
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}