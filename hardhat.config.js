require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Dummy key so `compile` / `test` work without a .env file.
// NEVER deploy with this key — set a real PRIVATE_KEY in .env first.
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x" + "0".repeat(64);

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      // Cancun is required: OpenZeppelin v5 uses the MCOPY opcode (EIP-5656).
      evmVersion: "cancun",
    },
  },
  networks: {
    bscTestnet: {
      url: process.env.BSC_TESTNET_RPC || "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
      chainId: 97,
      accounts: [PRIVATE_KEY],
    },
    bsc: {
      url: process.env.BSC_RPC || "https://bsc-dataseed.bnbchain.org",
      chainId: 56,
      accounts: [PRIVATE_KEY],
    },
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC || "https://sepolia.base.org",
      chainId: 84532,
      accounts: [PRIVATE_KEY],
    },
    base: {
      url: process.env.BASE_RPC || "https://mainnet.base.org",
      chainId: 8453,
      accounts: [PRIVATE_KEY],
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC || "https://ethereum-sepolia.publicnode.com",
      chainId: 11155111,
      accounts: [PRIVATE_KEY],
    },
    ethereum: {
      url: process.env.ETHEREUM_RPC || "https://ethereum.publicnode.com",
      chainId: 1,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: {
      bsc: process.env.BSCSCAN_API_KEY || "",
      bscTestnet: process.env.BSCSCAN_API_KEY || "",
      base: process.env.BASESCAN_API_KEY || "",
      baseSepolia: process.env.BASESCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
      mainnet: process.env.ETHERSCAN_API_KEY || "",
    },
  },
};
