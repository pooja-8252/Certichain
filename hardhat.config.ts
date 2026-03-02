// import { defineConfig } from "hardhat/config";
// import "@nomicfoundation/hardhat-ignition";
// import "@nomicfoundation/hardhat-viem"; // optional
// // no ethers plugin required

// export default defineConfig({
//   solidity: "0.8.28",
// });


//2nd method 

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


// import { defineConfig } from "hardhat/config";
// import hardhatViem from "@nomicfoundation/hardhat-viem";
// import dotenv from "dotenv";

// dotenv.config();

// export default defineConfig({
//   plugins: [hardhatViem], // ← THIS is how Hardhat v3 loads plugins
//   solidity: "0.8.28",
//   networks: {
//     monadTestnet: {
//       type: "http",
//       url: "https://testnet-rpc.monad.xyz",
//       chainId: 10143,
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
// });


//Sepolia Testnet network

import { defineConfig, configVariable } from "hardhat/config";
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL!,
      accounts: [process.env.PRIVATE_KEY!],
      chainId: 11155111,
    },
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY!,
    },
  },
});