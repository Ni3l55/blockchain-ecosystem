const { utils } = require("ethers");

var NielsNFTContract;
var SecretSantaContract;
var contractOwner, user1, user2, user3;

async function initUsers() {
  [contractOwner, user1, user2, user3] = await hre.ethers.getSigners();

  console.log("Users initialized");
}

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
  // Mint some NFTs for given user
  let txn = await NielsNFTContract.connect(user).mintNFTs(5, { value: utils.parseEther('0.5')});
  await txn.wait();
  console.log("5 NielsNFT instances minted to:", user.address);
 
  // Confirm
  let tokenAmt = await NielsNFTContract.balanceOf(user.address);
  console.log("Number of tokens confirmation:", tokenAmt);
}

async function deploySecretSanta() {
  // Get secret santa contract template
  const contractFactory = await hre.ethers.getContractFactory("SecretSanta");

  // Instantiate contract by deploying to chain
  SecretSantaContract = await contractFactory.deploy();

  // Wait for transaction to be mined / validated
  await SecretSantaContract.deployed();

  // Show address
  console.log("SecretSanta contract deployed to:", SecretSantaContract.address);
}

async function approveNFTsendToSanta(user, nftContract, nftId) {
  // User contacts his NFT contract with the SS-address and the id
  let txn = await nftContract.connect(user).approve(SecretSantaContract.address, nftId);
  await txn.wait();
  console.log("NFT approval done by user:", user.address);

  // Confirm
  let approvedAccount = await nftContract.getApproved(nftId);
  console.log("Approved NFT operator:", approvedAccount);
}

async function sendNFTtoSanta(user, nftContract, nftId) {
  // Requires approval to be done first by user
  let txn = await SecretSantaContract.connect(user).deposit(nftContract.address, nftId);
  await txn.wait();
  console.log("NFT sent to santa by user:", user.address);

  // Confirm
  let nftOwner = await nftContract.ownerOf(nftId);
  console.log("Owner of NFT:", nftOwner)
}

// Let santa scramble the NFTs he received
async function santaScramble() {

}

// Let santa send out NFTs to users
async function santaSend() {

}

async function main() {
  await initUsers();

  await deployNielsNFT();

  await deploySecretSanta();

  await mintNielsNFTs(user1);

  await approveNFTsendToSanta(user1, NielsNFTContract, 1)

  await sendNFTtoSanta(user1, NielsNFTContract, 1);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
