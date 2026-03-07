"use client";

import { useState, useRef } from "react";
import { getCertificateContract } from "@/lib/contracts";
import { Wallet, Upload, FileText, CheckCircle, AlertCircle, Loader2, RotateCcw, ExternalLink } from "lucide-react";

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

  const gold = "#b8893a";
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
    setErrorMsg(""); setTxHash(""); setIpfsHash("");
    try {
      setStage("uploading");
      const hash = await uploadToIPFS(file);
      setIpfsHash(hash);
      setStage("submitting");
      const contract = await getCertificateContract();
      try {
        await contract.issueCertificate.staticCall(studentAddress, hash);
      } catch (staticErr: any) {
        throw new Error(staticErr?.reason || staticErr?.error?.message || staticErr?.message || "Contract will revert — check the student address is registered on-chain");
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
    setStage("idle"); setFile(null); setStudentAddress("");
    setErrorMsg(""); setTxHash(""); setIpfsHash("");
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }

  const isLoading = ["uploading", "submitting", "confirming"].includes(stage);
  const progressStep = stage === "uploading" ? 1 : stage === "submitting" ? 2 : stage === "confirming" ? 3 : stage === "done" ? 4 : 0;

  const STEPS = ["Upload to IPFS", "Submit TX", "Confirm"];

  /* ── Wallet not connected ── */
  if (!walletConnected) {
    return (
      <div className="max-w-2xl">
        <div className="rounded-2xl p-14 flex flex-col items-center gap-5 text-center"
          style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(184,137,58,0.18)", boxShadow: "0 8px 40px rgba(120,90,40,0.07)" }}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
            <Wallet size={28} style={{ color: gold }} />
          </div>
          <div>
            <p className="font-normal text-lg mb-1" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
              Wallet <em className="italic" style={{ color: gold }}>Required</em>
            </p>
            <p className="text-sm font-light" style={{ color: "#7a6d5e" }}>
              Connect your MetaMask wallet to issue certificates on-chain.
            </p>
          </div>
          <button onClick={onConnectWallet}
            className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-medium transition-all hover:-translate-y-[1px]"
            style={{ background: "linear-gradient(135deg,#c9a24a,#b8893a)", color: "#fff", boxShadow: "0 4px 20px rgba(184,137,58,0.3)" }}>
            <Wallet size={14} /> Connect MetaMask
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5 px-0">

      {/* ── Progress steps ── */}
      {isLoading && (
        <div className="flex items-center gap-2 px-5 py-4 rounded-2xl flex-wrap"
          style={{ background: "rgba(184,137,58,0.07)", border: "1px solid rgba(184,137,58,0.18)" }}>
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={progressStep > i ? {
                  background: "linear-gradient(135deg,#c9a24a,#b8893a)", color: "#fff",
                } : progressStep === i + 1 ? {
                  background: "rgba(184,137,58,0.12)", border: `2px solid ${gold}`, color: gold,
                } : {
                  background: "rgba(255,255,255,0.4)", border: "1px solid rgba(184,137,58,0.2)", color: "#b5a795",
                }}>
                {progressStep > i ? "✓" : i + 1}
              </div>
              <span className="text-xs font-medium" style={{ color: progressStep >= i + 1 ? "#1e1a14" : "#b5a795" }}>
                {label}
              </span>
              {i < 2 && <div className="w-6 h-px mx-1" style={{ background: progressStep > i + 1 ? gold : "rgba(184,137,58,0.2)" }} />}
            </div>
          ))}
        </div>
      )}

      {/* ── Main form card ── */}
      <div className="rounded-2xl p-7 space-y-6"
        style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.18)", boxShadow: "0 8px 40px rgba(120,90,40,0.07)" }}>

        {/* Success */}
        {stage === "done" && (
          <div className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(22,163,74,0.22)" }}>
            <div className="flex items-center gap-3 px-5 py-3"
              style={{ background: "rgba(22,163,74,0.08)", borderBottom: "1px solid rgba(22,163,74,0.15)" }}>
              <CheckCircle size={16} style={{ color: "#16a34a" }} />
              <p className="text-sm font-medium" style={{ color: "#16a34a" }}>Certificate Issued Successfully!</p>
            </div>
            <div className="px-5 py-4 space-y-3" style={{ background: "rgba(255,255,255,0.5)" }}>
              {txHash && (
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.18em] uppercase font-medium" style={{ color: "#b5a795" }}>Transaction Hash</p>
                  <p className="text-xs font-mono break-all" style={{ color: "#4a3f30" }}>{txHash}</p>
                </div>
              )}
              {ipfsHash && (
                <div className="space-y-1">
                  <p className="text-[10px] tracking-[0.18em] uppercase font-medium" style={{ color: "#b5a795" }}>IPFS Document</p>
                  <a href={`https://ipfs.io/ipfs/${ipfsHash}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono break-all transition-all"
                    style={{ color: gold }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#c9a24a"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = gold; }}>
                    {ipfsHash} <ExternalLink size={11} className="shrink-0" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {stage === "error" && (
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(220,38,38,0.2)" }}>
            <div className="flex items-center gap-2 px-5 py-3"
              style={{ background: "rgba(220,38,38,0.07)", borderBottom: "1px solid rgba(220,38,38,0.15)" }}>
              <AlertCircle size={14} style={{ color: "#dc2626" }} />
              <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "#dc2626" }}>Transaction Failed</span>
            </div>
            <div className="px-5 py-3" style={{ background: "rgba(255,255,255,0.5)" }}>
              <p className="text-xs font-light leading-relaxed" style={{ color: "#7a6d5e" }}>{errorMsg}</p>
            </div>
          </div>
        )}

        {/* Student address */}
        <div className="space-y-2">
          <label className="block text-[11px] tracking-[0.16em] uppercase font-medium" style={{ color: "#7a6d5e" }}>
            Student Wallet Address
          </label>
          <input
            type="text"
            placeholder="0x..."
            value={studentAddress}
            onChange={(e) => setStudentAddress(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3.5 rounded-xl text-sm font-mono transition-all disabled:opacity-50"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(184,137,58,0.2)",
              color: "#1e1a14",
              outline: "none",
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(184,137,58,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(184,137,58,0.1)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(184,137,58,0.2)"; e.currentTarget.style.boxShadow = "none"; }}
          />
          <p className="text-[11px] font-light" style={{ color: "#b5a795" }}>
            Must be a registered student address on-chain
          </p>
        </div>

        {/* File upload */}
        <div className="space-y-2">
          <label className="block text-[11px] tracking-[0.16em] uppercase font-medium" style={{ color: "#7a6d5e" }}>
            Certificate PDF
          </label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 transition-all duration-200"
            style={{
              borderColor: dragOver ? gold
                         : file    ? "rgba(22,163,74,0.4)"
                         : "rgba(184,137,58,0.25)",
              background: dragOver ? "rgba(184,137,58,0.07)"
                        : file    ? "rgba(22,163,74,0.05)"
                        : "rgba(255,255,255,0.4)",
              opacity: isLoading ? 0.45 : 1,
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)} />

            {file ? (
              <>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)" }}>
                  <FileText size={22} style={{ color: "#16a34a" }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "#1e1a14" }}>{file.name}</p>
                  <p className="text-xs font-light mt-1" style={{ color: "#9a8a78" }}>
                    {(file.size / 1024).toFixed(1)} KB · Click to change
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(184,137,58,0.08)", border: "1px solid rgba(184,137,58,0.2)" }}>
                  <Upload size={22} style={{ color: gold }} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium" style={{ color: "#4a3f30" }}>
                    Drop PDF here or click to browse
                  </p>
                  <p className="text-xs font-light mt-1" style={{ color: "#b5a795" }}>PDF files only</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Submit / Reset */}
        {stage === "done" ? (
          <button onClick={reset}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all hover:-translate-y-[1px]"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.22)", color: "#7a6d5e" }}>
            <RotateCcw size={14} /> Issue Another Certificate
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!file || !studentAddress || isLoading}
            className="w-full h-12 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
            style={!file || !studentAddress || isLoading ? {
              background: "rgba(184,137,58,0.07)",
              border: "1px solid rgba(184,137,58,0.15)",
              color: "#c9b99a",
              cursor: "not-allowed",
            } : {
              background: "linear-gradient(135deg,#c9a24a,#b8893a)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(184,137,58,0.3)",
              cursor: "pointer",
            }}
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
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