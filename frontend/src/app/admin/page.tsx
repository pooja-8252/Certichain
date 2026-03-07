"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getAccessControlContract } from "@/lib/contracts";
import { Shield, Building2, Search, CheckCircle, XCircle, Loader2, Wallet, Globe, LayoutGrid } from "lucide-react";

export default function AdminPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [instituteAddress, setInstituteAddress] = useState("");
  const [registeredList, setRegisteredList] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: "success" | "error" | "loading" | null; message: string }>({ type: null, message: "" });
  const [checkAddress, setCheckAddress] = useState("");
  const [checkResult, setCheckResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"register" | "check">("register");

  const ADMIN_ADDRESS = process.env.NEXT_PUBLIC_ADMIN_ADDRESS?.toLowerCase();

  useEffect(() => { connectWallet(); }, []);

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
      setStatus({ type: "success", message: "Institute registered successfully!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed.";
      setStatus({ type: "error", message: msg.slice(0, 120) });
    }
  }

  async function handleCheckInstitute() {
    if (!ethers.isAddress(checkAddress)) {
      setCheckResult("invalid");
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
      setCheckResult(result ? "registered" : "not-registered");
    } catch {
      setCheckResult("error");
    }
  }

  const gold = "#b8893a";
  const inputStyle = {
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(184,137,58,0.2)",
    color: "#1e1a14",
    fontFamily: "'Outfit', sans-serif",
    outline: "none",
  };

  // ── Not connected ──
  if (!walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f9f5ef", fontFamily: "'Outfit', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');`}</style>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)" }}>
            <Wallet size={28} style={{ color: gold }} />
          </div>
          <p className="text-sm font-light" style={{ color: "#7a6d5e" }}>Connecting wallet…</p>
          <div className="w-5 h-5 border-2 rounded-full animate-spin mx-auto"
            style={{ borderColor: "rgba(184,137,58,0.3)", borderTopColor: gold }} />
        </div>
      </div>
    );
  }

  // ── Not admin ──
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: "#f9f5ef", fontFamily: "'Outfit', sans-serif" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');`}</style>
        <div className="text-center p-10 rounded-2xl max-w-sm w-full"
          style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(220,38,38,0.2)", boxShadow: "0 8px 40px rgba(120,90,40,0.07)" }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(220,38,38,0.07)", border: "1px solid rgba(220,38,38,0.18)" }}>
            <XCircle size={26} style={{ color: "#dc2626" }} />
          </div>
          <h2 className="font-normal text-xl mb-2" style={{ fontFamily: "'Playfair Display', serif", color: "#1e1a14" }}>
            Access <em className="italic" style={{ color: "#dc2626" }}>Denied</em>
          </h2>
          <p className="text-sm font-light mb-4" style={{ color: "#7a6d5e" }}>
            This portal is restricted to the contract admin only.
          </p>
          <p className="text-xs font-mono px-3 py-2 rounded-xl break-all"
            style={{ background: "rgba(220,38,38,0.05)", color: "#9a8a78", border: "1px solid rgba(220,38,38,0.1)" }}>
            {walletAddress}
          </p>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ──
  return (
    <div className="min-h-screen" style={{ background: "#f9f5ef", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .admin-input:focus {
          border-color: rgba(184,137,58,0.5) !important;
          background: rgba(255,255,255,0.95) !important;
          box-shadow: 0 0 0 3px rgba(184,137,58,0.1);
        }
        .tab-active {
          background: linear-gradient(135deg, #c9a24a, #b8893a);
          color: #fff;
          box-shadow: 0 3px 12px rgba(184,137,58,0.3);
        }
        .tab-inactive { color: #9a8a78; }
        .tab-inactive:hover { color: #b8893a; background: rgba(184,137,58,0.07); }
        .reg-btn {
          background: linear-gradient(135deg, #c9a24a, #b8893a);
          color: #fff;
          box-shadow: 0 4px 20px rgba(184,137,58,0.3);
          transition: all 0.25s ease;
        }
        .reg-btn:hover:not(:disabled) {
          box-shadow: 0 6px 28px rgba(184,137,58,0.45);
          transform: translateY(-1px);
        }
        .reg-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      `}</style>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full blur-[120px]" style={{ background: "rgba(184,137,58,0.07)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(160,130,90,0.06)" }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-12">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-12 flex-wrap gap-4">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase font-light mb-2" style={{ color: "#b5a795" }}>
              Admin Portal
            </p>
            <h1 className="font-normal leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.4rem", color: "#1e1a14" }}>
              Institute <em className="italic font-semibold" style={{ color: gold }}>Management</em>
            </h1>
            <p className="text-sm font-light mt-1" style={{ color: "#7a6d5e" }}>
              Register and manage verified institutes on-chain.
            </p>
          </div>

          {/* Wallet pill */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl"
            style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.18)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: gold, boxShadow: `0 0 0 3px rgba(184,137,58,0.2)` }} />
            <span className="text-xs font-mono" style={{ color: "#4a3f30" }}>
              {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase px-2 py-0.5 rounded-full"
              style={{ background: "rgba(184,137,58,0.1)", color: gold, border: "1px solid rgba(184,137,58,0.2)" }}>
              Admin
            </span>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-3 mb-10">
          {[
            { icon: LayoutGrid, label: "Registered This Session", value: String(registeredList.length),  valueColor: "#1e1a14" },
            { icon: Wallet,     label: "Wallet",                  value: "Connected",                    valueColor: "#16a34a" },
            { icon: Globe,       label: "Network",                  value: "Sepolia",                      valueColor: gold },
          ].map(({ icon: Icon, label, value, valueColor }) => (
            <div key={label} className="rounded-2xl p-5 flex flex-col gap-3"
              style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(184,137,58,0.15)" }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "rgba(184,137,58,0.09)", border: "1px solid rgba(184,137,58,0.15)" }}>
                <Icon size={15} style={{ color: gold }} />
              </div>
              <div>
                <p className="font-bold text-xl" style={{ fontFamily: "'Playfair Display', serif", color: valueColor }}>{value}</p>
                <p className="text-[10px] tracking-widest uppercase font-light mt-0.5" style={{ color: "#b5a795" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs + Panel ── */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(184,137,58,0.15)", boxShadow: "0 8px 40px rgba(120,90,40,0.07)" }}>

          {/* Tab bar */}
          <div className="flex p-1.5 gap-1.5" style={{ borderBottom: "1px solid rgba(184,137,58,0.1)", background: "rgba(255,255,255,0.3)" }}>
            {([
              { key: "register", label: "Register Institute", icon: Building2 },
              { key: "check",    label: "Check Status",       icon: Search },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === key ? "tab-active" : "tab-inactive"}`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="p-7">

            {/* Register tab */}
            {activeTab === "register" && (
              <div className="space-y-5">
                <div>
                  <label className="text-[11px] tracking-[0.16em] uppercase font-medium block mb-2" style={{ color: "#7a6d5e" }}>
                    Institute Wallet Address
                  </label>
                  <input
                    type="text"
                    value={instituteAddress}
                    onChange={(e) => { setInstituteAddress(e.target.value); setStatus({ type: null, message: "" }); }}
                    placeholder="0x..."
                    className="admin-input w-full px-4 py-3.5 rounded-xl text-sm font-mono transition-all"
                    style={inputStyle}
                  />
                  <p className="text-[11px] font-light mt-1.5" style={{ color: "#b5a795" }}>
                    Must be a valid Ethereum wallet address (0x…)
                  </p>
                </div>

                {/* Status */}
                {status.type && (
                  <div className="flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-light"
                    style={{
                      background: status.type === "success" ? "rgba(22,163,74,0.07)"
                               : status.type === "error"   ? "rgba(220,38,38,0.06)"
                               : "rgba(184,137,58,0.07)",
                      border: `1px solid ${status.type === "success" ? "rgba(22,163,74,0.2)"
                                         : status.type === "error"   ? "rgba(220,38,38,0.18)"
                                         : "rgba(184,137,58,0.2)"}`,
                      color: status.type === "success" ? "#16a34a"
                           : status.type === "error"   ? "#dc2626"
                           : gold,
                    }}>
                    {status.type === "loading"
                      ? <Loader2 size={15} className="animate-spin shrink-0 mt-0.5" />
                      : status.type === "success"
                      ? <CheckCircle size={15} className="shrink-0 mt-0.5" />
                      : <XCircle size={15} className="shrink-0 mt-0.5" />}
                    {status.message}
                  </div>
                )}

                <button
                  onClick={handleRegisterInstitute}
                  disabled={status.type === "loading" || !instituteAddress}
                  className="reg-btn w-full py-3.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                >
                  {status.type === "loading"
                    ? <><Loader2 size={15} className="animate-spin" /> Processing…</>
                    : <><Building2 size={15} /> Register Institute On-Chain</>}
                </button>
              </div>
            )}

            {/* Check tab */}
            {activeTab === "check" && (
              <div className="space-y-5">
                <div>
                  <label className="text-[11px] tracking-[0.16em] uppercase font-medium block mb-2" style={{ color: "#7a6d5e" }}>
                    Wallet Address to Check
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={checkAddress}
                      onChange={(e) => { setCheckAddress(e.target.value); setCheckResult(null); }}
                      placeholder="0x..."
                      className="admin-input flex-1 px-4 py-3.5 rounded-xl text-sm font-mono transition-all"
                      style={inputStyle}
                    />
                    <button
                      onClick={handleCheckInstitute}
                      className="px-5 py-3.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all hover:-translate-y-[1px]"
                      style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.22)", color: gold }}>
                      <Search size={14} />
                      Check
                    </button>
                  </div>
                </div>

                {checkResult && (
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl"
                    style={{
                      background: checkResult === "registered" ? "rgba(22,163,74,0.07)"
                               : checkResult === "not-registered" ? "rgba(220,38,38,0.06)"
                               : "rgba(184,137,58,0.07)",
                      border: `1px solid ${checkResult === "registered" ? "rgba(22,163,74,0.2)"
                                         : checkResult === "not-registered" ? "rgba(220,38,38,0.18)"
                                         : "rgba(184,137,58,0.2)"}`,
                    }}>
                    {checkResult === "registered"
                      ? <CheckCircle size={18} style={{ color: "#16a34a" }} />
                      : checkResult === "not-registered"
                      ? <XCircle size={18} style={{ color: "#dc2626" }} />
                      : <XCircle size={18} style={{ color: gold }} />}
                    <div>
                      <p className="text-sm font-medium" style={{
                        color: checkResult === "registered" ? "#16a34a"
                             : checkResult === "not-registered" ? "#dc2626"
                             : gold
                      }}>
                        {checkResult === "registered" ? "Registered Institute"
                         : checkResult === "not-registered" ? "Not a Registered Institute"
                         : checkResult === "invalid" ? "Invalid Ethereum Address"
                         : "Error checking address"}
                      </p>
                      {(checkResult === "registered" || checkResult === "not-registered") && (
                        <p className="text-xs font-mono mt-0.5" style={{ color: "#9a8a78" }}>
                          {checkAddress.slice(0, 12)}…{checkAddress.slice(-8)}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Session log ── */}
        {registeredList.length > 0 && (
          <div className="mt-6 rounded-2xl overflow-hidden"
            style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(184,137,58,0.15)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: "1px solid rgba(184,137,58,0.1)", background: "rgba(255,255,255,0.3)" }}>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} style={{ color: gold }} />
                <span className="text-sm font-medium" style={{ color: "#1e1a14" }}>Session Log</span>
              </div>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-medium"
                style={{ background: "rgba(184,137,58,0.1)", color: gold, border: "1px solid rgba(184,137,58,0.2)" }}>
                {registeredList.length} registered
              </span>
            </div>

            {/* Rows */}
            <div className="divide-y" style={{ borderColor: "rgba(184,137,58,0.08)" }}>
              {registeredList.map((addr, i) => (
                <div key={addr} className="flex items-center gap-4 px-6 py-3.5">
                  <span className="text-[11px] font-light w-6 text-right shrink-0" style={{ color: "#c9b99a" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-mono flex-1 truncate" style={{ color: "#4a3f30" }}>{addr}</span>
                  <span className="text-[10px] font-medium px-2.5 py-1 rounded-full shrink-0"
                    style={{ background: "rgba(22,163,74,0.08)", color: "#16a34a", border: "1px solid rgba(22,163,74,0.18)" }}>
                    On-Chain ✓
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