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
import { Wallet, LogOut, FilePlus, Clock, CheckSquare, Globe } from "lucide-react";

type Tab = "issue" | "pending" | "issued";

export default function InstituteDashboard() {
  const { logout } = useAuth();
  const { login } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("issue");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [walletConnected, setWalletConnected] = useState(false);
  const [issuedCount, setIssuedCount] = useState<number | null>(null);
  const [firebaseEmail, setFirebaseEmail] = useState("");

  const gold = "#b8893a";

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) setFirebaseEmail(user.email);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    function handleAccountChange(accounts: string[]) {
      const savedWallet = localStorage.getItem("sessionWallet");
      if (accounts.length === 0 || (savedWallet && accounts[0].toLowerCase() !== savedWallet.toLowerCase())) {
        setWalletAddress("");
        setWalletConnected(false);
        setIssuedCount(null);
        signOut(auth).catch(() => {});
        logout();
        router.replace("/");
      }
    }
    window.ethereum.on("accountsChanged", handleAccountChange);
    return () => { window.ethereum.removeListener("accountsChanged", handleAccountChange); };
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) { alert("MetaMask not found. Please install it."); return; }
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const addr = accounts[0];
      if (!addr || !addr.startsWith("0x")) return;
      setWalletAddress(addr);
      setWalletConnected(true);
      login("institute", addr);
      try {
        const contract = await getCertificateContract();
        const ids: bigint[] = await contract.getInstituteCertificates(addr);
        setIssuedCount(ids.length);
      } catch { /* non-critical */ }
    } catch (err: any) { console.error("Wallet connect failed:", err.message); }
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
    { id: "issue",   label: "Issue Certificate",    icon: <FilePlus size={15} /> },
    { id: "pending", label: "Pending Requests",     icon: <Clock size={15} /> },
    { id: "issued",  label: "Issued Certificates",  icon: <CheckSquare size={15} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: "#f9f5ef", fontFamily: "'Outfit', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap');
        .inst-tab-active { background: linear-gradient(135deg,#c9a24a,#b8893a); color:#fff; box-shadow:0 3px 14px rgba(184,137,58,0.3); }
        .inst-tab-inactive { color:#9a8a78; }
        .inst-tab-inactive:hover { color:#b8893a; background:rgba(184,137,58,0.07); }
      `}</style>

      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[520px] h-[420px] rounded-full blur-[130px]" style={{ background: "rgba(184,137,58,0.07)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[100px]" style={{ background: "rgba(160,130,90,0.055)" }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ── */}
        <div className="flex flex-col gap-5 mb-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] tracking-[0.22em] uppercase font-light mb-2" style={{ color: "#b5a795" }}>
              Institute Portal
            </p>
            <h1 className="font-normal leading-tight" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#1e1a14" }}>
              Certificate <em className="italic font-semibold" style={{ color: gold }}>Management</em>
            </h1>
            {firebaseEmail && (
              <p className="text-sm font-light mt-1" style={{ color: "#9a8a78" }}>{firebaseEmail}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap">
            {walletConnected ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.22)" }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#16a34a" }} />
                <span className="text-sm font-mono font-medium" style={{ color: "#16a34a" }}>{shortWallet}</span>
              </div>
            ) : (
              <button onClick={connectWallet}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:-translate-y-[1px]"
                style={{ background: "rgba(184,137,58,0.09)", border: "1px solid rgba(184,137,58,0.25)", color: gold }}>
                <Wallet size={15} /> Connect Wallet
              </button>
            )}

            <button onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.6)", border: "1px solid rgba(184,137,58,0.18)", color: "#7a6d5e" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(220,38,38,0.06)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(220,38,38,0.2)"; (e.currentTarget as HTMLButtonElement).style.color = "#dc2626"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(184,137,58,0.18)"; (e.currentTarget as HTMLButtonElement).style.color = "#7a6d5e"; }}>
              <LogOut size={15} /> Logout
            </button>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: CheckSquare, label: "Certificates Issued", value: issuedCount === null ? "—" : String(issuedCount), valueColor: "#1e1a14" },
            { icon: Wallet,      label: "Wallet Status",       value: walletConnected ? "Connected" : "Not Connected", valueColor: walletConnected ? "#16a34a" : "#b5a795" },
            { icon: Globe,       label: "Network",             value: "Sepolia", valueColor: gold },
          ].map(({ icon: Icon, label, value, valueColor }) => (
            <div key={label} className="px-5 py-4 rounded-2xl flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.55)", border: "1px solid rgba(184,137,58,0.15)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "rgba(184,137,58,0.09)", border: "1px solid rgba(184,137,58,0.15)" }}>
                <Icon size={15} style={{ color: gold }} />
              </div>
              <div>
                <p className="font-bold text-xl leading-none" style={{ fontFamily: "'Playfair Display', serif", color: valueColor }}>{value}</p>
                <p className="text-[10px] tracking-widest uppercase font-light mt-1" style={{ color: "#b5a795" }}>{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Wallet warning ── */}
        {!walletConnected && (
          <div className="mb-7 flex items-center gap-3 px-5 py-4 rounded-2xl"
            style={{ background: "rgba(217,119,6,0.06)", border: "1px solid rgba(217,119,6,0.22)" }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.2)" }}>
              <Wallet size={14} style={{ color: "#d97706" }} />
            </div>
            <p className="text-sm font-light flex-1" style={{ color: "#92400e" }}>
              Connect your MetaMask wallet to issue and view certificates.
            </p>
            <button onClick={connectWallet}
              className="text-xs font-medium px-3 py-1.5 rounded-xl transition-all whitespace-nowrap"
              style={{ background: "rgba(217,119,6,0.1)", border: "1px solid rgba(217,119,6,0.25)", color: "#d97706" }}>
              Connect Now
            </button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="flex gap-1.5 mb-8 p-1.5 rounded-2xl w-fit overflow-x-auto max-w-full"
          style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(184,137,58,0.14)" }}>
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap inst-tab-${activeTab === tab.id ? "active" : "inactive"}`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Content ── */}
        {activeTab === "issue" && (
          <IssueCertificateForm walletConnected={walletConnected} onConnectWallet={connectWallet} />
        )}
        {activeTab === "pending" && (
          <PendingRequests walletAddress={walletAddress} walletConnected={walletConnected} />
        )}
        {activeTab === "issued" && walletConnected && walletAddress.length === 42 ? (
          <InstituteCertificateList
            walletAddress={walletAddress}
            walletConnected={walletConnected}
            onCountLoaded={(count) => setIssuedCount(count)}
          />
        ) : activeTab === "issued" && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(184,137,58,0.08)", border: "1px solid rgba(184,137,58,0.18)" }}>
              <Wallet size={20} style={{ color: gold }} />
            </div>
            <p className="text-sm font-light" style={{ color: "#9a8a78" }}>
              Connect your wallet to view issued certificates
            </p>
          </div>
        )}

      </div>
    </div>
  );
}