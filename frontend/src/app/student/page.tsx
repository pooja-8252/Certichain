"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ProtectedRoute from '@/components/ProtectedRoute';
import CertificateList from "./components/CertificateList1";
import StudentTabs from "./components/StudentTabs";
import { Copy, Check, Wallet, AlertTriangle } from "lucide-react";

export default function StudentDashboard() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getWallet();
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", getWallet);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", getWallet);
      }
    };
  }, []);

  async function getWallet() {
    try {
      if (!window.ethereum) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const address = await accounts[0].getAddress();
        setWalletAddress(address);
      } else {
        setWalletAddress(null);
      }
    } catch {
      setWalletAddress(null);
    }
  }

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask is not installed.");
        return;
      }
      await window.ethereum.request({ method: "eth_requestAccounts" });
      getWallet();
    } catch {
      // user rejected
    }
  }

  function copyAddress() {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <ProtectedRoute allowedType="student">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');`}</style>

      <div className="relative min-h-screen overflow-hidden" style={{ background: "#f9f5ef", fontFamily: "'Outfit', sans-serif" }}>

        {/* Ambient glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full blur-[130px]" style={{ background: "rgba(184,137,58,0.07)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(160,130,90,0.06)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-14 space-y-8">

          {/* ── Header ── */}
          <div className="space-y-5">

            {/* Page title */}
            <div>
              <p className="text-[10px] tracking-[0.22em] uppercase font-light mb-2" style={{ color: "#b5a795" }}>
                Portal
              </p>
              <h1 className="font-normal leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem, 4vw, 2.6rem)", color: "#1e1a14" }}>
                Student <em className="italic font-semibold" style={{ color: "#b8893a" }}>Dashboard</em>
              </h1>
              <p className="text-sm font-light mt-1" style={{ color: "#7a6d5e" }}>
                Manage your certificate requests and track approval status.
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="h-px w-10" style={{ background: "linear-gradient(90deg, rgba(184,137,58,0.3), transparent)" }} />
              <div className="h-1 w-1 rounded-full" style={{ background: "rgba(184,137,58,0.4)" }} />
            </div>

            {/* ── Wallet Address Card ── */}
            {walletAddress ? (
              <div
                className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4 max-w-xl"
                style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.18)", boxShadow: "0 4px 24px rgba(120,90,40,0.06)" }}
              >
                <div className="min-w-0 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                    style={{ background: "rgba(184,137,58,0.1)", border: "1px solid rgba(184,137,58,0.18)" }}>
                    <Wallet size={15} style={{ color: "#b8893a" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] tracking-[0.18em] uppercase font-medium mb-1" style={{ color: "#b5a795" }}>
                      Your Wallet Address
                    </p>
                    <p className="text-sm font-mono truncate" style={{ color: "#1e1a14" }}>
                      {walletAddress}
                    </p>
                    <p className="text-[11px] font-light mt-1" style={{ color: "#9a8a78" }}>
                      Share this with your institute to receive certificates
                    </p>
                  </div>
                </div>

                <button
                  onClick={copyAddress}
                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
                  style={copied ? {
                    background: "rgba(22,163,74,0.08)",
                    border: "1px solid rgba(22,163,74,0.22)",
                    color: "#16a34a",
                  } : {
                    background: "rgba(184,137,58,0.08)",
                    border: "1px solid rgba(184,137,58,0.2)",
                    color: "#b8893a",
                  }}
                >
                  {copied ? (
                    <><Check size={13} /> Copied</>
                  ) : (
                    <><Copy size={13} /> Copy</>
                  )}
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-3 rounded-2xl px-5 py-4 max-w-xl"
                style={{ background: "rgba(217,119,6,0.05)", border: "1px solid rgba(217,119,6,0.18)" }}
              >
                <AlertTriangle size={16} className="shrink-0" style={{ color: "#d97706" }} />
                <p className="text-xs font-light flex-1" style={{ color: "#92400e" }}>
                  Connect MetaMask to get your wallet address for certificate requests
                </p>
                <button
                  onClick={connectWallet}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-xl font-medium transition-all"
                  style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.22)", color: "#d97706" }}
                >
                  Connect
                </button>
              </div>
            )}

            {/* Tabs */}
            <StudentTabs />
          </div>

          {/* ── Certificate List ── */}
          <CertificateList />

        </div>
      </div>
    </ProtectedRoute>
  );
}