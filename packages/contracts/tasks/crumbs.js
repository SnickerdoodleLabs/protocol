const { CR, crumbsContract, consentFactory } = require("./constants.js");

/// TODD HELPP
/// sample CLI command to test this:
/// npx hardhat createCrumb --crumbid 1 --mask 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --owneraddressindex 0

task("createCrumb", "Creates a crumb")
  .addParam("crumbid", "Desired crumb Id")
  .addParam("mask", "String of private key mask")
  .addParam(
    "owneraddressindex",
    "Index or owner address of the connected wallet to generate Signer object to sign the tx.",
  )
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const signingAccount = accounts[taskArgs.owneraddressindex];

    // attach the first signer account to the consent contract handle
    const crumbsContractHandle = new hre.ethers.Contract(
      crumbsContract(),
      CR().abi,
      signingAccount,
    );

    console.log("ere", await crumbsContract());
    console.log("ere", await consentFactory());
    console.log("ere", signingAccount.address);

    await crumbsContractHandle
      .connect(signingAccount)
      .createCrumb(taskArgs.crumbId, taskArgs.mask);

    console.log(
      "Success! Crumb id " +
        taskArgs.crumbid +
        "created for address " +
        signingAccount.address +
        ".",
    );
  });

task("burnCrumb", "Burns a crumb")
  .addParam("crumbid", "Desired crumb Id")
  .addParam(
    "owneraddressindex",
    "Index or owner address of the connected wallet to generate Signer object to sign the tx.",
  )
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    signingAccount = accounts[taskArgs.owneraddressindex];

    // attach the first signer account to the consent contract handle
    const crumbsContractHandle = new hre.ethers.Contract(
      crumbsContract(),
      CR().abi,
      signingAccount,
    );

    await crumbsContractHandle.connect(signingAccount).burn(taskArgs.crumbid);
    console.log(
      "Success! Crumb id " +
        taskArgs.crumbid +
        "burnt from address " +
        signingAccount.address +
        ".",
    );
  });
