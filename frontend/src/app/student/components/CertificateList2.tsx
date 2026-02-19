"use client";

import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { getCertificateContract } from "@/lib/contracts";
import CertificateCard from "./CertificateCard3";
// deploy problem 

declare global {
  interface Window {
    ethereum?: any;
  }
}
// ── Matches your Solidity Cert struct exactly ────────────────────────────────
export type Cert = {
  id:        number;
  ipfsHash:  string;
  student:   string;
  institute: string;
  approved:  boolean;
  revoked:   boolean;
};

// ── Parse raw ethers struct → typed Cert ─────────────────────────────────────
function parseCert(raw: any): Cert {
  return {
    id:        Number(raw.id),
    ipfsHash:  raw.ipfsHash,
    student:   raw.student,
    institute: raw.institute,
    approved:  raw.approved,
    revoked:   raw.revoked,
  };
}

type Status = "loading" | "error" | "empty" | "ready";

export default function CertificateList() {
  const [certs,  setCerts]  = useState<Cert[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [errMsg, setErrMsg] = useState("");

  // ── Core fetch: IDs first, then parallel verifyCertificate per ID ──────────
  const fetchCertificates = useCallback(async () => {
    setStatus("loading");
    setErrMsg("");
    try {
      const contract = await getCertificateContract();

      // Step 1 — get the signer's wallet address
      //const signer  = await contract.runner?.getAddress?.();
      //if (!signer) throw new Error("Could not get wallet address from signer");
      // Step 1 — get the signer's wallet address
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signerObj = await provider.getSigner();
      const signer = await signerObj.getAddress();
      if (!signer) throw new Error("Could not get wallet address from signer");

      // Step 2 — fetch array of cert IDs for this student
      const ids: bigint[] = await contract.getStudentCertificates(signer);

      if (ids.length === 0) {
        setCerts([]);
        setStatus("empty");
        return;
      }

      // Step 3 — fetch each cert struct in parallel using verifyCertificate(id)
      const rawCerts = await Promise.all(
        ids.map((id) => contract.verifyCertificate(id))
      );

      const parsed = rawCerts.map(parseCert);
      setCerts(parsed);
      setStatus("ready");
    } catch (err: any) {
      console.error("CertificateList fetch error:", err);
      const msg: string = err?.message ?? "";

      if (msg.includes("Not student")) {
        setErrMsg("Your wallet is not registered as a student.\nAsk your institute admin to register you.");
      } else if (msg.includes("CALL_EXCEPTION")) {
        setErrMsg(
          "Contract call failed.\n" +
          "• Make sure MetaMask is on the Hardhat network (Chain ID 31337)\n" +
          "• Restart your Hardhat node if you reset it"
        );
      } else if (msg.includes("user rejected")) {
        setErrMsg("MetaMask connection was rejected.");
      } else {
        setErrMsg(msg || "Unknown error — check the console.");
      }
      setStatus("error");
    }
  }, []);

  // ── Initial load ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  // ── Real-time: re-fetch on every relevant contract event ──────────────────
  useEffect(() => {
    let contract: any;
    let mounted = true;

    async function subscribe() {
      try {
        contract = await getCertificateContract();

        const refresh = () => { if (mounted) fetchCertificates(); };

        // Your exact event names from Certificate.sol
        contract.on("CertificateRequested", refresh);  // student requests
        contract.on("CertificateApproved",  refresh);  // institute approves
        contract.on("CertificateRevoked",   refresh);  // institute revokes
      } catch (e) {
        console.warn("Could not subscribe to events:", e);
      }
    }

    subscribe();

    return () => {
      mounted = false;
      if (contract?.removeAllListeners) {
        contract.removeAllListeners("CertificateRequested");
        contract.removeAllListeners("CertificateApproved");
        contract.removeAllListeners("CertificateRevoked");
      }
    };
  }, [fetchCertificates]);

  // ── Re-fetch when user returns to this tab ─────────────────────────────────
  useEffect(() => {
    window.addEventListener("focus", fetchCertificates);
    return () => window.removeEventListener("focus", fetchCertificates);
  }, [fetchCertificates]);

  /* ── Render ─────────────────────────────────────────────────────────────── */

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2.5 text-sm text-gray-400">
        <div className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-gray-800 animate-spin shrink-0" />
        Loading certificates…
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-red-700 mb-1">Failed to load certificates</p>
        <p className="font-mono text-xs text-red-600 whitespace-pre-line mb-3 leading-relaxed">{errMsg}</p>
        <button
          onClick={fetchCertificates}
          className="bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === "empty") {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl py-12 px-6 text-center">
        <div className="text-4xl mb-3">📄</div>
        <p className="text-sm font-semibold text-gray-900 mb-1">No certificates yet</p>
        <p className="text-sm text-gray-500">Submit a request — it will appear here automatically once confirmed.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {certs.map((cert) => (
        <CertificateCard key={cert.id} certificate={cert} />
      ))}
    </div>
  );
}