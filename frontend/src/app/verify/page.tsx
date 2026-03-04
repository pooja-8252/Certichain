"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ethers } from "ethers";
import QRScanner from "@/components/QRScanner";

interface Cert {
  id: bigint;
  ipfsHash: string;
  student: string;
  institute: string;
  approved: boolean;
  revoked: boolean;
}

type OwnershipStatus = "idle" | "verifying" | "verified" | "failed";

const CERTIFICATE_ABI = [
  "function getCertificate(uint256 certId) external view returns (tuple(uint256 id, string ipfsHash, address student, address institute, bool approved, bool revoked))",
];

async function fetchCertificate(id: number): Promise<Cert> {
  const provider = new ethers.JsonRpcProvider(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ||
    "https://ethereum-sepolia-rpc.publicnode.com"
  );
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CERTIFICATE_ADDRESS!,
    CERTIFICATE_ABI,
    provider
  );
  const result = await contract.getCertificate(BigInt(id));
  return {
    id:        result.id,
    ipfsHash:  result.ipfsHash,
    student:   result.student,
    institute: result.institute,
    approved:  result.approved,
    revoked:   result.revoked,
  };
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const [certId, setCertId] = useState("");
  const [data, setData] = useState<Cert | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  // ── Ownership proof state ─────────────────────────────────────────────────
  const [ownershipStatus, setOwnershipStatus] = useState<OwnershipStatus>("idle");
  const [ownershipError, setOwnershipError] = useState("");
  const [provenAddress, setProvenAddress] = useState("");

  // Reset ownership when cert changes
  useEffect(() => {
    setOwnershipStatus("idle");
    setOwnershipError("");
    setProvenAddress("");
  }, [data]);

  useEffect(() => {
    const paramId = searchParams.get("certId");
    if (paramId) {
      setCertId(paramId);
      autoVerify(paramId);
    }
  }, []);

  async function autoVerify(id: string) {
    const num = Number(id.trim());
    if (isNaN(num) || num <= 0) return;
    setLoading(true);
    setError("");
    setData(null);
    try {
      const cert = await fetchCertificate(num);
      if (!cert || cert.id === 0n) { setError("Certificate not found on blockchain."); return; }
      setData(cert);
    } catch (err: any) {
      setError(err?.reason || err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  async function verify() {
    setError("");
    setData(null);
    if (!certId.trim()) { setError("Please enter a certificate ID."); return; }
    const id = Number(certId.trim());
    if (isNaN(id) || id <= 0) { setError("Certificate ID must be a positive number."); return; }
    setLoading(true);
    try {
      const cert = await fetchCertificate(id);
      if (!cert || cert.id === 0n) { setError("Certificate not found on blockchain."); return; }
      setData(cert);
    } catch (err: any) {
      setError(err?.reason || err?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  // ── Proof of ownership ────────────────────────────────────────────────────
  async function proveOwnership() {
    if (!data) return;
    setOwnershipStatus("verifying");
    setOwnershipError("");
    try {
      if (!window.ethereum) throw new Error("MetaMask is required to prove ownership.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const connectedAddress = await signer.getAddress();

      // Must match the student address on the certificate
      if (connectedAddress.toLowerCase() !== data.student.toLowerCase()) {
        setOwnershipStatus("failed");
        setOwnershipError(
          `Connected wallet (${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}) does not match the certificate's student address.`
        );
        return;
      }

      // Sign a unique message — proves they hold the private key
      const message = `I am proving ownership of certificate #${data.id.toString()} on E-Certify.\n\nCertificate ID: ${data.id.toString()}\nMy wallet: ${connectedAddress}\nTimestamp: ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      // Recover signer from signature and cross-check
      const recovered = ethers.verifyMessage(message, signature);
      if (recovered.toLowerCase() !== data.student.toLowerCase()) {
        setOwnershipStatus("failed");
        setOwnershipError("Signature verification failed.");
        return;
      }

      setProvenAddress(connectedAddress);
      setOwnershipStatus("verified");
    } catch (err: any) {
      if (err?.code === 4001) {
        setOwnershipStatus("idle"); // user rejected — just reset silently
      } else {
        setOwnershipStatus("failed");
        setOwnershipError(err?.message || "Ownership verification failed.");
      }
    }
  }

  const status = data
    ? data.revoked
      ? { label: "Revoked",  color: "text-red-400",     ring: "border-red-500/30",     glow: "shadow-red-500/10",     bg: "from-red-500/10 to-transparent",     dot: "bg-red-400"     }
      : data.approved
      ? { label: "Valid",    color: "text-emerald-400", ring: "border-emerald-500/30", glow: "shadow-emerald-500/10", bg: "from-emerald-500/10 to-transparent", dot: "bg-emerald-400" }
      : { label: "Pending",  color: "text-amber-400",   ring: "border-amber-500/30",   glow: "shadow-amber-500/10",   bg: "from-amber-500/10 to-transparent",   dot: "bg-amber-400"   }
    : null;

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16">

      {/* Page header */}
      <div className="text-center mb-12">
        <p className="text-[25px] font-mono tracking-[0.45em] text-cyan-400 uppercase mb-3">
          Sepolia Blockchain
        </p>
        <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent mb-4">
          Certificate Verification
        </h1>
        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          Enter a certificate ID or scan a QR code to verify its authenticity on-chain.
          Results are fetched directly from the blockchain — tamper-proof and instant.
        </p>
      </div>

      {/* Main card */}
      <div className="w-full max-w-lg">
        <div className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl p-8 shadow-2xl shadow-black/40 space-y-6">

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-200 block">Certificate ID</label>
            <div className="relative">
              <input
                type="number"
                value={certId}
                onChange={(e) => { setCertId(e.target.value); setError(""); setData(null); }}
                onKeyDown={(e) => e.key === "Enter" && verify()}
                placeholder="e.g. 1"
                min="1"
                className="w-full px-4 py-4 rounded-xl bg-[#111827] border border-white/20
                           text-white placeholder-gray-600 text-sm font-mono
                           focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30
                           transition-all pr-12"
              />
              {certId && (
                <button
                  onClick={() => { setCertId(""); setData(null); setError(""); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Certificate IDs are assigned sequentially starting from 1 · No wallet required
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={verify}
              disabled={loading || !certId}
              className={`
                flex-1 h-12 rounded-xl text-sm font-bold transition-all duration-200
                flex items-center justify-center gap-2
                ${loading || !certId
                  ? "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-cyan-400 hover:-translate-y-[1px]"
                }
              `}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Verify Certificate
                </>
              )}
            </button>

            <button
              onClick={() => setShowScanner(!showScanner)}
              className={`
                px-4 h-12 rounded-xl border text-sm font-medium transition-all duration-200
                flex items-center gap-2
                ${showScanner
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-white/5 border-white/15 text-gray-400 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 18.75h.75v.75h-.75v-.75zM18.75 13.5h.75v.75h-.75v-.75zM18.75 18.75h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
              </svg>
              {showScanner ? "Close" : "QR"}
            </button>
          </div>

          {showScanner && (
            <div className="rounded-2xl overflow-hidden border border-white/15">
              <QRScanner
                onScan={(decodedText) => {
                  const extracted = decodedText.includes("/verify?certId=")
                    ? decodedText.split("/verify?certId=")[1]
                    : decodedText;
                  setCertId(extracted);
                  setShowScanner(false);
                  autoVerify(extracted);
                }}
              />
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25">
              <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Result card */}
        {data && status && (
          <div className={`mt-4 rounded-3xl border ${status.ring} bg-gradient-to-b ${status.bg} backdrop-blur-xl p-8 shadow-xl ${status.glow} space-y-6`}>

            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl border ${status.ring} flex items-center justify-center shrink-0`}>
                {data.revoked ? (
                  <svg className="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : data.approved ? (
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${status.dot} ${data.approved && !data.revoked ? "animate-pulse" : ""}`} />
                  <p className={`font-bold text-base ${status.color}`}>
                    {data.revoked ? "Certificate Revoked" : data.approved ? "Certificate Valid" : "Pending Approval"}
                  </p>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {data.revoked
                    ? "This certificate has been revoked and is no longer valid."
                    : data.approved
                    ? "This certificate is authentic and verified on the Sepolia blockchain."
                    : "This certificate has been requested but is awaiting institute approval."
                  }
                </p>
              </div>
            </div>

            <div className="h-px bg-white/8" />

            <div className="space-y-4">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">Certificate Details</p>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Certificate ID</p>
                  <p className="text-white font-bold text-lg">#{data.id.toString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-sm font-semibold ${status.color}`}>{status.label}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Network</p>
                  <p className="text-sm font-semibold text-purple-400">Sepolia Testnet</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Student Address</p>
                <p className="text-sm font-mono text-gray-300 break-all">{data.student}</p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">Institute Address</p>
                <p className="text-sm font-mono text-gray-300 break-all">
                  {data.institute === "0x0000000000000000000000000000000000000000"
                    ? "Not yet assigned"
                    : data.institute}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5">IPFS Document</p>
                <a
                  href={`https://ipfs.io/ipfs/${data.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                  </svg>
                  <span className="text-sm font-mono truncate group-hover:underline underline-offset-2">
                    {data.ipfsHash.slice(0, 24)}…{data.ipfsHash.slice(-8)}
                  </span>
                </a>
              </div>
            </div>

            {/* ── Proof of Ownership — only for valid approved certs ── */}
            {data.approved && !data.revoked && (
              <>
                <div className="h-px bg-white/8" />
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em] mb-1">
                      Proof of Ownership
                    </p>
                    <p className="text-xs text-gray-500">
                      Certificate holder can cryptographically prove they own this certificate by signing with their wallet. Nobody can fake this.
                    </p>
                  </div>

                  {ownershipStatus === "idle" && (
                    <button
                      onClick={proveOwnership}
                      className="w-full flex items-center justify-center gap-2 h-11 rounded-xl
                                 bg-white/5 border border-white/10 text-gray-300 text-sm
                                 hover:bg-cyan-500/10 hover:border-cyan-500/30 hover:text-cyan-400
                                 transition-all duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                          d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                      </svg>
                      Prove Ownership with MetaMask
                    </button>
                  )}

                  {ownershipStatus === "verifying" && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                      <div className="w-4 h-4 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin shrink-0" />
                      <p className="text-cyan-400 text-sm">Waiting for signature in MetaMask...</p>
                    </div>
                  )}

                  {ownershipStatus === "verified" && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-emerald-400 text-sm font-semibold">Ownership Verified ✓</p>
                        <p className="text-emerald-400/60 text-xs font-mono mt-0.5">
                          {provenAddress.slice(0, 6)}...{provenAddress.slice(-4)} cryptographically proven
                        </p>
                      </div>
                    </div>
                  )}

                  {ownershipStatus === "failed" && (
                    <div className="space-y-2">
                      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25">
                        <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <div>
                          <p className="text-red-400 text-sm font-semibold">Ownership Not Proven</p>
                          <p className="text-red-400/70 text-xs mt-0.5">{ownershipError}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { setOwnershipStatus("idle"); setOwnershipError(""); }}
                        className="w-full h-8 rounded-lg bg-white/5 border border-white/10 text-gray-400 text-xs hover:bg-white/10 transition-all"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <p className="mt-8 text-gray-600 text-xs text-center">
        Data sourced directly from Sepolia Testnet · No wallet required to verify · No intermediaries
      </p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/6 blur-[120px] rounded-full pointer-events-none" />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}