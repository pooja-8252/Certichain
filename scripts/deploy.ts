import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import fs from "fs";


//new update....
const fs = require("fs");

fs.writeFileSync(
  "./frontend/src/lib/contract-address.json",
  JSON.stringify({ address: certificateAddress })
);


// Load artifacts
const accessArtifact = JSON.parse(
  fs.readFileSync(
    "./artifacts/contracts/AccessControl.sol/AccessControl.json",
    "utf8"
  )
);

const certificateArtifact = JSON.parse(
  fs.readFileSync(
    "./artifacts/contracts/Certificate.sol/Certificate.json",
    "utf8"
  )
);

// Hardhat Account #0 — the DEPLOYER (has ETH to pay for deployment)
const DEPLOYER_PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

// ✅ Your actual MetaMask student wallet address
// Replace this with your real MetaMask address if different
const STUDENT_WALLET_ADDRESS = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";

async function main() {
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);

  const walletClient = createWalletClient({
    account,
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });

  const publicClient = createPublicClient({
    chain: hardhat,
    transport: http("http://127.0.0.1:8545"),
  });

  // ── Step 1: Deploy AccessControl ──────────────────────────────────────────
  console.log("Deploying AccessControl...");

  const accessTxHash = await walletClient.deployContract({
    abi: accessArtifact.abi,
    bytecode: accessArtifact.bytecode,
  });

  const accessReceipt = await publicClient.waitForTransactionReceipt({
    hash: accessTxHash,
  });

  const accessAddress = accessReceipt.contractAddress;
  if (!accessAddress) throw new Error("AccessControl deployment failed — no contract address");

  console.log("✅ AccessControl deployed at:", accessAddress);

  // ── Step 2: Deploy Certificate (passing AccessControl address) ─────────────
  console.log("Deploying Certificate...");

  const certificateTxHash = await walletClient.deployContract({
    abi: certificateArtifact.abi,
    bytecode: certificateArtifact.bytecode,
    args: [accessAddress],
  });

  const certificateReceipt = await publicClient.waitForTransactionReceipt({
    hash: certificateTxHash,
  });

  const certificateAddress = certificateReceipt.contractAddress;
  if (!certificateAddress) throw new Error("Certificate deployment failed — no contract address");

  console.log("✅ Certificate deployed at:", certificateAddress);

  // ── Step 3: Register your MetaMask wallet as a student ────────────────────
  // This MUST be inside main() so walletClient and accessAddress are in scope
  console.log(`Registering student: ${STUDENT_WALLET_ADDRESS} ...`);

  const registerTxHash = await walletClient.writeContract({
    address: accessAddress,
    abi: accessArtifact.abi,
    functionName: "registerStudent",
    args: [STUDENT_WALLET_ADDRESS],  // ← your MetaMask wallet, NOT the deployer
  });

  await publicClient.waitForTransactionReceipt({
    hash: registerTxHash,
  });

  console.log("✅ Student registered:", STUDENT_WALLET_ADDRESS);

  // ── Step 4: Save addresses so your frontend can read them ─────────────────
  const addresses = {
    accessControl: accessAddress,
    certificate: certificateAddress,
  };

  fs.writeFileSync(
    "./deployed-addresses.json",
    JSON.stringify(addresses, null, 2)
  );

  console.log("\n📄 Addresses saved to deployed-addresses.json");
  console.log("───────────────────────────────────────────");
  console.log("AccessControl :", accessAddress);
  console.log("Certificate   :", certificateAddress);
  console.log("───────────────────────────────────────────");
  console.log("Update these in your /lib/contracts.ts !");
}

main().catch(console.error);