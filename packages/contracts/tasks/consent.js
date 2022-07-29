const { task } = require("hardhat/config.js");
const {
  consentContract,
  consentFactory,
  CC,
  CCFactory,
} = require("./constants.js");

task("checkBalanceOf", "Check balance of user")
.addParam("useraddress", "address of the users account")
.addParam("contractaddress", "address of the consent contract")
.setAction(async (taskArgs) => {
  const useraccount = taskArgs.useraddress;
  const contractaddress = taskArgs.contractaddress;
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    contractaddress,
    CC().abi,
    accounts[0],
  );

  const owner = await consentContractHandle
    .balanceOf(useraccount);
  console.log("Token balance is:", owner);
});

task("optIn", "Opt in to a consent contract")
.addParam("contractaddress", "address of the consent contract")
.addParam("tokenid", "token id to use for the optin token")
.setAction(async (taskArgs) => {
  const contractaddress = taskArgs.contractaddress;
  const tokenid = taskArgs.tokenid;
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    contractaddress,
    CC().abi,
    accounts[0],
  );

  const txrct = await consentContractHandle.optIn(tokenid, "www.uri.com/1");
  console.log(txrct);
});

task("getTrustedForwarder", "returns the trusted forwarder address of a consent contract")
.addParam("contractaddress", "address of the consent contract")
.setAction(async (taskArgs) => {
  const contractaddress = taskArgs.contractaddress;
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    contractaddress,
    CC().abi,
    accounts[0],
  );

  const tf = await consentContractHandle.trustedForwarder();
  console.log("The Trusted Forwarder address is:", tf);
});

task("setTrustedForwarder", "sets the trusted forwarder address of a consent contract")
.addParam("contractaddress", "address of the consent contract")
.addParam("trustedforwarder", "address to use as the trusted forwarder")
.setAction(async (taskArgs) => {
  const contractaddress = taskArgs.contractaddress;
  const trustedforwarder = taskArgs.trustedforwarder;
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    contractaddress,
    CC().abi,
    accounts[0],
  );

  console.log("Attempting to set tf to:", trustedforwarder);
  const txrct = await consentContractHandle.setTrustedForwarder(trustedforwarder);
  const tf = await consentContractHandle.trustedForwarder();
  console.log("The Trusted Forwarder address is:", tf);
});

task("checkOwnerOf", "Check balance of user")
.addParam("tokenid", "token to get sus on")
.addParam("contractaddress", "address of the consent contract")
.setAction(async (taskArgs) => {
  const tokenid = taskArgs.tokenid;
  const contractaddress = taskArgs.contractaddress;
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    contractaddress,
    CC().abi,
    accounts[0],
  );

  const owner = await consentContractHandle
    .connect(accounts[0])
    .ownerOf(tokenid);
  console.log("Token belongs to:", owner);
});

task("getUserConsentContracts", "Check which constract a user has opted in to.")
.addParam("user", "address of the user")
.setAction(async (taskArgs) => {
  const useraddress = taskArgs.user;
  const accounts = await hre.ethers.getSigners();

  // attach the first signer account to the consent contract handle
  const consentContractFactorHandle = new hre.ethers.Contract(
    consentFactory(),
    CCFactory().abi,
    accounts[0],
  );

  const numCCs = await consentContractFactorHandle
  .connect(accounts[0])
  .getUserConsentAddressesCount(useraddress);
  console.log("User has this many CCs:", numCCs)

  const myCCs = await consentContractFactorHandle
  .connect(accounts[0])
  .getUserConsentAddressesByIndex(useraddress, 0, numCCs);
  console.log(myCCs);
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
      .getUserDeployedConsentsByIndex(taskArgs.owneraddress, 0, 5);

    console.log(
      "Deployed BeaconProxy Consent address :",
      deployedBeaconProxyConsentAddress[0],
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
      accounts[3],
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

task(
  "listRequestedDataByCIDHex",
  "Returns a list of requested data by an address",
)
  .addParam("consentaddress", "Target consent address.")
  .addParam("cidhex", "Keccak256 hash of IPFS CID")
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
      null,
      taskArgs.cidhex,
    );

    // generate log with query's results
    const _logs = await consentContractHandle.queryFilter(logs);

    console.log(_logs);

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

task("getConsentTokens", "").setAction(async (taskArgs) => {
  const accounts = await hre.ethers.getSigners();

  const consentContractHandle = new hre.ethers.Contract(
    consentContract(),
    CC().abi,
    accounts[1],
  );

  const numberOfTokens = await consentContractHandle.balanceOf(
    accounts[1].address,
  );

  console.log("Token balance is:", numberOfTokens);
  console.log("accounts[1].address", accounts[1].address);

  console.log(taskArgs.owneraddress);
  // declare the filter parameters of the event of interest
  const logs = await consentContractHandle.filters.Transfer(
    null,
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  );

  console.log("logs", logs);

  // generate log with query's results
  const _logs = await consentContractHandle.queryFilter(logs);

  for (let index = 0; index < _logs.length; index++) {
    const element = _logs[index];
    console.log("element: ", element);
    console.log("");
    console.log("index: ", index);
    console.log("tokenId: ", element.args.tokenId);

    const tokenURI = await consentContractHandle.tokenURI(element.args.tokenId);
    console.log("tokenURI: ", index, "   ", tokenURI);
    console.log("");
  }
});