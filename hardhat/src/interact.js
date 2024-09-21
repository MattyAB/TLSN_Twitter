require('dotenv').config();
const { ethers, randomBytes } = require('ethers');
const fs = require('fs');
const path = require('path');

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;

if (!PRIVATE_KEY || !RPC_URL) {
  console.error('Please set your PRIVATE_KEY and RPC_URL in a .env file');
  process.exit(1);
}

// Load contract details
const contractJsonPath = path.resolve(__dirname, '../../abis/InputBox.json');
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));

const CONTRACT_ADDRESS = contractJson.address;
const CONTRACT_ABI = contractJson.abi;

// Initialize provider and wallet
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Create contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

async function main() {
  try {
    // Example: Call a read-only function
    console.log(contract.interface);
    const someData = await contract.getNumberOfInputs('0xE2CA86422b06Cd89532aAb35b03E87de6c345159');
    console.log('Read-only data:', someData);

    // Example: Send a transaction to a write function
    const randomData = randomBytes(32);
    const txResponse = await contract.addInput('0xE2CA86422b06Cd89532aAb35b03E87de6c345159', randomData);
    console.log('Transaction response:', txResponse);

    // // Wait for the transaction to be mined
    // const txReceipt = await txResponse.wait();
    // console.log('Transaction mined:', txReceipt);

    // Further interactions or logic
  } catch (error) {
    console.error('Error interacting with the contract:', error);
  }
}

main();
