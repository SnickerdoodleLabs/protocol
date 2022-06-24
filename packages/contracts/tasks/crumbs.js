const { CR, crumbsContract, consentFactory } = require("./constants.js");

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

    await crumbsContractHandle
      .connect(signingAccount)
      .createCrumb(taskArgs.crumbid, taskArgs.mask);

    console.log("");
    console.log(
      "Success! Crumb id " +
        taskArgs.crumbid +
        " created for address " +
        signingAccount.address +
        ".",
    );
    console.log("");
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

    console.log("");
    console.log(
      "Success! Crumb id " +
        taskArgs.crumbid +
        " burnt from address " +
        signingAccount.address +
        ".",
    );
    console.log("");
  });
