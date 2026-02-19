"use client";

import { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [account, setAccount] = useState<string | null>(null);

  async function connect() {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  }

  return (
    <button
      onClick={connect}
      className="bg-blue-500 px-4 py-2 rounded"
    >
      {account ? account.slice(0, 6) + "..." : "Connect Wallet"}
    </button>
  );
}