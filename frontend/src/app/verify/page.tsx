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

  const [ownershipStatus, setOwnershipStatus] = useState<OwnershipStatus>("idle");
  const [ownershipError, setOwnershipError] = useState("");
  const [provenAddress, setProvenAddress] = useState("");

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
      if (connectedAddress.toLowerCase() !== data.student.toLowerCase()) {
        setOwnershipStatus("failed");
        setOwnershipError(
          `Connected wallet (${connectedAddress.slice(0, 6)}...${connectedAddress.slice(-4)}) does not match the certificate's student address.`
        );
        return;
      }
      const message = `I am proving ownership of certificate #${data.id.toString()} on E-Certify.\n\nCertificate ID: ${data.id.toString()}\nMy wallet: ${connectedAddress}\nTimestamp: ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);
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
        setOwnershipStatus("idle");
      } else {
        setOwnershipStatus("failed");
        setOwnershipError(err?.message || "Ownership verification failed.");
      }
    }
  }

  const status = data
    ? data.revoked
      ? { label: "Revoked",  textColor: "#dc2626", borderColor: "rgba(220,38,38,0.25)",   bgFrom: "rgba(220,38,38,0.06)",   dotColor: "#dc2626" }
      : data.approved
      ? { label: "Valid",    textColor: "#16a34a", borderColor: "rgba(22,163,74,0.25)",    bgFrom: "rgba(22,163,74,0.06)",   dotColor: "#16a34a" }
      : { label: "Pending",  textColor: "#d97706", borderColor: "rgba(217,119,6,0.25)",    bgFrom: "rgba(217,119,6,0.06)",   dotColor: "#d97706" }
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .font-playfair { font-family: 'Playfair Display', Georgia, serif; }
        .font-outfit   { font-family: 'Outfit', sans-serif; }

        .verify-input {
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(184,137,58,0.2);
          color: #1e1a14;
          font-family: 'Outfit', sans-serif;
          transition: all 0.2s ease;
          outline: none;
        }
        .verify-input::placeholder { color: #c9b99a; }
        .verify-input:focus {
          border-color: rgba(184,137,58,0.5);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 0 3px rgba(184,137,58,0.1);
        }

        .btn-verify {
          background: linear-gradient(135deg, #c9a24a 0%, #b8893a 100%);
          box-shadow: 0 4px 20px rgba(184,137,58,0.3);
          color: #fff;
          transition: all 0.3s ease;
        }
        .btn-verify:hover:not(:disabled) {
          box-shadow: 0 6px 28px rgba(184,137,58,0.45);
          transform: translateY(-1px);
        }
        .btn-verify:disabled { opacity: 0.45; cursor: not-allowed; }

        .btn-qr {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(184,137,58,0.2);
          color: #7a6d5e;
          transition: all 0.2s ease;
        }
        .btn-qr:hover { background: rgba(255,255,255,0.9); border-color: rgba(184,137,58,0.4); color: #1e1a14; }
        .btn-qr.active { background: rgba(184,137,58,0.1); border-color: rgba(184,137,58,0.35); color: #b8893a; }

        .main-card {
          background: rgba(255,255,255,0.55);
          border: 1px solid rgba(184,137,58,0.15);
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 48px rgba(120,90,40,0.08);
        }

        .detail-cell {
          background: rgba(255,255,255,0.6);
          border: 1px solid rgba(184,137,58,0.12);
          transition: background 0.2s ease;
        }
        .detail-cell:hover { background: rgba(255,255,255,0.9); }

        .result-card {
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 40px rgba(120,90,40,0.07);
        }

        .g-pulse { position: relative; }
        .g-pulse::before, .g-pulse::after {
          content: ''; position: absolute; inset: 0; border-radius: 50%;
        }
        .g-pulse::before { background: #b8893a; }
        .g-pulse::after {
          background: rgba(184,137,58,0.3);
          animation: rpl 2s ease-out infinite;
        }
        @keyframes rpl {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(2.8); opacity: 0; }
        }

        .divider-gold { background: rgba(184,137,58,0.15); }

        .ownership-btn {
          background: rgba(255,255,255,0.5);
          border: 1px solid rgba(184,137,58,0.2);
          color: #7a6d5e;
          transition: all 0.25s ease;
        }
        .ownership-btn:hover {
          background: rgba(184,137,58,0.08);
          border-color: rgba(184,137,58,0.4);
          color: #b8893a;
        }
      `}</style>

      <div className="font-outfit min-h-screen flex flex-col items-center justify-start px-5 py-16">

        {/* ── Page Header ── */}
        <div className="text-center mb-12 max-w-lg">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border mb-6"
            style={{ borderColor: "rgba(184,137,58,0.25)", background: "rgba(184,137,58,0.07)" }}>
            <div className="g-pulse w-1.5 h-1.5" />
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase" style={{ color: "#b8893a" }}>
              Sepolia Blockchain
            </span>
          </div>

          <h1 className="font-playfair font-normal leading-[1.08] mb-4" style={{ fontSize: "clamp(2.2rem,5vw,3.2rem)", color: "#1e1a14" }}>
            Certificate{" "}
            <em className="font-playfair italic" style={{ color: "#b8893a" }}>Verification</em>
          </h1>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #b8893a 60%)" }} />
            <span style={{ color: "#b8893a", fontSize: 12 }}>◆</span>
            <div className="h-px w-14" style={{ background: "linear-gradient(270deg, transparent, #b8893a 60%)" }} />
          </div>

          <p className="text-[13.5px] font-light leading-relaxed" style={{ color: "#6b5f4e" }}>
            Enter a certificate ID or scan a QR code to verify authenticity on-chain.
            Results are fetched directly from the blockchain — tamper-proof and instant.
          </p>
        </div>

        {/* ── Main card ── */}
        <div className="w-full max-w-lg">
          <div className="main-card rounded-2xl p-7 space-y-5">

            {/* Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] tracking-[0.16em] uppercase font-medium block" style={{ color: "#7a6d5e" }}>
                Certificate ID
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={certId}
                  onChange={(e) => { setCertId(e.target.value); setError(""); setData(null); }}
                  onKeyDown={(e) => e.key === "Enter" && verify()}
                  placeholder="e.g. 1"
                  min="1"
                  className="verify-input w-full px-4 py-3.5 rounded-xl text-sm pr-10"
                />
                {certId && (
                  <button
                    onClick={() => { setCertId(""); setData(null); setError(""); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: "#c9b99a" }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              <p className="text-[11px] font-light" style={{ color: "#b5a795" }}>
                IDs are assigned sequentially from 1 · No wallet required
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={verify}
                disabled={loading || !certId}
                className="btn-verify flex-1 h-11 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
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
                className={`btn-qr px-4 h-11 rounded-xl text-sm font-medium flex items-center gap-2 ${showScanner ? "active" : ""}`}
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

            {/* QR Scanner */}
            {showScanner && (
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "rgba(184,137,58,0.2)" }}>
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

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#dc2626" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm" style={{ color: "#dc2626" }}>{error}</p>
              </div>
            )}
          </div>

          {/* ── Result card ── */}
          {data && status && (
            <div
              className="result-card mt-4 rounded-2xl p-7 space-y-5"
              style={{
                background: `linear-gradient(160deg, ${status.bgFrom} 0%, rgba(255,255,255,0.5) 60%)`,
                border: `1px solid ${status.borderColor}`,
              }}
            >
              {/* Status header */}
              <div className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: status.bgFrom, border: `1px solid ${status.borderColor}` }}
                >
                  {data.revoked ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: status.textColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : data.approved ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: status.textColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: status.textColor }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: status.dotColor,
                        animation: data.approved && !data.revoked ? "rpl 2s ease-out infinite" : "none",
                      }}
                    />
                    <p className="font-playfair font-semibold text-[15px]" style={{ color: status.textColor }}>
                      {data.revoked ? "Certificate Revoked" : data.approved ? "Certificate Valid" : "Pending Approval"}
                    </p>
                  </div>
                  <p className="text-[12px] font-light" style={{ color: "#7a6d5e" }}>
                    {data.revoked
                      ? "This certificate has been revoked and is no longer valid."
                      : data.approved
                      ? "Authentic and verified on the Sepolia blockchain."
                      : "Requested but awaiting institute approval."
                    }
                  </p>
                </div>
              </div>

              <div className="divider-gold h-px w-full" />

              {/* Details */}
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-3" style={{ color: "#b5a795" }}>
                  Certificate Details
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <div className="detail-cell col-span-2 p-3 rounded-xl">
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "#b5a795" }}>Certificate ID</p>
                    <p className="font-playfair font-bold text-xl" style={{ color: "#1e1a14" }}>#{data.id.toString()}</p>
                  </div>

                  <div className="detail-cell p-3 rounded-xl">
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "#b5a795" }}>Status</p>
                    <p className="text-sm font-semibold" style={{ color: status.textColor }}>{status.label}</p>
                  </div>

                  <div className="detail-cell p-3 rounded-xl">
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: "#b5a795" }}>Network</p>
                    <p className="text-sm font-medium" style={{ color: "#b8893a" }}>Sepolia Testnet</p>
                  </div>

                  <div className="detail-cell col-span-2 p-3 rounded-xl">
                    <p className="text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#b5a795" }}>Student Address</p>
                    <p className="text-xs font-mono break-all" style={{ color: "#4a3f30" }}>{data.student}</p>
                  </div>

                  <div className="detail-cell col-span-2 p-3 rounded-xl">
                    <p className="text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#b5a795" }}>Institute Address</p>
                    <p className="text-xs font-mono break-all" style={{ color: "#4a3f30" }}>
                      {data.institute === "0x0000000000000000000000000000000000000000"
                        ? "Not yet assigned"
                        : data.institute}
                    </p>
                  </div>

                  <div className="detail-cell col-span-2 p-3 rounded-xl">
                    <p className="text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#b5a795" }}>IPFS Document</p>
                    <a
                      href={`https://ipfs.io/ipfs/${data.ipfsHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 group"
                      style={{ color: "#b8893a" }}
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                      </svg>
                      <span className="text-xs font-mono group-hover:underline underline-offset-2">
                        {data.ipfsHash.slice(0, 24)}…{data.ipfsHash.slice(-8)}
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Proof of Ownership */}
              {data.approved && !data.revoked && (
                <>
                  <div className="divider-gold h-px w-full" />
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] tracking-[0.2em] uppercase font-medium mb-1" style={{ color: "#b5a795" }}>
                        Proof of Ownership
                      </p>
                      <p className="text-[12px] font-light" style={{ color: "#7a6d5e" }}>
                        Certificate holder can cryptographically prove ownership by signing with their wallet.
                      </p>
                    </div>

                    {ownershipStatus === "idle" && (
                      <button
                        onClick={proveOwnership}
                        className="ownership-btn w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                        </svg>
                        Prove Ownership with MetaMask
                      </button>
                    )}

                    {ownershipStatus === "verifying" && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "rgba(184,137,58,0.07)", border: "1px solid rgba(184,137,58,0.2)" }}>
                        <div className="w-4 h-4 border-2 rounded-full animate-spin shrink-0"
                          style={{ borderColor: "rgba(184,137,58,0.3)", borderTopColor: "#b8893a" }} />
                        <p className="text-sm" style={{ color: "#b8893a" }}>Waiting for signature in MetaMask...</p>
                      </div>
                    )}

                    {ownershipStatus === "verified" && (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: "rgba(22,163,74,0.07)", border: "1px solid rgba(22,163,74,0.2)" }}>
                        <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#16a34a" }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: "#16a34a" }}>Ownership Verified ✓</p>
                          <p className="text-xs font-mono mt-0.5" style={{ color: "rgba(22,163,74,0.7)" }}>
                            {provenAddress.slice(0, 6)}...{provenAddress.slice(-4)} cryptographically proven
                          </p>
                        </div>
                      </div>
                    )}

                    {ownershipStatus === "failed" && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
                          style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)" }}>
                          <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#dc2626" }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: "#dc2626" }}>Ownership Not Proven</p>
                            <p className="text-xs mt-0.5" style={{ color: "rgba(220,38,38,0.7)" }}>{ownershipError}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => { setOwnershipStatus("idle"); setOwnershipError(""); }}
                          className="ownership-btn w-full h-9 rounded-xl text-xs font-medium"
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

        <p className="mt-8 text-[11px] tracking-wide text-center font-light" style={{ color: "#b5a795" }}>
          Data sourced from Sepolia Testnet · No wallet required to verify · No intermediaries
        </p>
      </div>
    </>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#f9f5ef" }}>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-5 h-5 border-2 rounded-full animate-spin"
            style={{ borderColor: "rgba(184,137,58,0.3)", borderTopColor: "#b8893a" }} />
        </div>
      }>
        <VerifyContent />
      </Suspense>
    </div>
  );
}