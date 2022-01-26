import { task } from "hardhat/config"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import "@nomiclabs/hardhat-ethers"
import { BigNumber } from "ethers"
import "@nomiclabs/hardhat-waffle"

require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;

task("accounts", "Prints the list of accounts", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  accounts.forEach((account: SignerWithAddress): void => {
    console.log(account.address)
  })
})

task("balances", "Prints the list of AVAX account balances", async (args, hre): Promise<void> => {
  const accounts: SignerWithAddress[] = await hre.ethers.getSigners()
  for(const account of accounts){
    const balance: BigNumber = await hre.ethers.provider.getBalance(
      account.address
    );
    console.log(`${account.address} has balance ${balance.toString()}`);
  }
})

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.0",
};
