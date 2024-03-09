import { ethers, upgrades } from "hardhat";

async function main() {
  const consent = await ethers.deployContract("Consent");
  await consent.waitForDeployment();
  console.log("Consent Contract deployed at: ", consent.target);

  const ConsentFactory = await ethers.getContractFactory("ConsentFactory");
  const consentFactory = await upgrades.deployProxy(ConsentFactory, [
    consent.target,
  ]);
  await consentFactory.waitForDeployment();
  console.log(
    "Consent Factory deployed to:",
    await consentFactory.getAddress(),
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => {
    console.log("Deployment Complete");
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
