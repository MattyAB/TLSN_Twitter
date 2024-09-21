require('dotenv').config();
const { ethers, randomBytes } = require('ethers');
const { NonceManager } = require('@ethersproject/experimental');
const fs = require('fs');
const path = require('path');
const { decode_file } = require('./utils/decode'); 

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

const nonceManager = new NonceManager(wallet);

// Create contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, nonceManager.connect(provider));

async function main() {
  try {
    auth_proof = decode_file('../tlsn/proof/auth_proof.json');
    auth_proof = {
        'username': 'mattbeton',
        'proof': auth_proof,
    }
    auth_proof = {
        'kind': 'ProofOfOwnership',
        'payload': auth_proof,
    }

    user_proof = decode_file('../tlsn/proof/user_proof.json');
    user_proof = {
        'username': 'mattbeton',
        'proof': user_proof,
    }
    user_proof = {
        'kind': 'ProofOfTheNumberOfFollowers',
        'payload': user_proof,
    }

    const txResponse1 = await contract.addInput('0xE2CA86422b06Cd89532aAb35b03E87de6c345159', ethers.toUtf8Bytes(JSON.stringify(auth_proof)));
    console.log('Transaction response:', txResponse1);
    const txResponse2 = await contract.addInput('0xE2CA86422b06Cd89532aAb35b03E87de6c345159', ethers.toUtf8Bytes(JSON.stringify(user_proof)));
    console.log('Transaction response:', txResponse2);

    // // Wait for the transaction to be mined
    const txReceipt1 = await txResponse1.wait();
    console.log('Transaction mined:', txReceipt1);
    const txReceipt2 = await txResponse2.wait();
    console.log('Transaction mined:', txReceipt2);
  } catch (error) {
    console.error('Error interacting with the contract:', error);
  }
}

main();
