require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
      base_sepolia: {
          url: process.env.RPC_URL_BASESEPOLIA, // Your Sepolia RPC URL
          accounts: [process.env.PRIVATE_KEY], // Your wallet private key
      },
      sepolia: {
          url: process.env.RPC_URL_SEPOLIA, // Your Sepolia RPC URL
          accounts: [process.env.PRIVATE_KEY], // Your wallet private key
      },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  }
};

