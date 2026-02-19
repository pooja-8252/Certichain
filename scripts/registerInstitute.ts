import { network } from "hardhat";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function main() {
  const { viem } = await network.connect("monadTestnet");

  const addresses = JSON.parse(fs.readFileSync("./deployed-addresses.json", "utf-8"));

  const accessControl = await viem.getContractAt(
    "AccessControl",
    addresses.accessControl
  );

  const walletAddress = process.env.STUDENT_ADDRESS;

  if (!walletAddress) {
    throw new Error("Add STUDENT_ADDRESS=0xyourwalletaddress to your .env file");
  }

  // Student already registered — only register as institute
  console.log("Registering wallet as institute:", walletAddress);
  const tx = await accessControl.write.registerInstitute([walletAddress]);
  console.log("Institute TX hash:", tx);

  const publicClient = await viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash: tx });

  console.log("✅ Institute registered!");
  console.log("🎉 Wallet is now both student AND institute.");
}

main().catch(console.error);