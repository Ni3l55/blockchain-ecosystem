const { utils } = require("ethers");

async function checkBalance(coinContract) {
  let txn = await coinContract.balanceOf('0x9967F82e2Bc665CbE25A9b2Fe68b32C2C72Ce720');
  console.log(txn.toString());
}

async function main() {
  // Get contract template of my NFT (basically contract ABI)
  const CF = await hre.ethers.getContractFactory("NielsCoin");
  const coinContract = await CF.attach('0x626F08682Ab3fE3768c918167Ded4DE22062EED5');

  checkBalance(coinContract);
}

main()
    //.then(() => process.exit(0))
    //.catch((error) => {
    //    console.error(error);
    //    process.exit(1);
    //});
