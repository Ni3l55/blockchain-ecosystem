const { utils } = require("ethers");

// Import as if we're interacting with Ethereum blockchain, but is compatible with Avalanche C-Chain. Just change network in cfg

async function main() {
    // Get owner/deployer's wallet address
    const [owner] = await hre.ethers.getSigners();

    // Get contract template that we want to deploy
    const CF = await hre.ethers.getContractFactory("NielsCoin");

    // Instantiate contract with the correct constructor arguments and deploy to chain
    const contract = await CF.deploy('10000000000000000000000');

    // Wait for this transaction to be mined
    await contract.deployed();

    // Get contract address
    console.log("Contract deployed to:", contract.address);

    // Get amount of tokens of owner
    let tokens = await contract.balanceOf(owner.address);
    console.log("Owner has # tokens: ", tokens);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
