import {
  Contract,
  ContractFactory
} from "ethers"
import { ethers } from "hardhat"

const { utils } = require("ethers");

var NielsNFTContract;
var SecretSantaContract;
const [contractOwner, user1, user2, user3] = await hre.ethers.getSigners();

async function deployNielsNFT() {
  const baseTokenURI = "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/";

  // Get contract template that we want to deploy
  const contractFactory = await hre.ethers.getContractFactory("NielsNFT");

  // Instantiate contract with the correct constructor arguments and deploy to chain
  NielsNFTContract = await contractFactory.deploy(baseTokenURI);

  // Wait for this transaction to be mined
  await NielsNFTContract.deployed();

  // Get contract address
  console.log("NielsNFT Contract deployed to: ", NielsNFTContract.address);
}

async function mintNielsNFTs(user) {
  // Mint some NFTs for myself (deployer of contract)
  let txn = await NielsNFTContract.connect(user).mintNFTs(5, { value: utils.parseEther('0.5')});
  await txn.wait();
  console.log("5 NielsNFT instances minted to:", user.address);
 
  // Confirm
  let tokenAmt = await NielsNFTContract.balanceOf(user.address);
  console.log("Number of tokens confirmation: ", tokenAmt);
}

async function deploySecretSanta() {
  // Get secret santa contract template
  const contractFactory = await hre.ethers.getContractFactory("SecretSanta");

  // Instantiate contract by deploying to chain
  SecretSantaContract = await contractFactory.deploy();

  // Wait for transaction to be mined / validated
  await SecretSantaContract.deployed();

  // Show address
  console.log("SecretSanta contract deployed to: ", SecretSantaContract.address);
}

async function sendNFTsToSanta(user) {
  // Send
}

async function main() {
  deployNielsNFT();

  deploySecretSanta();

  mintNielsNFTsToUser(user1);

  sendNFTsToSanta(user1);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
