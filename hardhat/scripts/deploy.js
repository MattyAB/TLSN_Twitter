require('dotenv').config();
const { ethers } = require('ethers');
const fs = require('fs');

// Load environment variables
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL_SEPOLIA = process.env.RPC_URL_SEPOLIA;
const RPC_URL_BASESEPOLIA = process.env.RPC_URL_BASESEPOLIA;

if (!PRIVATE_KEY || !RPC_URL_BASESEPOLIA) {
  console.error('Please set your PRIVATE_KEY and RPC_URL in a .env file');
  process.exit(1);
}

// Initialize provider and wallet
const provider_base = new ethers.JsonRpcProvider(RPC_URL_BASESEPOLIA);
const wallet_base = new ethers.Wallet(PRIVATE_KEY, provider_base);


async function main() {
    const nftAbiEtc = JSON.parse(fs.readFileSync('./artifacts/contracts/XNFT.sol/XNFT.json', 'utf8'));

    abi = nftAbiEtc.abi;
    bytecode = nftAbiEtc.bytecode;

    const nftContractFactory = new ethers.ContractFactory(abi, bytecode, wallet_base);
    const nftContract = await nftContractFactory.deploy();

    console.log("Deploying NFT contract...");

    // Wait for the contract to be mined
    await nftContract.waitForDeployment();

    console.log("NFT contract address:", nftContract.target);


    const sourceAbiEtc = JSON.parse(fs.readFileSync('./artifacts/contracts/SourceNFT.sol/SourceNFT.json', 'utf8'));

    abi = sourceAbiEtc.abi;
    bytecode = sourceAbiEtc.bytecode;

    const sourceContract = new ethers.ContractFactory(abi, bytecode, wallet_base);
    const sourceNFT = await sourceContract.deploy(nftContract.target);

    console.log("Source NFT contract address:", sourceNFT.address);

    // console.log("Destination NFT contract address:", destNFT.address);
}
    
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
