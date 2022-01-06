import {
  Contract,
  ContractFactory
} from "ethers"
import { ethers } from "hardhat"

const main = async(): Promise<any> => {
  const CF: ContractFactory = await ethers.getContractFactory("NielsCoin")
  const coin: Contract = await CF.deploy('10000000000000000000000') // Supply initialSupply

  await coin.deployed()
  console.log(`NielsCoin deployed to: ${coin.address}`)
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})
