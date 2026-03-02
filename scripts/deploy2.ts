import { network } from "hardhat";
import fs from "fs";

async function main() {
  const { viem } = await network.connect("sepolia");

  const walletClients = await viem.getWalletClients();
  console.log("Deploying from:", walletClients[0].account.address);

  const access = await viem.deployContract("AccessControl");
  console.log("AccessControl deployed to:", access.address);

  const certificate = await viem.deployContract("Certificate", [access.address]);
  console.log("Certificate deployed to:", certificate.address);

  fs.writeFileSync(
    "./deployed-addresses.json",
    JSON.stringify(
      { accessControl: access.address, certificate: certificate.address },
      null,
      2
    )
  );

  console.log("Saved to deployed-addresses.json");
}

main().catch(console.error);