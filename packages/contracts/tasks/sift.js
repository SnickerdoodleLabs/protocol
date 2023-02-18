const { SIFT, siftContract, logTXDetails } = require("./constants.js");

task("verifyEntity", "Verifies a url on the Sift contract")
  .addParam("label", "Domain to verify")
  .addParam("owner", "Address to mint the Sift token to")
  .addParam(
    "metadata",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const label = taskArgs.label;
    const owner = taskArgs.owner;
    const metadata = taskArgs.metadata;
    const accountnumber = taskArgs.accountnumber;

    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      account,
    );

    await siftContractHandle
      .verifyEntity(label, owner, metadata)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("maliciousEntity", "Sets a url as malicious on the Sift contract")
  .addParam("label", "Domain to verify")
  .addParam("owner", "Address to mint the Sift token to")
  .addParam(
    "metadata",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const label = taskArgs.label;
    const owner = taskArgs.owner;
    const metadata = taskArgs.metadata;
    const accountnumber = taskArgs.accountnumber;

    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      account,
    );

    await siftContractHandle
      .maliciousEntity(label, owner, metadata)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("checkEntity", "Checks a url on the Sift Contract")
  .addParam("label", "Domain to verify")
  .setAction(async (taskArgs) => {
    const provider = await hre.ethers.provider;
    const label = taskArgs.label;

    // attach the first signer account to the consent contract handle
    const siftContractHandle = new hre.ethers.Contract(
      siftContract(),
      SIFT().abi,
      provider,
    );

    // hardcoded array can be used when testing IP integration
    // labels = ["www.google.com", "www.facebook.com"];

    await siftContractHandle.checkEntity(label).then((result) => {
      console.log("Checked! Label " + label + " is " + result + ".");
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
