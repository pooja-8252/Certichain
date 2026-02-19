"use client";

import { useEffect, useState } from "react";
import { getCertificateContract } from "@/lib/contracts";
import CertificateCard from "./CertificateCard";

export default function CertificateList() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCertificates() {
      try {
        const contract = await getCertificateContract();
        const data = await contract.getMyCertificates();
        setCerts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCertificates();
  }, []);

  if (loading) {
    return <div className="text-gray-400">Loading certificates...</div>;
  }

  if (!certs.length) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center text-gray-400">
        No certificates found. Request one to get started.
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {certs.map((cert, i) => (
        <CertificateCard key={i} certificate={cert} />
      ))}
    </div>
  );
}