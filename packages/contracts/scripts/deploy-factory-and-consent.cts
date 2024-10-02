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

  // deploy the questionnaire proxy contract
  const questionnaireCIDs = [
    "QmRo7nJCWrUbEqJ9ui8tmhvrQGmsEA7XvLuhqiYSzAyHc6",
    "QmSjJbS1UQacA4QMmHz8doqNE1Z1SyVQL7bdQKjbusGDRR",
    "QmZb6HFzES3nvGFWWcvzwtLEdbx7aenjpuViQx6sTf4ADL",
    "QmW4wgvPKJFpk8K6enhDZYsSb9YkpuSGNqyCMm3vfnihHt",
    "QmRNvefcakLqaUcnBuVnCk1NnvwHb7PGsD5M9vRnSLBjz6",
    "QmUbJYtBRuFQQM6R48yhGSzSZPiuXwLnpWxATzSqUjKy1J",
    "QmNpJv17oX1vj3pAEu1zFwX1PfyiCN8CUgouw3Pj52mQHK",
    "QmXSSQ8pD7KNGm1sa8wsqcCHqfYFKZ3femRpQRn3XckYPg",
  ];
  const Questionnaires = await ethers.getContractFactory("Questionnaires");
  const questionnaires = await upgrades.deployProxy(Questionnaires, [
    questionnaireCIDs,
  ]);
  await questionnaires.waitForDeployment();
  console.log("Questionnaires deployed to:", await questionnaires.getAddress());
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
