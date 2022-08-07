const { task } = require("hardhat/config.js");
const {
  logTXDetails,
  consentFactory,
  CC,
  CCFactory,
} = require("./constants.js");

task("checkBalanceOf", "Check balance of an address given a ERC721 address")
  .addParam("useraddress", "address of the users account")
  .addParam("contractaddress", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const useraccount = taskArgs.useraddress;
    const contractaddress = taskArgs.contractaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      provider
    );

    await consentContractHandle
      .balanceOf(useraccount).then((result) => {
        console.log("ERC721 balance is:", result.toString());
      });

  });

task("optIn", "Opt in to a Consent Contract")
  .addParam("contractaddress", "address of the consent contract")
  .addParam("tokenid", "token id to use for the optin token")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const contractaddress = taskArgs.contractaddress;
    const tokenid = taskArgs.tokenid;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];


    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      account
    );

    await consentContractHandle.optIn(tokenid, "")
      .then((txresponse) => {
        return txresponse.wait()
      }).then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("getTrustedForwarder", "returns the trusted forwarder address of a consent contract")
  .addParam("contractaddress", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const contractaddress = taskArgs.contractaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      provider
    );

    await consentContractHandle.trustedForwarder().then((tfAddress) => {
      console.log("Trusted Forwarder Address:", tfAddress);
    });
  });

task("setTrustedForwarder", "sets the trusted forwarder address of a consent contract")
  .addParam("contractaddress", "address of the consent contract")
  .addParam("trustedforwarder", "address to use as the trusted forwarder")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const contractaddress = taskArgs.contractaddress;
    const trustedforwarder = taskArgs.trustedforwarder;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      account
    );

    console.log("Attempting to set tf to:", trustedforwarder);
    await consentContractHandle.setTrustedForwarder(trustedforwarder)
      .then((txresponse) => {
        return txresponse.wait();
      })
      .then((txrct) => {
        return logTXDetails(txrct);
      })
      .then(() => {
        return consentContractHandle.trustedForwarder();
      })
      .then((tfAddress) => {
        console.log("New Trusted Forwarder Address:", tfAddress);
      });
  });

task("checkOwnerOf", "Check balance of user")
  .addParam("tokenid", "token to get sus on")
  .addParam("contractaddress", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const tokenid = taskArgs.tokenid;
    const contractaddress = taskArgs.contractaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      provider
    );

    await consentContractHandle.ownerOf(tokenid)
      .then((result) => {
        console.log("Token belongs to:", result)
      });
  });

task("getConsentContractDomains", "Returns list of URLs associated with a Consent Contract.")
  .addParam("address", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const address = taskArgs.address;
    const provider = await hre.ethers.provider;

    const consentContractHandle = new hre.ethers.Contract(
      address,
      CC().abi,
      provider
    );

    await consentContractHandle.getDomains()
      .then((urls) => {
        console.log("Registered URLS:", urls)
      });
  });

task("addConsentContractDomain", "Add a new URL to a Consent Contract.")
  .addParam("address", "address of the consent contract")
  .addParam("url", "URL to add to the Consent Contract")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const address = taskArgs.address;
    const url = taskArgs.url;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const consentContractHandle = new hre.ethers.Contract(
      address,
      CC().abi,
      account
    );

    consentContractHandle.addDomain(url)
      .then((txResponse) => {
        return txResponse;
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("getUserConsentContracts", "Check which constract a user has opted in to.")
  .addParam("user", "address of the user")
  .setAction(async (taskArgs) => {
    const useraddress = taskArgs.user;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractFactorHandle = new hre.ethers.Contract(
      consentFactory(),
      CCFactory().abi,
      provider
    );

    await consentContractFactorHandle
      .getUserConsentAddressesCount(useraddress)
      .then((numCCs) => {
        return consentContractFactorHandle.getUserConsentAddressesByIndex(useraddress, 0, numCCs);
      }).then((myCCs) => {
        console.log("User is opted into:", myCCs);
      });
  });

task(
  "createConsentContract",
  "Calls the consent factory and deploys a Consent contract",
)
  .addParam("owneraddress", "Target consent address.")
  .addParam("baseuri", "Base uri of the consent contract.")
  .addParam("name", "Name of the consent contract.")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const owner = taskArgs.owneraddress;
    const baseUri = taskArgs.baseuri;
    const consentContractName = taskArgs.name;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentFactoryContractHandle = new hre.ethers.Contract(
      consentFactory(),
      CCFactory().abi,
      account
    );

    console.log("");

    await consentFactoryContractHandle
      .createConsent(owner, baseUri, consentContractName)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      })
      .then(() => {
        return consentFactoryContractHandle.getUserDeployedConsentsByIndex(taskArgs.owneraddress, 0, 5);
      })
      .then((myCCs) => {
        console.log("Concent Contracts owned by this account:", myCCs)
      });
  });

task(
  "requestForData",
  "Submits a transaction to the mock consent contract to emit RequestForData event.",
)
  .addParam("consentaddress", "Target consent address.")
  .addParam("cid", "IPFS multihash of SDQL query.")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const multihash = taskArgs.cid;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      taskArgs.consentaddress,
      CC().abi,
      account
    );

    await consentContractHandle.requestForData(multihash)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      })
  });

task("checkConsentContractByRole", "")
  .addParam("owneraddress", "Address of data requester.")
  .setAction(async (taskArgs) => {
    const owneraddress = taskArgs.owneraddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent factory contract handle
    const consentFactoryContractHandle = new hre.ethers.Contract(
      consentFactory(),
      CCFactory().abi,
      provider
    );

    // Construct the Role byte arrays
    const DEFAULT_ADMIN_ROLE = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("0"));
    const PAUSER_ROLE = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("PAUSER_ROLE"));
    const SIGNER_ROLE = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("SIGNER_ROLE"));
    const REQUESTER_ROLE = hre.ethers.utils.keccak256(hre.ethers.utils.toUtf8Bytes("REQUESTER_ROLE"));

    // Query the roles
    await consentFactoryContractHandle.getUserRoleAddressesCount(owneraddress, DEFAULT_ADMIN_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(owneraddress, DEFAULT_ADMIN_ROLE, 0, DACount)
      })
      .then((DAList) => {
        console.log("DEFAULT_ADMIN_ROLE Membership:", DAList)
      })

    await consentFactoryContractHandle.getUserRoleAddressesCount(owneraddress, PAUSER_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(owneraddress, PAUSER_ROLE, 0, DACount)
      })
      .then((DAList) => {
        console.log("PAUSER_ROLE Membership:", DAList)
      })

    await consentFactoryContractHandle.getUserRoleAddressesCount(owneraddress, SIGNER_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(owneraddress, SIGNER_ROLE, 0, DACount)
      })
      .then((DAList) => {
        console.log("SIGNER_ROLE Membership:", DAList)
      })

    await consentFactoryContractHandle.getUserRoleAddressesCount(owneraddress, REQUESTER_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(owneraddress, REQUESTER_ROLE, 0, DACount)
      })
      .then((DAList) => {
        console.log("REQUESTER_ROLE Membership:", DAList)
      })
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
  .addParam("grantee", "Address to grant role to.")
  .addParam("role", "Role to grant")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const roleBytes = ethers.utils.id(taskArgs.role);
    const grantee = taskArgs.grantee;
    const consentaddress = taskArgs.consentaddress;


    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentaddress,
      CC().abi,
      account
    );

    await consentContractHandle.grantRole(roleBytes, grantee)
    .then((txResponse) => {
      return txResponse.wait();
    })
    .then((txrct) => {
      logTXDetails(txrct);
    });
  });

// Task to revoke roles on consent contract
// As the revokeRole function can only be called by the admin the specific role, pass in the index of owner address of the connected wallet
// The owner address has the DEFAULT_ADMIN_ROLE
// 0 for wallet address 1 of the mnemonic

task("revokeRole", "Revokes a specific role on the consent contract.")
  .addParam("consentaddress", "Target consent address.")
  .addParam("revokee", "Address to revoke role from.")
  .addParam("role", "Role to grant")
  .addParam("accountnumber", "integer referencing the account to you in the configured HD Wallet")
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const roleBytes = ethers.utils.id(taskArgs.role);
    const revokee = taskArgs.revokee;
    const consentaddress = taskArgs.consentaddress;


    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentaddress,
      CC().abi,
      account
    );

    await consentContractHandle.revokeRole(roleBytes, revokee)
    .then((txResponse) => {
      return txResponse.wait();
    })
    .then((txrct) => {
      logTXDetails(txrct);
    });
  });