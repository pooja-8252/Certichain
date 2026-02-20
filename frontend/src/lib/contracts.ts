

// import { ethers } from "ethers";
// import certificateArtifact from "../artifacts/contracts/Certificate.sol/Certificate.json";
// import accessArtifact from "../artifacts/contracts/AccessControl.sol/AccessControl.json";

// // ── Deployed Contract Addresses (Monad Testnet) ───────────────────────────────
// export const CONTRACT_ADDRESSES = {
//   accessControl: process.env.NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS!,
//   certificate:   process.env.NEXT_PUBLIC_CERTIFICATE_ADDRESS!,
// };

// const CERTIFICATE_ABI = [
//   "function requestCertificate(string calldata ipfsHash) external",
//   "function issueCertificate(address student, string memory ipfsHash) external",
//   "function approveCertificate(uint256 certId) external",
//   "function revokeCertificate(uint256 certId) external",
//   "function getStudentCertificates(address student) external view returns (uint256[])",
//   "function getInstituteCertificates(address institute) external view returns (uint256[])",
//   "function certificates(uint256) external view returns (uint256 id, string ipfsHash, address student, address institute, bool approved, bool revoked)",
//   "function verifyCertificate(uint256 certId) external view returns (tuple(uint256 id, string ipfsHash, address student, address institute, bool approved, bool revoked))",
//   "event CertificateRequested(uint256 indexed id, address indexed student)",
//   "event CertificateApproved(uint256 indexed id, address indexed institute)",
//   "event CertificateRevoked(uint256 indexed id)",
//   "event CertificateIssued(uint256 indexed id, address indexed student, address indexed institute)",
// ];


// const ACCESS_CONTROL_ABI = [
//   "function registerStudent(address student) external",
//   "function registerInstitute(address institute) external",
//   "function isStudent(address account) external view returns (bool)",
//   "function isInstitute(address account) external view returns (bool)",
// ];

// // ── Get MetaMask provider & signer ───────────────────────────────────────────
// async function getSigner(): Promise<ethers.Signer> {
//   if (typeof window === "undefined" || !window.ethereum) {
//     throw new Error("MetaMask is not installed. Please install it to continue.");
//   }

//   await window.ethereum.request({ method: "eth_requestAccounts" });

//   const provider = new ethers.BrowserProvider(window.ethereum);
//   const signer = await provider.getSigner();

//   // ── Verify we're on Monad Testnet (chainId 10143) ─────────────────
//   const network = await provider.getNetwork();
//   if (network.chainId !== 10143n) {
//     throw new Error(
//       `Wrong network! Please switch MetaMask to Monad Testnet.\n` +
//       `Currently on chainId: ${network.chainId}. Expected: 10143`
//     );
//   }

//   return signer;
// }

// // ── Contract getters ──────────────────────────────────────────────────────────
// export async function getCertificateContract(): Promise<ethers.Contract> {
//   const signer = await getSigner();
//   return new ethers.Contract(
//     CONTRACT_ADDRESSES.certificate,
//     CERTIFICATE_ABI,
//     signer
//   );
// }

// export async function getAccessControlContract(): Promise<ethers.Contract> {
//   const signer = await getSigner();
//   return new ethers.Contract(
//     CONTRACT_ADDRESSES.accessControl,
//     ACCESS_CONTROL_ABI,
//     signer
//   );
// }


import { ethers } from "ethers";

export const CONTRACT_ADDRESSES = {
  accessControl: process.env.NEXT_PUBLIC_ACCESS_CONTROL_ADDRESS!,
  certificate:   process.env.NEXT_PUBLIC_CERTIFICATE_ADDRESS!,
};

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
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  if (network.chainId !== 10143n) {
    throw new Error(
      `Wrong network! Switch MetaMask to Monad Testnet.\nCurrently on chainId: ${network.chainId}. Expected: 10143`
    );
  }
//code for sepolia if needed....
// if (network.chainId !== 11155111n) {
    // throw new Error(
      // `Wrong network! Switch MetaMask to Sepolia Testnet.\nCurrently on chainId: ${network.chainId}. Expected: 11155111`
    // );
  // }
  


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