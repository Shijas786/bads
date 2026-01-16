const hre = require("hardhat");

async function main() {
    console.log("Deploying AdBidding contract...");

    const adBidding = await hre.ethers.deployContract("AdBidding");

    await adBidding.waitForDeployment();

    const address = await adBidding.getAddress();
    console.log(`AdBidding deployed to: ${address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
