import { network } from "hardhat";
import fs from "fs";

async function main() {
  const { viem } = await network.connect("monadTestnet");

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
}

main().catch(console.error);