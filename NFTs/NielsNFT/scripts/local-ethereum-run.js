const { utils } = require("ethers");

async function main() {
    const baseTokenURI = "ipfs://QmZbWNKJPAjxXuNFSEaksCJVd1M6DaKQViJBYPK2BdpDEP/";

    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();

    // Get contract template that we want to deploy
    const contractFactory = await hre.ethers.getContractFactory("NielsNFT");

    // Instantiate contract with the correct constructor arguments and deploy to chain
    const contract = await contractFactory.deploy(baseTokenURI);

    // Wait for this transaction to be mined
    await contract.deployed();

    // Get contract address
    console.log("Contract deployed to:", contract.address);

    // Reserve 6 NFTs
    let txn = await contract.reserveNFTs(6);
    await txn.wait();         // Wait for transaction to complete. Has to be mined
    console.log("6 reserved NFTs have been minted");

    // Check if 4 reserved left
    let left = await contract.reservedLeft();
    console.log("Reserved left:", left);

    // Mint 90 NFTs by sending 0.9 ether
    txn = await contract.mintNFTs(90, { value: utils.parseEther('0.9') });
    await txn.wait()        // Wait for transaction to complete. Has to be mined
    console.log("Minting 90 NFTs");

    // Get amount of tokens
    let tokens = await contract.balanceOf(owner.address);
    console.log("Owner has # tokens: ", tokens);

    // Mint reserved NFTs while normals can't mint
    txn = await contract.reserveNFTs(2);
    await txn.wait();
    console.log("Claiming 2 reserved NFTs");

    // Get amount of tokens
    tokens = await contract.balanceOf(owner.address);
    console.log("Owner has # tokens: ", tokens);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
