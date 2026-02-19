// this code is for hardhat local 

import { ethers } from "ethers";

const HARDHAT_CHAIN_ID = "0x7a69"; // 31337 in hex

export function getProvider() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  return new ethers.BrowserProvider(window.ethereum);
}

export async function ensureCorrectNetwork() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (currentChainId !== HARDHAT_CHAIN_ID) {
    try {
      // Try switching
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Add Hardhat network if missing
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: HARDHAT_CHAIN_ID,
              chainName: "Hardhat Local",
              rpcUrls: ["http://127.0.0.1:8545"],
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
            },
          ],
        });
      } else {
        throw switchError;
      }
    }
  }
}

export async function getSigner() {
  await ensureCorrectNetwork(); // 🔥 important

  const provider = getProvider();
  return await provider.getSigner();
}
