import { ethers, upgrades } from "hardhat";

async function main() {
  const ConsentFactory = await ethers.getContractFactory("ConsentFactory");
  console.log("Upgrading ConsentFactory...");
  await upgrades.upgradeProxy(
    "0x5b6c961538E65b6EaCaf09Ec8E93D5f5f1d1afcC", // Fuji ConsentFactory address
    ConsentFactory,
  );
  console.log("ConsentFactory upgraded");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    console.log("Upgrading Complete");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
