require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
      sepolia: {
          url: process.env.RPC_URL, // Your Sepolia RPC URL
          accounts: [process.env.PRIVATE_KEY], // Your wallet private key
      },
  },
};
