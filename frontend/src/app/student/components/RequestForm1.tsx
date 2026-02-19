"use client";

import { useState, useRef } from "react";
import { getCertificateContract } from "@/lib/contracts";

type Stage = "idle" | "uploading" | "submitting" | "confirming" | "done" | "error";

export default function RequestForm() {
  const [file, setFile]         = useState<File | null>(null);
  const [stage, setStage]       = useState<Stage>("idle");
  const [ipfsHash, setIpfsHash] = useState("");
  const [txHash, setTxHash]     = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const loading = ["uploading", "submitting", "confirming"].includes(stage);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "/api";

  async function uploadToIPFS(f: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch(`${BACKEND_URL}/upload`, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const data = await res.json();
    if (!data.IpfsHash) throw new Error("No IPFS hash returned from server");
    return data.IpfsHash;
  }

  async function requestCertificate() {
    if (!file) return;
    setErrorMsg(""); setIpfsHash(""); setTxHash("");
    try {
      setStage("uploading");
      const hash = await uploadToIPFS(file);
      setIpfsHash(hash);

      setStage("submitting");
      const contract = await getCertificateContract();
      const tx = await contract.requestCertificate(hash);
      setTxHash(tx.hash);

      setStage("confirming");
      await tx.wait();

      setStage("done");
      setFile(null);
    } catch (err: any) {
      if (err?.message?.includes("Wrong network")) {
        setErrorMsg("Please switch to Monad Testnet (Chain ID 10143).");
      } else if (err?.message?.includes("user rejected")) {
        setErrorMsg("Transaction rejected in MetaMask.");
      } else {
        setErrorMsg(err?.reason || err?.message || "Unexpected error occurred.");
      }
      setStage("error");
    }
  }

  function reset() {
    setStage("idle"); setFile(null);
    setIpfsHash(""); setTxHash(""); setErrorMsg("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped); setStage("idle"); setErrorMsg("");
    }
  }

  const steps: { key: Stage; label: string; sub: string }[] = [
    { key: "uploading",  label: "Uploading to IPFS",        sub: "Pinning document on Pinata"  },
    { key: "submitting", label: "Broadcasting transaction",  sub: "Sending to Monad Testnet"    },
    { key: "confirming", label: "Awaiting confirmation",     sub: "Waiting for block inclusion" },
    { key: "done",       label: "Request submitted",         sub: "Recorded on-chain ✓"         },
  ];

  const stageOrder  = steps.map((s) => s.key);
  const currentIdx  = stageOrder.indexOf(stage);
  const progressPct = stage === "uploading" ? 25 : stage === "submitting" ? 55 : stage === "confirming" ? 80 : stage === "done" ? 100 : 0;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Glow */}
      <div className="fixed -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[500px]
                      bg-indigo-500/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px]
                      bg-cyan-500/6 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg space-y-4">

          {/* Page heading */}
          <div className="mb-8 text-center">
  <p className="text-[25px] font-mono tracking-[0.3em] text-cyan-500 uppercase mb-2">
    Student Portal
  </p>
  <h2 className="text-4xl font-extrabold tracking-tight text-white">
    Request a Certificate
  </h2>
  <p className="text-gray-400 mt-2 text-sm">
    Upload your document to anchor it on-chain via IPFS
  </p>
</div>

          {/* Main card */}
          <div className="rounded-3xl border border-white/15 bg-white/5 p-8 shadow-2xl shadow-black/40 space-y-6">

            {/* Error */}
            {stage === "error" && errorMsg && (
              <div className="flex items-start gap-3 px-4 py-4 rounded-2xl
                              bg-red-500/10 border border-red-500/30">
                <svg className="w-5 h-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <div>
                  <p className="text-red-300 text-sm font-semibold mb-1">Request Failed</p>
                  <p className="text-red-400/80 text-xs font-mono leading-relaxed">{errorMsg}</p>
                </div>
              </div>
            )}

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
                  <p className="text-emerald-300 font-bold text-base">Request Submitted Successfully!</p>
                </div>
                {txHash && (
                  <div className="bg-black/20 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Transaction</p>
                    <a
                      href={`https://testnet-explorer.monad.xyz/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 break-all transition-colors"
                    >
                      {txHash}
                    </a>
                  </div>
                )}
                {ipfsHash && (
                  <div className="bg-black/20 rounded-xl p-3">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">IPFS Hash</p>
                    <p className="text-xs font-mono text-gray-300 break-all">{ipfsHash}</p>
                  </div>
                )}
              </div>
            )}

            {/* File upload */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-200">
                Certificate PDF
              </label>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !loading && fileRef.current?.click()}
                className={`
                  cursor-pointer rounded-2xl border-2 border-dashed p-10
                  flex flex-col items-center justify-center gap-3
                  transition-all duration-200
                  ${dragOver
                    ? "border-cyan-400 bg-cyan-500/10"
                    : file
                    ? "border-indigo-400/60 bg-indigo-500/8"
                    : "border-white/20 bg-[#111827] hover:border-indigo-400/60 hover:bg-indigo-500/5"
                  }
                  ${loading ? "opacity-40 pointer-events-none" : ""}
                `}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] || null);
                    setStage("idle");
                    setErrorMsg("");
                  }}
                />

                {file ? (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30
                                    border border-indigo-500/40 flex items-center justify-center">
                      <span className="text-indigo-300 font-bold text-sm">PDF</span>
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-sm">{file.name}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {(file.size / 1024).toFixed(1)} KB · Click to replace
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null); setStage("idle"); }}
                      className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/15
                                    flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            {/* Progress steps */}
            {stage !== "idle" && stage !== "error" && (
              <div className="space-y-4 pt-2">
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-white/8 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  {steps.map((s, idx) => {
                    const isActive   = stage === s.key;
                    const isComplete = currentIdx > idx || stage === "done";

                    return (
                      <div key={s.key} className="flex items-center gap-3">
                        <div className={`
                          w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0
                          transition-all duration-300
                          ${isComplete
                            ? "bg-emerald-500 border-emerald-500"
                            : isActive
                            ? "bg-indigo-500/20 border-indigo-400 animate-pulse"
                            : "bg-white/5 border-white/20"
                          }
                        `}>
                          {isComplete ? (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : isActive ? (
                            <div className="w-2 h-2 rounded-full bg-indigo-400" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                          )}
                        </div>
                        <div>
                          <p className={`text-sm font-medium transition-colors ${
                            isActive ? "text-white" : isComplete ? "text-gray-300" : "text-gray-600"
                          }`}>
                            {s.label}
                          </p>
                          <p className="text-xs text-gray-500 font-mono">{s.sub}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit button */}
            <button
              onClick={stage === "done" ? reset : requestCertificate}
              disabled={(!file && stage !== "done") || loading}
              className={`
                w-full h-13 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200
                flex items-center justify-center gap-2
                ${stage === "done"
                  ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg shadow-purple-500/25 hover:from-purple-400 hover:to-blue-400"
                  : (!file || loading)
                  ? "bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-cyan-400 hover:-translate-y-[1px]"
                }
              `}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              {loading
                ? "Processing…"
                : stage === "done"
                ? "Submit Another Request"
                : "Submit Request"
              }
            </button>

            {!file && stage === "idle" && (
              <p className="text-center text-gray-600 text-xs">
                Upload a PDF file to get started
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}