import { ethers } from "ethers";

export const CONTRACT_ADDRESSES = {
  accessControl: process.env.NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS!,
  certificate:   process.env.NEXT_PUBLIC_CERTIFICATE_ADDRESS!,
};

const SEPOLIA_CHAIN_ID = 11155111n;
const SEPOLIA_CHAIN_HEX = "0xaa36a7"; // 11155111 in hex

const CERTIFICATE_ABI = [
  "function requestCertificate(string calldata ipfsHash) external",
  "function issueCertificate(address student, string memory ipfsHash) external",
  "function approveCertificate(uint256 certId) external",
  "function revokeCertificate(uint256 certId) external",
  "function getCertificate(uint256 certId) external view returns (tuple(uint256 id, string ipfsHash, address student, address institute, bool approved, bool revoked))",
  "function getCertCount() external view returns (uint256)",
  "function getStudentCertificates(address student) external view returns (uint256[])",
  "function getInstituteCertificates(address institute) external view returns (uint256[])",
  "function verifyCertificate(uint256 certId) external view returns (tuple(uint256 id, string ipfsHash, address student, address institute, bool approved, bool revoked))",
  "event CertificateRequested(uint256 indexed id, address indexed student)",
  "event CertificateApproved(uint256 indexed id, address indexed institute)",
  "event CertificateRevoked(uint256 indexed id)",
  "event CertificateIssued(uint256 indexed id, address indexed student, address indexed institute)",
];

const ACCESS_CONTROL_ABI = [
  "function registerStudent(address student) external",
  "function registerInstitute(address institute) external",
  "function isStudent(address account) external view returns (bool)",
  "function isInstitute(address account) external view returns (bool)",
];

async function getSigner(): Promise<ethers.Signer> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed.");
  }

  await window.ethereum.request({ method: "eth_requestAccounts" });

  const provider = new ethers.BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();

  // ── Auto-switch to Sepolia if on wrong network ──────────────────────────
  if (network.chainId !== SEPOLIA_CHAIN_ID) {
    try {
      // Ask MetaMask to switch automatically
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_HEX }],
      });
    } catch (switchError: any) {
      // Error code 4902 = chain not added to MetaMask yet — add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_HEX,
              chainName: "Sepolia Testnet",
              nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
              rpcUrls: ["https://rpc.sepolia.org", "https://ethereum-sepolia-rpc.publicnode.com"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
      } else if (switchError.code === 4001) {
        // User rejected the switch
        throw new Error("Please switch MetaMask to Sepolia Testnet to continue.");
      } else {
        throw new Error(`Network switch failed: ${switchError.message}`);
      }
    }

    // Re-create provider after network switch
    const switchedProvider = new ethers.BrowserProvider(window.ethereum);
    const switchedNetwork = await switchedProvider.getNetwork();

    if (switchedNetwork.chainId !== SEPOLIA_CHAIN_ID) {
      throw new Error("Network switch did not complete. Please manually switch to Sepolia in MetaMask.");
    }

    const signer = await switchedProvider.getSigner();
    return signer;
  }

  // Already on Sepolia
  const signer = await provider.getSigner();
  return signer;
}

export async function getCertificateContract(): Promise<ethers.Contract> {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.certificate, CERTIFICATE_ABI, signer);
}

export async function getAccessControlContract(): Promise<ethers.Contract> {
  const signer = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESSES.accessControl, ACCESS_CONTROL_ABI, signer);
}