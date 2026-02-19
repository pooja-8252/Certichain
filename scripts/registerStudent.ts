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

  // Step 1: Register as student
  console.log("Registering wallet as student:", walletAddress);
  const tx1 = await accessControl.write.registerStudent([walletAddress]);
  console.log("Student TX hash:", tx1);

  // ✅ Wait for student tx to be mined before sending next tx
  console.log("Waiting for student tx to confirm...");
  const publicClient = await viem.getPublicClient();
  await publicClient.waitForTransactionReceipt({ hash: tx1 });
  console.log("✅ Student registered!");

  // Step 2: Register as institute (only after step 1 is confirmed)
  console.log("Registering same wallet as institute:", walletAddress);
  const tx2 = await accessControl.write.registerInstitute([walletAddress]);
  console.log("Institute TX hash:", tx2);

  console.log("Waiting for institute tx to confirm...");
  await publicClient.waitForTransactionReceipt({ hash: tx2 });
  console.log("✅ Institute registered!");

  console.log("\n🎉 Done! Wallet registered as both student and institute.");
}

main().catch(console.error);