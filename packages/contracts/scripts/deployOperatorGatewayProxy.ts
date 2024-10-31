import hre from "hardhat";

import SnickerdoodleFactoryModule from "../ignition/modules/SnickerdoodleFactory";

// A helper script used for automating a deployment of an Operator Gateway Proxy within a docker container
// This step is written as a separate script rather than using the Hardhat task because when Hardhat initializes, it reads and processes the configuration file.
// If you try hre.ignition during this initialization phase, it causes errors because Hardhat hasn't fully set up its environment yet.
// To use hardhat tasks requires copying the deployed address into a JSON file or the task file itself and using ethers.getContractAt to interact with it.
// This workaround is smoother for the automated deployment process.

async function main() {
  console.log("Deploying Operator Gateway Proxy...");
  // Since the contracts are deployed in the Ignition module, we can fetch the contract information
  // This will not redeploy the contract, but fetch the contract information
  const { snickerdoodleFactoryProxy } = await hre.ignition.deploy(
    SnickerdoodleFactoryModule,
  );

  // Get its address
  const snickerdoodleFactoryProxyAddress =
    await snickerdoodleFactoryProxy.getAddress();
  console.log(
    "Calling SnickerdoodleFactoryProxy at address:",
    snickerdoodleFactoryProxyAddress,
  );

  // Deploy the Operator Gateway with domain name
  const signers = await ethers.getSigners();
  const owner = signers[0];

  const domain = "snickerdoodle";
  await snickerdoodleFactoryProxy
    .connect(owner)
    .deployOperatorGatewayProxy(domain, [owner.address], [owner.address]);

  // Get the operator gateway address
  const gatewayBeacon = await snickerdoodleFactoryProxy.getGatewayBeacon();
  const operatorGatewayAddress =
    await snickerdoodleFactoryProxy.computeProxyAddress(domain, gatewayBeacon);

  // Confirm that it deployed
  try {
    const operatorGateway = await hre.ethers.getContractAt(
      "OperatorGateway",
      operatorGatewayAddress,
    );

    // Fetch the domain name from the contract to compare
    const fetchedDomainName = await operatorGateway.getDomainName();

    if (fetchedDomainName != domain) {
      throw new Error("Domain name does not match");
    }

    console.log("Deployed Operator Gateway at:", operatorGatewayAddress);
    console.log("Domain name:", fetchedDomainName);
  } catch (error) {
    console.error("Failed to deploy Operator Gateway");
  }
}

// Execute the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
