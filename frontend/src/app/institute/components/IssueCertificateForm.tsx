"use client";

import { useState, useRef } from "react";
import { getCertificateContract } from "@/lib/contracts";

type Stage = "idle" | "uploading" | "submitting" | "confirming" | "done" | "error";

interface Props {
  walletConnected: boolean;
  onConnectWallet: () => void;
}

export default function IssueCertificateForm({ walletConnected, onConnectWallet }: Props) {
  const [studentAddress, setStudentAddress] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

  async function uploadToIPFS(f: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("IPFS upload failed. Is your backend running?");
    const data = await res.json();
    return data.IpfsHash;
  }

  async function handleSubmit() {
    if (!file || !studentAddress || !walletConnected) return;
    setErrorMsg("");
    setTxHash("");
    setIpfsHash("");

    try {
      setStage("uploading");
      const hash = await uploadToIPFS(file);
      setIpfsHash(hash);

      setStage("submitting");
      const contract = await getCertificateContract();

      try {
        await contract.issueCertificate.staticCall(studentAddress, hash);
      } catch (staticErr: any) {
        throw new Error(
          staticErr?.reason || staticErr?.error?.message || staticErr?.message ||
          "Contract will revert — check the student address is registered on-chain"
        );
      }

      const tx = await contract.issueCertificate(studentAddress, hash);
      setTxHash(tx.hash);

      setStage("confirming");
      await tx.wait();
      setStage("done");
    } catch (err: any) {
      setErrorMsg(err?.reason || err?.error?.data?.message || err?.message || "Unknown error");
      setStage("error");
    }
  }

  function reset() {
    setStage("idle");
    setFile(null);
    setStudentAddress("");
    setErrorMsg("");
    setTxHash("");
    setIpfsHash("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }

  const isLoading = ["uploading", "submitting", "confirming"].includes(stage);

  const progressStep =
    stage === "uploading"  ? 1 :
    stage === "submitting" ? 2 :
    stage === "confirming" ? 3 :
    stage === "done"       ? 4 : 0;

  // ── Wallet not connected ──────────────────────────────────────────────────
  if (!walletConnected) {
    return (
      <div className="max-w-2xl">
        <div className="rounded-3xl border border-white/20 bg-white/5 p-14
                        flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30
                          flex items-center justify-center">
            <svg className="w-8 h-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0V4.5" />
            </svg>
          </div>
          <div>
            <p className="text-white font-semibold text-lg mb-1">Wallet Required</p>
            <p className="text-gray-400 text-sm">
              Connect your MetaMask wallet to issue certificates on-chain.
            </p>
          </div>
          <button
            onClick={onConnectWallet}
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500
                       text-white font-semibold text-sm shadow-lg shadow-cyan-500/25
                       hover:from-cyan-400 hover:to-blue-400 transition-all"
          >
            Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  return (
     <div className="max-w-xl mx-auto space-y-5">
      {/* Progress steps */}
      {isLoading && (
        <div className="flex items-center gap-3 px-5 py-4 rounded-2xl
                        bg-cyan-500/8 border border-cyan-500/20">
          {["Upload to IPFS", "Submit TX", "Confirm"].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                transition-all duration-300
                ${progressStep > i
                  ? "bg-cyan-500 text-white"
                  : progressStep === i + 1
                  ? "bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 animate-pulse"
                  : "bg-white/10 border border-white/20 text-gray-500"
                }
              `}>
                {progressStep > i ? "✓" : i + 1}
              </div>
              <span className={`text-sm font-medium ${progressStep >= i + 1 ? "text-white" : "text-gray-500"}`}>
                {label}
              </span>
              {i < 2 && (
                <div className={`w-8 h-0.5 rounded mx-1 ${progressStep > i + 1 ? "bg-cyan-500" : "bg-white/15"}`} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main form card */}
      <div className="rounded-3xl border border-white/20 bg-white/5 p-8 space-y-6
                      shadow-xl shadow-black/30">

        {/* Success */}
        {stage === "done" && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/25 border border-emerald-500/40
                              flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-emerald-300 font-bold text-base">Certificate Issued Successfully!</p>
            </div>
            {txHash && (
              <div className="bg-black/20 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Transaction Hash</p>
                <p className="text-xs font-mono text-gray-300 break-all">{txHash}</p>
              </div>
            )}
            {ipfsHash && (
              <div className="bg-black/20 rounded-xl p-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">IPFS Document</p>
                <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 break-all transition-colors">
                  {ipfsHash}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {stage === "error" && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex gap-3">
            <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <div>
              <p className="text-red-300 text-sm font-semibold mb-1">Transaction Failed</p>
              <p className="text-red-400/80 text-xs leading-relaxed">{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Student address */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200">
            Student Wallet Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3.5 rounded-xl
                       bg-[#111827] border border-white/25
                       text-white placeholder-gray-500 text-sm font-mono
                       focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30
                       disabled:opacity-50 transition-all"
          />
          <p className="text-xs text-gray-500">Must be a registered student address on-chain</p>
        </div>

        {/* File upload */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-200">
            Certificate PDF
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileRef.current?.click()}
            className={`
              cursor-pointer rounded-2xl border-2 border-dashed p-10
              flex flex-col items-center justify-center gap-3
              transition-all duration-200
              ${dragOver
                ? "border-cyan-400 bg-cyan-500/10"
                : file
                ? "border-emerald-400/60 bg-emerald-500/8"
                : "border-white/25 bg-[#111827] hover:border-cyan-400/60 hover:bg-cyan-500/5"
              }
              ${isLoading ? "opacity-40 pointer-events-none" : ""}
            `}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)} />

            {file ? (
              <>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40
                                flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">{file.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{(file.size / 1024).toFixed(1)} KB · Click to change</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-white/8 border border-white/15
                                flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 font-medium text-sm">Drop PDF here or click to browse</p>
                  <p className="text-gray-500 text-xs mt-1">PDF files only</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit */}
        {stage === "done" ? (
          <button onClick={reset}
            className="w-full h-12 rounded-xl bg-white/8 border border-white/20
                       text-gray-300 text-sm font-semibold hover:bg-white/12 transition-all">
            Issue Another Certificate
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!file || !studentAddress || isLoading}
            className={`
              w-full h-12 rounded-xl text-sm font-bold transition-all duration-200
              flex items-center justify-center gap-2
              ${!file || !studentAddress || isLoading
                ? "bg-white/8 border border-white/15 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-400"
              }
            `}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {stage === "idle"       ? "Issue Certificate"
            : stage === "uploading"  ? "Uploading to IPFS…"
            : stage === "submitting" ? "Sending Transaction…"
            : stage === "confirming" ? "Confirming on Chain…"
            : stage === "error"      ? "Try Again"
            : "Issue Certificate"}
          </button>
        )}
      </div>
    </div>
  );
}