"use client";

import { useEffect, useState } from "react";

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAddress(accounts[0]);
  }

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
      if (accounts.length > 0) setAddress(accounts[0]);
    });

    window.ethereum.on("accountsChanged", (accounts: string[]) => {
      setAddress(accounts[0] || null);
    });
  }, []);

  return { address, connect };
}
