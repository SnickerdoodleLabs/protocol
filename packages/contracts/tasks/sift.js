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

task("grantSiftVerifierRole", "Grants a role to an address")
  .addParam("grantee", "Address to grant role to")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const grantee = taskArgs.grantee;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const VERIFIER_ROLE = hre.ethers.utils.keccak256(
      hre.ethers.utils.toUtf8Bytes("VERIFIER_ROLE"),
    );

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      account,
    );

    await siftContractHandle
      .connect(accounts[0])
      .grantRole(VERIFIER_ROLE, grantee)
      .then((txresponse) => {
        return txresponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });
