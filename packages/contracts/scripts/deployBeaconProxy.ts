import { ethers, upgrades } from "hardhat";

async function main() {
  const SnickerdoodleWalletFactory = await ethers.getContractFactory(
    "SnickerdoodleWalletFactory",
  );

  const owner = "0xBaea3282Cd6d44672EA12Eb6434ED1d1d4b615C7";

  // We will only have one wallet factory on each chain, so one proxy is enough
  const snickerdoodleWalletFactory = await upgrades.deployProxy(
    SnickerdoodleWalletFactory,
    ["0x6EDCE65403992e310A62460808c4b910D972f10f", owner],
    { salt: "TestBeacon" },
  );
  await snickerdoodleWalletFactory.waitForDeployment();
  console.log(
    "Box deployed to:",
    await snickerdoodleWalletFactory.getAddress(),
  );
}

main();
