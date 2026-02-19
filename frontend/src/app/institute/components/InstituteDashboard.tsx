"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import IssueCertificateForm from "./IssueCertificateForm";
import InstituteCertificateList from "./InstituteCertificateList";
import PendingRequests from "./PendingRequests";
import { getCertificateContract } from "@/lib/contracts";

type Tab = "issue" | "pending" | "issued";

export default function InstituteDashboard() {
  const { logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("issue");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [issuedCount, setIssuedCount] = useState<number | null>(null);
  const [firebaseEmail, setFirebaseEmail] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) setFirebaseEmail(user.email);
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("MetaMask not found. Please install it.");
        return;
      }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const addr = accounts[0];
      if (!addr || !addr.startsWith("0x")) return;
      setWalletAddress(addr);
      setWalletConnected(true);
      try {
        const contract = await getCertificateContract();
        const ids: bigint[] = await contract.getInstituteCertificates(addr);
        setIssuedCount(ids.length);
      } catch { /* non-critical */ }
    } catch (err: any) {
      console.error("Wallet connect failed:", err.message);
    }
  }

  async function handleLogout() {
    try { await signOut(auth); } catch { /* ignore */ }
    logout();
    router.replace("/");
  }

  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}…${walletAddress.slice(-4)}`
    : null;

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    {
      id: "issue",
      label: "Issue Certificate",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      ),
    },
    {
      id: "pending",
      label: "Pending Requests",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "issued",
      label: "Issued Certificates",
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(6,182,212,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6,182,212,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      <div className="fixed -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[11px] font-mono tracking-[0.3em] text-cyan-400 uppercase mb-2">Institute Portal</p>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Certificate Management</h1>
            {firebaseEmail && <p className="text-gray-400 text-sm mt-1">{firebaseEmail}</p>}
          </div>

          <div className="flex items-center gap-3">
            {walletConnected ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-mono text-emerald-300 font-medium">{shortWallet}</span>
              </div>
            ) : (
              <button onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40
                           text-cyan-300 text-sm font-medium hover:bg-cyan-500/25 hover:border-cyan-400 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6m18 0V4.5" />
                </svg>
                Connect Wallet
              </button>
            )}
            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 border border-white/20
                         text-gray-300 text-sm font-medium hover:bg-red-500/15 hover:border-red-400/50
                         hover:text-red-300 transition-all duration-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="px-6 py-4 rounded-2xl bg-white/8 border border-white/15 text-center">
            <p className="text-3xl font-bold text-cyan-400">{issuedCount === null ? "—" : issuedCount}</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Certificates Issued</p>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-white/8 border border-white/15 text-center">
            <p className={`text-3xl font-bold ${walletConnected ? "text-emerald-400" : "text-gray-600"}`}>
              {walletConnected ? "Connected" : "Not Connected"}
            </p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Wallet Status</p>
          </div>
          <div className="px-6 py-4 rounded-2xl bg-white/8 border border-white/15 text-center">
            <p className="text-3xl font-bold text-purple-400">Monad</p>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Network</p>
          </div>
        </div>

        {/* Wallet warning */}
        {!walletConnected && (
          <div className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <svg className="w-5 h-5 text-amber-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <p className="text-amber-300 text-sm flex-1">Connect your MetaMask wallet to issue and view certificates.</p>
            <button onClick={connectWallet}
              className="text-sm text-amber-400 font-semibold border border-amber-500/40 px-3 py-1.5
                         rounded-lg hover:bg-amber-500/15 transition-all whitespace-nowrap">
              Connect Now
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1.5 bg-white/5 border border-white/15 rounded-2xl w-fit">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${activeTab === tab.id
                  ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/8"
                }
              `}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "issue" && (
          <IssueCertificateForm walletConnected={walletConnected} onConnectWallet={connectWallet} />
        )}
        {activeTab === "pending" && (
          <PendingRequests walletAddress={walletAddress} walletConnected={walletConnected} />
        )}
        {activeTab === "issued" && walletConnected && walletAddress.length === 42 ? (
          <InstituteCertificateList walletAddress={walletAddress} walletConnected={walletConnected} />
        ) : activeTab === "issued" && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="text-gray-400 text-sm">Connect your wallet to view issued certificates</p>
          </div>
        )}
      </div>
    </div>
  );
}