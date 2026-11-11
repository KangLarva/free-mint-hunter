const hre = require("hardhat");

async function main() {
  console.log("Deploying FreeMintNFT...");
  const FreeMintNFT = await hre.ethers.getContractFactory("FreeMintNFT");
  const nft = await FreeMintNFT.deploy();
  await nft.waitForDeployment();

  const address = await nft.getAddress();
  console.log(`FreeMintNFT deployed at: ${address}`);
  console.log(`Network: ${hre.network.name} (chainId ${hre.network.config.chainId})`);
  console.log(`Owner: ${(await hre.ethers.getSigners())[0].address}`);
  console.log(`Mint is closed by default — call setMintOpen(true) to open it.`);
  console.log(`Try the hunter: node scripts/check.js ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
