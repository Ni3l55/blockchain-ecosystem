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

// Transfer to the next phase in [DEPOSIT - GIFT - COOLDOWN]
async function nextPhase() {
  let txn = await SecretSantaContract.goNextPhase();
  await txn.wait();
  console.log("Going to the next phase");

  // Confirm
  let deps = await SecretSantaContract.depositsAllowed();
  //console.log("Deposits allowed:", deps);
}

// Let a user claim their gift
async function claimGift(user) {
  let txn = await SecretSantaContract.connect(user).claimGift();
  await txn.wait();

  // Confirm
  let tkns = await NielsNFTContract.tokensOfOwner(user.address);

  console.log("User claming NFTs:", user.address);
  console.log("Received:", tkns);

}

async function main() {
  await initUsers();

  // Deploy contracts
  await deployNielsNFT();

  await deploySecretSanta();

  // Mint NFTs for some users
  await mintNielsNFTs(user1);
  await mintNielsNFTs(user2);
  await mintNielsNFTs(user3);

  // Approve & Send
  await approveNFTsendToSanta(user1, NielsNFTContract, 0)
  await approveNFTsendToSanta(user2, NielsNFTContract, 5)
  await approveNFTsendToSanta(user3, NielsNFTContract, 10)

  await sendNFTtoSanta(user1, NielsNFTContract, 0);
  await sendNFTtoSanta(user2, NielsNFTContract, 5);
  await sendNFTtoSanta(user3, NielsNFTContract, 10);

  // Go to the next phase
  await nextPhase();

  // Claim gifts
  await claimGift(user3);
  await claimGift(user1);
  await claimGift(user2);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
