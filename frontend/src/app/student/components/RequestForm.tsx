"use client";

import { useState } from "react";
import { getCertificateContract } from "@/lib/contracts";

type Stage = "idle" | "uploading" | "submitting" | "confirming" | "done" | "error";

export default function RequestForm() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [ipfsHash, setIpfsHash] = useState("");
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const loading = ["uploading", "submitting", "confirming"].includes(stage);

  async function uploadToIPFS(f: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", f);
    const res = await fetch("http://localhost:5000/upload", { method: "POST", body: fd });
    if (!res.ok) throw new Error(`Upload failed (${res.status})`);
    const data = await res.json();
    if (!data.IpfsHash) throw new Error("No IPFS hash returned");
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
      setErrorMsg(err?.reason || err?.message || "Something went wrong.");
      setStage("error");
    }
  }

  function reset() {
    setStage("idle"); setFile(null);
    setIpfsHash(""); setTxHash(""); setErrorMsg("");
  }

  const steps: { key: Stage; label: string; sub: string }[] = [
    { key: "uploading",  label: "Uploading to IPFS",        sub: "Pinning your document" },
    { key: "submitting", label: "Broadcasting transaction",  sub: "Sending to network"   },
    { key: "confirming", label: "Awaiting confirmation",     sub: "Waiting for block"    },
    { key: "done",       label: "Certificate anchored",      sub: "Permanently on-chain" },
  ];
  const stageOrder = steps.map(s => s.key);
  const currentIdx = stageOrder.indexOf(stage);
  const progressPct = stage === "uploading" ? 22 : stage === "submitting" ? 52 : stage === "confirming" ? 78 : stage === "done" ? 100 : 0;


return (
  <div className="min-h-screen flex justify-center pt-24 px-6 
                  bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0e1b2e]">

    <div className="w-full max-w-2xl">

      <div className="
        backdrop-blur-xl
        bg-white/5
        border border-white/10
        rounded-3xl
        shadow-2xl
        p-12
        text-white
      ">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-semibold tracking-tight">
            Request a Certificate
          </h2>
          <p className="text-gray-400 mt-2">
            Upload your document to anchor it on-chain via IPFS
          </p>
        </div>

        {/* Error */}
        {stage === "error" && errorMsg && (
          <div className="bg-red-500/10 border border-red-500/30 
                          text-red-400 rounded-xl p-4 mb-6 text-sm font-mono">
            {errorMsg}
          </div>
        )}

        {/* Success */}
        {stage === "done" && (
          <div className="bg-green-500/10 border border-green-500/30 
                          text-green-400 rounded-xl p-4 mb-6 text-sm">
            Certificate anchored successfully
          </div>
        )}

        {/* Upload Box */}
        <label
          htmlFor="certFile"
          className={`
            block cursor-pointer rounded-2xl border-2 border-dashed
            transition-all duration-300 p-8
            ${file
              ? "border-purple-500 bg-purple-500/10"
              : "border-white/20 bg-white/5 hover:border-purple-400 hover:bg-white/10"}
          `}
        >
          <input
            type="file"
            accept=".pdf"
            id="certFile"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] || null);
              setStage("idle");
              setErrorMsg("");
            }}
          />

          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br 
                            from-purple-500 to-blue-500
                            flex items-center justify-center text-sm font-semibold">
              PDF
            </div>

            <div className="flex-1">
              <div className="text-lg font-medium">
                {file ? file.name : "Upload certificate PDF"}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {file
                  ? `${(file.size / 1024).toFixed(1)} KB · click to replace`
                  : "Drag & drop or click to browse"}
              </div>
            </div>

            {file && (
              <button
                className="text-gray-400 hover:text-red-400 text-xl"
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                  setStage("idle");
                }}
              >
                ×
              </button>
            )}
          </div>
        </label>

        {/* Progress Section */}
        {stage !== "idle" && stage !== "error" && (
          <div className="mt-8 space-y-6">

            {/* Progress Bar */}
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400
                           transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-4">
              {steps.map((s) => {
                const idx = stageOrder.indexOf(s.key);
                const isActive = stage === s.key;
                const isComplete = currentIdx > idx;

                return (
                  <div key={s.key} className="flex items-center gap-4">
                    <div
                      className={`
                        w-6 h-6 rounded-full border flex items-center justify-center
                        ${isComplete
                          ? "bg-green-500 border-green-500"
                          : isActive
                          ? "bg-purple-500 border-purple-500"
                          : "border-white/30"}
                      `}
                    >
                      {isComplete && (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </div>

                    <div>
                      <div
                        className={`text-sm font-medium
                          ${isActive
                            ? "text-white"
                            : isComplete
                            ? "text-gray-300"
                            : "text-gray-500"}
                        `}
                      >
                        {s.label}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {s.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-10">
          <button
            onClick={stage === "done" ? reset : requestCertificate}
            disabled={(!file && stage !== "done") || loading}
            className={`
              w-full h-14 rounded-2xl font-semibold text-lg
              transition-all duration-300
              ${stage === "done"
                ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:opacity-90"
                : "bg-gradient-to-r from-indigo-500 to-cyan-500 hover:scale-[1.02]"}
              disabled:opacity-40 disabled:cursor-not-allowed
            `}
          >
            {loading
              ? "Processing..."
              : stage === "done"
              ? "Submit another request"
              : "Submit request"}
          </button>

          {!file && stage === "idle" && (
            <p className="text-center text-gray-500 text-sm mt-4">
              Upload a PDF file to get started
            </p>
          )}
        </div>

      </div>
    </div>
  </div>
);

}