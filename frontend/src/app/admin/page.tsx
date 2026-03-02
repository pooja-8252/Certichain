"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getAccessControlContract } from "@/lib/contracts";

export default function AdminPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [instituteAddress, setInstituteAddress] = useState("");
  const [registeredList, setRegisteredList] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error" | "loading" | null; message: string }>({ type: null, message: "" });
  const [checkAddress, setCheckAddress] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);

  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase();

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) return;
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setIsAdmin(address.toLowerCase() === ADMIN_ADDRESS);
    } catch {
      setStatus({ type: "error", message: "Failed to connect wallet." });
    }
  }

  async function handleRegisterInstitute() {
    if (!ethers.isAddress(instituteAddress)) {
      setStatus({ type: "error", message: "Invalid wallet address." });
      return;
    }
    try {
      setStatus({ type: "loading", message: "Sending transaction..." });
      const contract = await getAccessControlContract();
      const tx = await contract.registerInstitute(instituteAddress);
      await tx.wait();
      setRegisteredList((prev) => [...prev, instituteAddress]);
      setInstituteAddress("");
      setStatus({ type: "success", message: `Institute registered successfully!` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed.";
      setStatus({ type: "error", message: msg.slice(0, 120) });
    }
  }

  async function handleCheckInstitute() {
  if (!ethers.isAddress(checkAddress)) {
    setCheckResult("Invalid address.");
    return;
  }
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS!,
      ["function isInstitute(address account) external view returns (bool)"],
      provider
    );
    const result: boolean = await contract.isInstitute(checkAddress);
    setCheckResult(result ? "✅ Registered Institute" : "❌ Not a registered institute");
  } catch (e) {
    console.error(e);
    setCheckResult("Error checking address.");
  }
}

  // ── Not connected ────────────────────────────────────────────────────────────
  if (!walletAddress) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">Connecting wallet...</p>
        </div>
      </div>
    );
  }

  // ── Not admin ────────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center space-y-4 p-8 border border-red-500/20 rounded-2xl bg-red-500/5 max-w-sm">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg">Access Denied</h2>
          <p className="text-gray-400 text-sm">This page is restricted to the contract admin only.</p>
          <p className="text-gray-600 text-xs font-mono break-all">{walletAddress}</p>
        </div>
      </div>
    );
  }

  // ── Admin dashboard ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-xs font-bold">
            A
          </div>
          <span className="font-semibold text-white tracking-wide">E-Certify</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-mono">
            {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            ADMIN
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs tracking-[0.2em] text-cyan-500 uppercase mb-2">Admin Portal</p>
          <h1 className="text-3xl font-bold text-white">Institute Management</h1>
          <p className="text-gray-400 text-sm mt-1">Register and manage verified institutes on-chain.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Registered This Session", value: registeredList.length },
            { label: "Wallet Status", value: "Connected" },
            { label: "Network", value: "SepoliaEth" },
          ].map((stat) => (
            <div key={stat.label} className="border border-white/5 rounded-xl p-5 bg-white/[0.02]">
              <p className={`text-2xl font-bold ${stat.label === "Network" ? "text-purple-400" : stat.label === "Wallet Status" ? "text-cyan-400" : "text-white"}`}>
                {stat.value}
              </p>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Register Institute */}
        <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] space-y-5">
          <h2 className="text-base font-semibold text-white">Register New Institute</h2>

          <div className="space-y-2">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Institute Wallet Address</label>
            <input
              type="text"
              value={instituteAddress}
              onChange={(e) => setInstituteAddress(e.target.value)}
              placeholder="0x..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:bg-white/[0.07] transition-all"
            />
            <p className="text-xs text-gray-600">Must be a valid Ethereum wallet address</p>
          </div>

          {/* Status message */}
          {status.type && (
            <div className={`text-sm px-4 py-3 rounded-xl border ${
              status.type === "success" ? "bg-green-500/10 border-green-500/20 text-green-400" :
              status.type === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" :
              "bg-cyan-500/10 border-cyan-500/20 text-cyan-400"
            }`}>
              {status.type === "loading" && (
                <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin mr-2 align-middle" />
              )}
              {status.message}
            </div>
          )}

          <button
            onClick={handleRegisterInstitute}
            disabled={status.type === "loading" || !instituteAddress}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-all text-sm"
          >
            {status.type === "loading" ? "Processing..." : "Register Institute On-Chain"}
          </button>
        </div>

        {/* Check Institute */}
        <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] space-y-5">
          <h2 className="text-base font-semibold text-white">Check Institute Status</h2>
          <div className="flex gap-3">
            <input
              type="text"
              value={checkAddress}
              onChange={(e) => setCheckAddress(e.target.value)}
              placeholder="0x..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
            <button
              onClick={handleCheckInstitute}
              className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-white transition-all"
            >
              Check
            </button>
          </div>
          {checkResult && (
            <p className="text-sm text-gray-300 bg-white/5 rounded-xl px-4 py-3 border border-white/5">
              {checkResult}
            </p>
          )}
        </div>

        {/* Session registered list */}
        {registeredList.length > 0 && (
          <div className="border border-white/5 rounded-2xl p-6 bg-white/[0.02] space-y-4">
            <h2 className="text-base font-semibold text-white">Registered This Session</h2>
            <div className="space-y-2">
              {registeredList.map((addr, i) => (
                <div key={addr} className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3">
                  <span className="text-xs text-gray-500">#{i + 1}</span>
                  <span className="text-sm font-mono text-gray-300 flex-1">{addr}</span>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                    Registered
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}