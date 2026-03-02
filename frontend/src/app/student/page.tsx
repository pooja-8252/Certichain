// "use client";

// import ProtectedRoute from '@/components/ProtectedRoute';
// import CertificateList from "./components/CertificateList1";
// import StudentTabs from "./components/StudentTabs";

// export default function StudentDashboard() {
//   return (
//     <ProtectedRoute allowedType="student">
//       {/* <div className="relative min-h-screen bg-[#0F1115] overflow-hidden"> */}
//       <div className="relative min-h-screen bg-[#0a0f1e] overflow-hidden">
//         {/* Background Glow */}
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(88,101,242,0.12),transparent_50%)]" />
//         <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(0,212,255,0.08),transparent_50%)]" />
        
//         {/* <div className="relative max-w-7xl mx-auto px-8 py-16 space-y-10"> */}
//         <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16 space-y-10">

//           {/* Header */}
//           <div className="space-y-4">
//             <h1 className="text-3xl font-semibold text-white tracking-tight">
//               Student Dashboard
//             </h1>
//             <p className="text-gray-400 text-sm">
//               Manage your certificate requests and track approval status.
//             </p>
//             <StudentTabs />
//           </div>
          
//           {/* Certificate List */}
//           <CertificateList />
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }



//2nd code updated one......

"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ProtectedRoute from '@/components/ProtectedRoute';
import CertificateList from "./components/CertificateList1";
import StudentTabs from "./components/StudentTabs";

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
      <div className="relative min-h-screen bg-[#0a0f1e] overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(88,101,242,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_70%,rgba(0,212,255,0.08),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-16 space-y-10">

          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold text-white tracking-tight">
              Student Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Manage your certificate requests and track approval status.
            </p>

            {/* ── Wallet Address Card ───────────────────────────────────────── */}
            {walletAddress ? (
              <div className="flex items-center justify-between gap-4 bg-white/[0.03] border border-white/[0.07] rounded-xl px-4 py-3 max-w-xl">
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500 uppercase tracking-widest mb-1">
                    Your Wallet Address
                  </p>
                  <p className="text-sm font-mono text-gray-300 truncate">
                    {walletAddress}
                  </p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Share this with your institute to receive certificates
                  </p>
                </div>
                <button
                  onClick={copyAddress}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                    copied
                      ? "bg-green-500/10 border-green-500/30 text-green-400"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-yellow-500/5 border border-yellow-500/15 rounded-xl px-4 py-3 max-w-xl">
                <svg className="w-4 h-4 text-yellow-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-yellow-500/80 flex-1">
                  Connect MetaMask to get your wallet address for certificate requests
                </p>
                <button
                  onClick={connectWallet}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-all"
                >
                  Connect
                </button>
              </div>
            )}
            {/* ─────────────────────────────────────────────────────────────── */}

            <StudentTabs />
          </div>

          {/* Certificate List */}
          <CertificateList />
        </div>
      </div>
    </ProtectedRoute>
  );
}