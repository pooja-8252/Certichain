// import { defineConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-ignition";
// import "@nomicfoundation/hardhat-viem"; // optional
// // no ethers plugin required

// export default defineConfig({
//   solidity: "0.8.28",
// });

// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-ignition";

// import * as dotenv from "dotenv";

// dotenv.config();

// const config: HardhatUserConfig = {
//   solidity: "0.8.28",
//   networks: {
//     monad: {
//       type: "http",
//       url: "https://rpc.testnet.monad.xyz",
//       accounts: process.env.PRIVATE_KEY
//         ? [process.env.PRIVATE_KEY]
//         : [],
//       chainId: 41454,
//     },
//   },
// };

// export default config;


import { defineConfig } from "hardhat/config";
import hardhatViem from "@nomicfoundation/hardhat-viem";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  plugins: [hardhatViem], // ← THIS is how Hardhat v3 loads plugins
  solidity: "0.8.28",
  networks: {
    monadTestnet: {
      type: "http",
      url: "https://testnet-rpc.monad.xyz",
      chainId: 10143,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
});




// import { HardhatUserConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-toolbox-viem";
// import dotenv from "dotenv";

// dotenv.config();

// const PRIVATE_KEY = process.env.PRIVATE_KEY!;
// const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL!;

// const config: HardhatUserConfig = {
//   solidity: {
//     version: "0.8.20",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200,
//       },
//     },
//   },
//   networks: {
//     sepolia: {
//       url: SEPOLIA_RPC_URL,
//       accounts: [PRIVATE_KEY],
//       chainId: 11155111,
//     },
//   },
//   etherscan: {
//     apiKey: {
//       sepolia: process.env.ETHERSCAN_API_KEY!,
//     },
//   },
// };

// export default config;


