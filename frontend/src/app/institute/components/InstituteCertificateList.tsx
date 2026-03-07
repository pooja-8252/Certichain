"use client";

import { useEffect, useState } from "react";
import { getCertificateContract } from "@/lib/contracts";
import InstituteCertificateCard from "./InstituteCertificateCard";
import { Wallet, RefreshCw, AlertCircle, ScrollText, Loader2 } from "lucide-react";

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
  onCountLoaded?: (count: number) => void;
}

function isValidAddress(addr: string): boolean {
  return typeof addr === "string" && addr.startsWith("0x") && addr.length === 42;
}

export default function InstituteCertificateList({ walletAddress, walletConnected, onCountLoaded }: Props) {
  const [certs, setCerts] = useState<Cert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revoking, setRevoking] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "revoked">("all");

  const gold = "#b8893a";

  async function loadCerts(addr: string) {
    if (!isValidAddress(addr)) return;
    setLoading(true);
    setError("");
    try {
      const contract = await getCertificateContract();
      const ids: bigint[] = await contract.getInstituteCertificates(addr);
      const loaded: Cert[] = await Promise.all(
        ids.map(async (id) => {
          const c = await contract.getCertificate(id);
          return { id: c.id, ipfsHash: c.ipfsHash, student: c.student, institute: c.institute, approved: c.approved, revoked: c.revoked };
        })
      );
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
    if (walletConnected && isValidAddress(walletAddress)) loadCerts(walletAddress);
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

  /* ── Not connected ── */
  if (!walletConnected || !isValidAddress(walletAddress)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(184,137,58,0.08)", border: "1px solid rgba(184,137,58,0.18)" }}>
          <Wallet size={24} style={{ color: gold }} />
        </div>
        <p className="text-sm font-light" style={{ color: "#9a8a78" }}>Connect your wallet to view certificates</p>
      </div>
    );
  }

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-5">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 animate-spin"
            style={{ borderColor: "rgba(184,137,58,0.15)", borderTopColor: gold }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <ScrollText size={18} style={{ color: gold }} />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>Loading certificates</p>
          <p className="text-xs font-light mt-0.5" style={{ color: "#9a8a78" }}>Reading from blockchain…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <div className="rounded-2xl overflow-hidden max-w-2xl"
        style={{ border: "1px solid rgba(220,38,38,0.2)" }}>
        <div className="px-5 py-3 flex items-center gap-2"
          style={{ background: "rgba(220,38,38,0.07)", borderBottom: "1px solid rgba(220,38,38,0.15)" }}>
          <AlertCircle size={14} style={{ color: "#dc2626" }} />
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#dc2626" }}>Error</span>
        </div>
        <div className="px-5 py-4 space-y-3" style={{ background: "rgba(255,255,255,0.5)" }}>
          <p className="text-sm font-light leading-relaxed" style={{ color: "#7a6d5e" }}>{error}</p>
          <button onClick={() => loadCerts(walletAddress)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all hover:-translate-y-[1px]"
            style={{ background: "rgba(184,137,58,0.09)", border: "1px solid rgba(184,137,58,0.22)", color: gold }}>
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      </div>
    );
  }

  /* ── Empty ── */
  if (certs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
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
          <p className="text-base font-normal" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>No certificates issued yet</p>
          <p className="text-xs font-light mt-1" style={{ color: "#9a8a78" }}>Issue a certificate to see it here</p>
        </div>
      </div>
    );
  }

  const active  = certs.filter((c) => !c.revoked);
  const revoked = certs.filter((c) => c.revoked);

  const filtered = filter === "all" ? certs : filter === "active" ? active : revoked;

  const filters: { key: typeof filter; label: string; count: number; color: string; activeBg: string; activeBorder: string }[] = [
    { key: "all",     label: "All",     count: certs.length,   color: "#1e1a14", activeBg: "rgba(184,137,58,0.12)", activeBorder: "rgba(184,137,58,0.35)" },
    { key: "active",  label: "Active",  count: active.length,  color: "#16a34a", activeBg: "rgba(22,163,74,0.1)",   activeBorder: "rgba(22,163,74,0.3)"   },
    { key: "revoked", label: "Revoked", count: revoked.length, color: "#dc2626", activeBg: "rgba(220,38,38,0.08)",  activeBorder: "rgba(220,38,38,0.28)"  },
  ];

  return (
    <div className="space-y-6 max-w-4xl">

      {/* ── Filter bar + Refresh ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(184,137,58,0.14)" }}>
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              style={filter === f.key ? {
                background: f.activeBg, border: `1px solid ${f.activeBorder}`, color: f.color,
              } : {
                background: "transparent", border: "1px solid transparent", color: "#9a8a78",
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

        <button onClick={() => loadCerts(walletAddress)}
          className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all hover:-translate-y-[1px]"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.18)", color: gold }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {/* ── Empty filter result ── */}
      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm font-light" style={{ color: "#9a8a78" }}>No {filter} certificates.</p>
        </div>
      )}

      {/* ── Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((cert) => (
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