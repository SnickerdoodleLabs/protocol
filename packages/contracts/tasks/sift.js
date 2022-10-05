const { SIFT, siftContract, logTXDetails } = require("./constants.js");

task("verifyURL", "Verifies a url on the Sift contract")
  .addParam("url", "Domain to verify")
  .addParam("owner", "Address to mint the Sift token to")
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const url = taskArgs.url;
    const urlOwner = taskArgs.owner;

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      account,
    );

    await siftContractHandle
      .verifyURL(url, urlOwner)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("maliciousURL", "Sets a url as malicious on the Sift contract")
  .addParam("url", "Domain to set as malicious")
  .addParam("owner", "Address to mint the Sift token to")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const url = taskArgs.url;
    const urlOwner = taskArgs.owner;

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      account,
    );

    await siftContractHandle
      .maliciousURL(url, urlOwner)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("checkURL", "Checks a url on the Sift Contract")
  .addParam("url", "Domain to check")
  .setAction(async (taskArgs) => {
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      provider,
    );

    await siftContractHandle.checkURL(taskArgs.url).then((result) => {
      console.log("Checked! URL " + taskArgs.url + " is " + result + ".");
    });
  });

task("grantRoleSift", "Grants a role to an address")
  .addParam("role", "Role to be granted in keccak256")
  .addParam("address", "Address to grant role to")
  .setAction(async (taskArgs) => {
    const provider = await hre.ethers.provider;

    const accounts = await hre.ethers.getSigners();

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      provider,
    );

    await siftContractHandle
      .connect(accounts[0])
      .grantRole(taskArgs.role, taskArgs.address)
      .then((result) => {
        console.log("Role " + taskArgs.role + "granted to" + taskArgs.address);
      });
  });
