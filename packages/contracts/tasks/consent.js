const {
  consentContract,
  consentFactory,
  CC,
  CCFactory,
  CR,
  crumbsContract,
} = require("./constants.js");

task("checkBalanceOf", "Check balance of user").setAction(async () => {
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    consentContract(),
    CC().abi,
    accounts[0],
  );

  const owner = await consentContractHandle
    .connect(accounts[0])
    .balanceOf(accounts[1].address);
  console.log("Token balance is:", owner);
});

task(
  "createConsentContract",
  "Calls the consent factory and deploys a Consent contract",
)
  .addParam("owneraddress", "Target consent address.")
  .addParam("baseuri", "Base uri of the consent contract.")
  .addParam("name", "Name of the consent contract.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();
    const owner = taskArgs.owneraddress;
    // attach the first signer account to the consent contract handle
    const consentFactoryContractHandle = new hre.ethers.Contract(
      consentFactory(),
      CCFactory().abi,
      accounts[0],
    );

    console.log("");

    await consentFactoryContractHandle
      .connect(accounts[0])
      .createConsent(taskArgs.owneraddress, taskArgs.baseuri, taskArgs.name)
      .then((tx) => tx.wait());

    console.log("Owner of Consent deployed :", taskArgs.owneraddress);

    const deployedBeaconProxyConsentAddress = await consentFactoryContractHandle
      .connect(accounts[0])
      .contractNameToAddress(taskArgs.name);

    console.log(
      "Deployed BeaconProxy Consent address :",
      deployedBeaconProxyConsentAddress,
    );
    console.log("");
  });

task(
  "requestForData",
  "Submits a transaction to the mock consent contract to emit RequestForData event.",
)
  .addParam("consentaddress", "Target consent address.")
  .addParam(
    "owneraddressindex",
    "Index or owner address of the connected wallet to generate Signer object to sign the tx.",
  )
  .addParam("cid", "IPFS multihash of SDQL query.")
  .setAction(async (taskArgs) => {
    const multihash = taskArgs.cid;
    const accounts = await hre.ethers.getSigners();

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      taskArgs.consentaddress,
      CC().abi,
      accounts[taskArgs.owneraddressindex],
    );

    await consentContractHandle
      .connect(accounts[taskArgs.owneraddressindex])
      .requestForData(multihash)
      .then((tx) => tx.wait());

    console.log("");
    console.log("Data request was successful!");
    console.log("");
  });

task("checkConsentsDeployedByOwner", "")
  .addParam("owneraddress", "Address of data requester.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    // attach the first signer account to the consent factory contract handle
    const consentFactoryContractHandle = new hre.ethers.Contract(
      consentFactory(),
      CCFactory().abi,
      accounts[0],
    );

    // declare the filter parameters of the event of interest
    const logs = await consentFactoryContractHandle.filters.ConsentDeployed(
      taskArgs.owneraddress,
    );

    // generate log with query's results
    const _logs = await consentFactoryContractHandle.queryFilter(logs);

    // print each event's arguments
    _logs.forEach((log, index) => {
      console.log("");
      console.log("Deployment count: ", index + 1);
      console.log("  Owner address: ", log.args.owner);
      console.log(
        "  Address of the deployed Consent BeaconProxy:",
        log.args.consentAddress,
      );
    });
    console.log("");
  });

task(
  "listRequestedDataByOwner",
  "Returns a list of requested data by an address",
)
  .addParam("consentaddress", "Target consent address.")
  .addParam("owneraddress", "Address of data requester.")
  .setAction(async (taskArgs) => {
    const accounts = await hre.ethers.getSigners();

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      taskArgs.consentaddress,
      CC().abi,
      accounts[1],
    );

    // declare the filter parameters of the event of interest
    const logs = await consentContractHandle.filters.RequestForData(
      taskArgs.owneraddress,
    );

    // generate log with query's results
    const _logs = await consentContractHandle.queryFilter(logs);

    console.log("");
    console.log("Queried address:", taskArgs.consentaddress);

    // print each event's arguments
    _logs.forEach((log, index) => {
      console.log("");
      console.log("Request number: ", index + 1);
      console.log("  Owner address: ", log.args.requester);
      console.log("  Requested CID:", log.args.ipfsCID);
    });

    console.log("");
  });

// Task to revoke roles on consent contract
// As the grantRole function can only be called by the admin the specific role, pass in the index of owner address of the connected wallet
// The owner address has the DEFAULT_ADMIN_ROLE
// 0 for wallet address 1 of the mnemonic

task("grantRole", "Grant specific role on the consent contract.")
  .addParam("consentaddress", "Target consent address.")
  .addParam(
    "owneraddressindex",
    "Index or owner address of the connected wallet to generate Signer object to sign the tx.",
  )
  .addParam("address", "Address to grant role to.")
  .addParam("role", "Role to grant")
  .setAction(async (taskArgs) => {
    const roleBytes = ethers.utils.id(taskArgs.role);

    const accounts = await hre.ethers.getSigners();

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      taskArgs.consentaddress,
      CC().abi,
      accounts[taskArgs.owneraddressindex],
    );

    await consentContractHandle
      .connect(accounts[taskArgs.owneraddressindex])
      .grantRole(roleBytes, taskArgs.address);

    console.log("");
    console.log("Consent address:", taskArgs.consentaddress);
    console.log("");
    console.log(
      "Address " + taskArgs.address + " has been granted role " + taskArgs.role,
    );

    console.log("");
  });

// Task to revoke roles on consent contract
// As the revokeRole function can only be called by the admin the specific role, pass in the index of owner address of the connected wallet
// The owner address has the DEFAULT_ADMIN_ROLE
// 0 for wallet address 1 of the mnemonic

task("revokeRole", "Revokes a specific role on the consent contract.")
  .addParam("consentaddress", "Target consent address.")
  .addParam(
    "owneraddressindex",
    "Index or owner address of the connected wallet to generate Signer object to sign the tx.",
  )
  .addParam("address", "Address to grant role to.")
  .addParam("role", "Role to grant")
  .setAction(async (taskArgs) => {
    const roleBytes = ethers.utils.id(taskArgs.role);

    const accounts = await hre.ethers.getSigners();

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      taskArgs.consentaddress,
      CC().abi,
      accounts[taskArgs.owneraddressindex],
    );

    await consentContractHandle
      .connect(accounts[taskArgs.owneraddressindex])
      .revokeRole(roleBytes, taskArgs.address);

    console.log("");
    console.log("Consent address:", taskArgs.consentaddress);
    console.log("");
    console.log(
      "Address " +
        taskArgs.address +
        " has been revoked of role " +
        taskArgs.role,
    );

    console.log("");
  });
