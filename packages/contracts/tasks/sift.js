const { SIFT, siftContract } = require("./constants.js");

task("verifyURL", "Verifies a url on the Sift contract")
  .addParam("url", "Domain to verify")
  .addParam("owner", "Address to mint the Sift token to")
  .addParam(
    "owneraddressindex",
    "Index or owner address of the connected wallet to generate Signer object to sign the tx.",
  )
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const signingAccount = accounts[taskArgs.owneraddressindex];

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      signingAccount,
    );

    await siftContractHandle
      .connect(signingAccount)
      .verifyURL(taskArgs.url, taskArgs.owner);

    console.log("");
    console.log(
      "Success! URL " +
        taskArgs.url +
        " is now set as VERIFIED on the Sift Contract.",
    );
    console.log("");
  });

task("maliciousURL", "Sets a url as malicious on the Sift contract")
  .addParam("url", "Domain to set as malicious")
  .addParam("owner", "Address to mint the Sift token to")
  .addParam(
    "owneraddressindex",
    "Index or owner address of the connected wallet to generate Signer object to sign the tx.",
  )
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    const signingAccount = accounts[taskArgs.owneraddressindex];

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      signingAccount,
    );

    await siftContractHandle
      .connect(signingAccount)
      .maliciousURL(taskArgs.url, taskArgs.owner);

    console.log("");
    console.log(
      "Success! URL " +
        taskArgs.url +
        " is now marked as MALICIOUS on the Sift Contract.",
    );
    console.log("");
  });

task("checkURL", "Checks a url on the Sift Contract")
  .addParam("url", "Domain to check")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      accounts[0],
    );

    const result = await siftContractHandle.checkURL(taskArgs.url);

    console.log("");
    console.log("Checked! URL " + taskArgs.url + " is " + result + ".");
    console.log("");
  });
