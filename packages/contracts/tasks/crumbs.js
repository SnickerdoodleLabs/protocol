const { CR, crumbsContract, consentFactory } = require("./constants.js");

task("createCrumb", "Creates a crumb")
  .addParam("crumbid", "Desired crumb Id")
  .addParam("tokenuri", "String of JSON object to set as token URI")
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
      .createCrumb(taskArgs.crumbid, taskArgs.tokenuri);

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

task("numberOfCrumbs", "Check number of crumbs an account has")
.addParam("useraddress", "address of the users account")
.setAction(async (taskArgs) => {
  const useraccount = taskArgs.useraddress;
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    crumbsContract(),
    CR().abi,
    accounts[0],
  );

  const owner = await consentContractHandle
    .balanceOf(useraccount);
  console.log("Token balance is:", owner);
});