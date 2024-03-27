import { ethers, upgrades } from "hardhat";

async function main() {
  // deploy the consent contract implementation
  const consent = await ethers.deployContract("Consent");
  await consent.waitForDeployment();
  console.log("Consent Contract deployed at: ", consent.target);

  // deploy the upgradeable protocol token
  const Token = await ethers.getContractFactory("Snickerdoodle");
  const token = await upgrades.deployProxy(Token);
  await token.waitForDeployment();
  console.log("Token Contract deployed at: ", token.target);

  // deploy the consent contract factory and point to consent implementation and token
  const ConsentFactory = await ethers.getContractFactory("ConsentFactory");
  const consentFactory = await upgrades.deployProxy(ConsentFactory, [
    consent.target,
    token.target,
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
