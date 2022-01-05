const { utils } = require("ethers");

async function mintNFTs(nftContract) {
  console.log("Minting 5 NFTs");

  let txn = await nftContract.mintNFTs(5, { value: utils.parseEther('0.05') });
  await txn.wait();         // Wait for transaction to complete. Has to be mined
  console.log("5 NFTs have been minted");
}

async function reserveNFTs(nftContract) {
  let txn = await nftContract.reserveNFTs(2, { value: utils.parseEther('0.02') });
  await txn.wait();         // Wait for transaction to complete. Has to be mined
  console.log("2 reserved NFTs have been claimed");
}

async function checkBalance(nftContract) {
  let txn = await nftContract.balanceOf('0x9967F82e2Bc665CbE25A9b2Fe68b32C2C72Ce720');
  console.log(txn.toString());
}

async function main() {
  // Get contract template of my NFT (basically contract ABI)
  const CF = await hre.ethers.getContractFactory("NielsNFT");
  const nftContract = await CF.attach('0xFC4f26cAA495085a2C7026B4f7fc54F7E9B6a672');

  checkBalance(nftContract);
  //mintNFTs(nftContract);
}

main()
    //.then(() => process.exit(0))
    //.catch((error) => {
    //    console.error(error);
    //    process.exit(1);
    //});
