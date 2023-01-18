const { task } = require("hardhat/config.js");

const {
  logTXDetails,
  consentBeacon,
  consentFactory,
  BEACON,
  CC,
  CCFactory,
} = require("./constants.js");

task(
  "getConsentBeacon",
  "Check the address of the Consent Contract Beacon implementation.",
).setAction(async () => {
  const provider = await hre.ethers.provider;

  // attach the first signer account to the consent contract handle
  const factoryHandle = new hre.ethers.Contract(
    consentFactory(),
    CCFactory().abi,
    provider,
  );
  let beaconHandle;
  await factoryHandle
    .beaconAddress()
    .then((beacon) => {
      console.log("Beacon address is:", beacon);
      return beacon;
    })
    .then((beacon) => {
      beaconHandle = new hre.ethers.Contract(beacon, BEACON().abi, provider);
      return beaconHandle.implementation();
    })
    .then((implementation) => {
      console.log("Implementation address is:", implementation);
      return beaconHandle.owner();
    })
    .then((beaconOwner) => {
      console.log("Beacon Owner is:", beaconOwner);
    });
});

task(
  "setConsentImplementation",
  "Set a new address for the UpgradableBeacon implementation.",
)
  .addParam("implementation", "address of the implementation")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const implementation = taskArgs.implementation;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const beaconHandle = new hre.ethers.Contract(
      consentBeacon(),
      BEACON().abi,
      account,
    );

    await beaconHandle
      .upgradeTo(implementation)
      .then((txresponse) => {
        return txresponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task(
  "getQueryHorizon",
  "Check the blocknumber of the consent contracts query horizon",
)
  .addParam("contractaddress", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const contractaddress = taskArgs.contractaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      provider,
    );

    await consentContractHandle.queryHorizon().then((queryHorizon) => {
      console.log("Query Horizon is:", queryHorizon.toString());
    });
  });

task(
  "getMarketplaceListings",
  "Get CIDs containing marketplace listing content",
)
  .addParam("howmany", "how many listings to return")
  .setAction(async (taskArgs) => {
    const howmany = taskArgs.howmany;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractFactorHandle = new hre.ethers.Contract(
      consentFactory(),
      CCFactory().abi,
      provider,
    );

    await consentContractFactorHandle
      .listingsHead()
      .then((listingsHead) => {
        return consentContractFactorHandle.getListings(listingsHead, howmany);
      })
      .then((output) => {
        console.log("CIDs", output[0]);
        console.log("Next Active Listing:", output[1].toNumber());
      });
  });

task(
  "setQueryHorizon",
  "Set the blocknumber of the consent contracts query horizon",
)
  .addParam(
    "blocknumber",
    "The earliest block number to check for requestForData events",
  )
  .addParam("contractaddress", "address of the consent contract")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const blocknumber = taskArgs.blocknumber;
    const contractaddress = taskArgs.contractaddress;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      account,
    );

    await consentContractHandle
      .setQueryHorizon(blocknumber)
      .then((txresponse) => {
        return txresponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("setMaxCapacity", "Set the enrollement capacity of the consent contracts.")
  .addParam(
    "capacity",
    "Integer value for the maximum number of consent tokens to be issued.",
  )
  .addParam("contractaddress", "address of the consent contract")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const capacity = taskArgs.capacity;
    const contractaddress = taskArgs.contractaddress;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      account,
    );

    await consentContractHandle
      .updateMaxCapacity(capacity)
      .then((txresponse) => {
        return txresponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

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
      provider,
    );

    await consentContractHandle.balanceOf(useraccount).then((result) => {
      console.log("ERC721 balance is:", result.toString());
    });
  });

task("getBaseURI", "Check the baseURI parameter of a consent contract")
  .addParam("contractaddress", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const contractaddress = taskArgs.contractaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      provider,
    );

    await consentContractHandle.baseURI().then((baseURI) => {
      console.log("baseURI is:", baseURI);
    });
  });

task("getMaxCapacity", "Check the maxCapacity parameter of a consent contract")
  .addParam("contractaddress", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const contractaddress = taskArgs.contractaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      provider,
    );

    await consentContractHandle.maxCapacity().then((maxCapacity) => {
      console.log("Max Capcity is:", maxCapacity.toString());
    });
  });

task("getOpenOptInDisabled", "Returns the status of the openOptInDisabled flag")
  .addParam("contractaddress", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const contractaddress = taskArgs.contractaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      contractaddress,
      CC().abi,
      provider,
    );

    await consentContractHandle.openOptInDisabled().then((optInStatus) => {
      console.log("openOptInDisabled:", optInStatus);
    });
  });

task("optIn", "Opt in to a Consent Contract")
  .addParam("contractaddress", "address of the consent contract")
  .addParam("tokenid", "token id to use for the optin token")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
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
      account,
    );

    await consentContractHandle
      .optIn(tokenid, "")
      .then((txresponse) => {
        return txresponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("optOut", "Opt in to a Consent Contract")
  .addParam("contractaddress", "address of the consent contract")
  .addParam("tokenid", "token id to use for the optin token")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
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
      account,
    );

    await consentContractHandle
      .optOut(tokenid)
      .then((txresponse) => {
        return txresponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task(
  "getTrustedForwarder",
  "returns the trusted forwarder address of a consent contract",
).setAction(async (taskArgs) => {
  const provider = await hre.ethers.provider;

  // attach the first signer account to the consent contract handle
  const consentContractHandle = new hre.ethers.Contract(
    consentFactory(),
    CCFactory().abi,
    provider,
  );

  await consentContractHandle.trustedForwarder().then((tfAddress) => {
    console.log("Trusted Forwarder Address:", tfAddress);
  });
});

task(
  "setTrustedForwarder",
  "sets the trusted forwarder address of a consent contract",
)
  .addParam("contractaddress", "address of the consent contract")
  .addParam("trustedforwarder", "address to use as the trusted forwarder")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
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
      account,
    );

    console.log("Attempting to set tf to:", trustedforwarder);
    await consentContractHandle
      .setTrustedForwarder(trustedforwarder)
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
      provider,
    );

    await consentContractHandle.ownerOf(tokenid).then((result) => {
      console.log("Token belongs to:", result);
    });
  });

task(
  "getConsentContractDomains",
  "Returns list of URLs associated with a Consent Contract.",
)
  .addParam("address", "address of the consent contract")
  .setAction(async (taskArgs) => {
    const address = taskArgs.address;
    const provider = await hre.ethers.provider;

    const consentContractHandle = new hre.ethers.Contract(
      address,
      CC().abi,
      provider,
    );

    await consentContractHandle.getDomains().then((urls) => {
      console.log("Registered URLS:", urls);
    });
  });

task("addConsentContractDomain", "Add a new URL to a Consent Contract.")
  .addParam("address", "address of the consent contract")
  .addParam("url", "URL to add to the Consent Contract")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const address = taskArgs.address;
    const url = taskArgs.url;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const consentContractHandle = new hre.ethers.Contract(
      address,
      CC().abi,
      account,
    );

    console.log("Is this doing anything?");

    await consentContractHandle
      .addDomain(url)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task(
  "stakeNewGlobalTag",
  "Initialize a new global tag and stake a marketplace listing under it",
)
  .addParam("consentcontract", "address of the target consent contract")
  .addParam("newtag", "Human-readable string for the new tag.")
  .addParam("newslot", "Integer number for the new marketplace stake amount.")
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const consentcontract = taskArgs.consentcontract;
    const newslot = taskArgs.newslot;
    const newtag = taskArgs.newtag;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentcontract,
      CC().abi,
      account,
    );

    await consentContractHandle
      .newGlobalTag(newtag, newslot)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task(
  "stakeNewLocalTagUpstream",
  "Initialize a new local tag and stake a marketplace listing above an existing listing",
)
  .addParam("consentcontract", "address of the target consent contract")
  .addParam("tag", "Human-readable string for the tag.")
  .addParam("newslot", "Integer number for the new marketplace stake amount.")
  .addParam(
    "existingslot",
    "Integer number for the new marketplace stake amount.",
  )
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const consentcontract = taskArgs.consentcontract;
    const newslot = taskArgs.newslot;
    const existingslot = taskArgs.existingslot;
    const tag = taskArgs.tag;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentcontract,
      CC().abi,
      account,
    );

    await consentContractHandle
      .newLocalTagUpstream(tag, newslot, existingslot)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task(
  "stakeNewLocalTagDownstream",
  "Initialize a new local tag and stake a marketplace listing below an existing listing",
)
  .addParam("consentcontract", "address of the target consent contract")
  .addParam("tag", "Human-readable string for the tag.")
  .addParam("newslot", "Integer number for the new marketplace stake amount.")
  .addParam(
    "existingslot",
    "Integer number for the new marketplace stake amount.",
  )
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const consentcontract = taskArgs.consentcontract;
    const newslot = taskArgs.newslot;
    const existingslot = taskArgs.existingslot;
    const tag = taskArgs.tag;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentcontract,
      CC().abi,
      account,
    );

    await consentContractHandle
      .newLocalTagDownstream(tag, existingslot, newslot)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task(
  "replaceExpiredListing",
  "Replace an expired listing at a given stake value",
)
  .addParam("consentcontract", "address of the target consent contract")
  .addParam("tag", "Human-readable string for the existing tag.")
  .addParam("slot", "Integer number for the expired marketplace stake amount.")
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const consentcontract = taskArgs.consentcontract;
    const slot = taskArgs.slot;
    const tag = taskArgs.tag;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentcontract,
      CC().abi,
      account,
    );

    await consentContractHandle
      .replaceExpiredListing(tag, slot)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });

task("removeListing", "Remove a listing under the given tag")
  .addParam("consentcontract", "address of the target consent contract")
  .addParam(
    "tag",
    "Human-readable string representing tag to remove from the target contract.",
  )
  .addParam(
    "accountnumber",
    "integer referencing the account to use in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const consentcontract = taskArgs.consentcontract;
    const slot = taskArgs.slot;
    const tag = taskArgs.tag;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentcontract,
      CC().abi,
      account,
    );

    await consentContractHandle
      .removeListing(tag)
      .then((txResponse) => {
        return txResponse.wait();
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
      provider,
    );

    await consentContractFactorHandle
      .getUserConsentAddressesCount(useraddress)
      .then((numCCs) => {
        return consentContractFactorHandle.getUserConsentAddressesByIndex(
          useraddress,
          0,
          numCCs,
        );
      })
      .then((myCCs) => {
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
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
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
      account,
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
        return consentFactoryContractHandle.getUserDeployedConsentsByIndex(
          taskArgs.owneraddress,
          0,
          5,
        );
      })
      .then((myCCs) => {
        console.log("Concent Contracts owned by this account:", myCCs);
      });
  });

task(
  "requestForData",
  "Submits a transaction to the mock consent contract to emit RequestForData event.",
)
  .addParam("consentaddress", "Target consent address.")
  .addParam("cid", "IPFS multihash of SDQL query.")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const multihash = taskArgs.cid;
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      taskArgs.consentaddress,
      CC().abi,
      account,
    );

    await consentContractHandle
      .requestForData(multihash)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
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
      provider,
    );

    // Construct the Role byte arrays
    const DEFAULT_ADMIN_ROLE = hre.ethers.utils.keccak256(
      hre.ethers.utils.toUtf8Bytes("0"),
    );
    const PAUSER_ROLE = hre.ethers.utils.keccak256(
      hre.ethers.utils.toUtf8Bytes("PAUSER_ROLE"),
    );
    const SIGNER_ROLE = hre.ethers.utils.keccak256(
      hre.ethers.utils.toUtf8Bytes("SIGNER_ROLE"),
    );
    const REQUESTER_ROLE = hre.ethers.utils.keccak256(
      hre.ethers.utils.toUtf8Bytes("REQUESTER_ROLE"),
    );

    // Query the roles
    await consentFactoryContractHandle
      .getUserRoleAddressesCount(owneraddress, DEFAULT_ADMIN_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(
          owneraddress,
          DEFAULT_ADMIN_ROLE,
          0,
          DACount,
        );
      })
      .then((DAList) => {
        console.log("DEFAULT_ADMIN_ROLE Membership:", DAList);
      });

    await consentFactoryContractHandle
      .getUserRoleAddressesCount(owneraddress, PAUSER_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(
          owneraddress,
          PAUSER_ROLE,
          0,
          DACount,
        );
      })
      .then((DAList) => {
        console.log("PAUSER_ROLE Membership:", DAList);
      });

    await consentFactoryContractHandle
      .getUserRoleAddressesCount(owneraddress, SIGNER_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(
          owneraddress,
          SIGNER_ROLE,
          0,
          DACount,
        );
      })
      .then((DAList) => {
        console.log("SIGNER_ROLE Membership:", DAList);
      });

    await consentFactoryContractHandle
      .getUserRoleAddressesCount(owneraddress, REQUESTER_ROLE)
      .then((DACount) => {
        return consentFactoryContractHandle.getUserRoleAddressesCountByIndex(
          owneraddress,
          REQUESTER_ROLE,
          0,
          DACount,
        );
      })
      .then((DAList) => {
        console.log("REQUESTER_ROLE Membership:", DAList);
      });
  });

task(
  "listRequestedDataByOwner",
  "Returns a list of requested data by an address",
)
  .addParam("consentaddress", "Target consent address.")
  .setAction(async (taskArgs) => {
    const consentAddress = taskArgs.consentaddress;
    const provider = await hre.ethers.provider;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      taskArgs.consentaddress,
      CC().abi,
      provider,
    );

    // get the queryHorizon
    const qh = await consentContractHandle.queryHorizon();
    console.log("Query Horizon Block is:", qh.toNumber());

    // declare the filter parameters of the event of interest
    const filter = await consentContractHandle.filters.RequestForData();

    await consentContractHandle
      .queryFilter(filter, qh.toNumber(), "latest")
      .then((result) => {
        console.log("");
        console.log("Queried address:", consentAddress);
        // print each event's arguments
        result.forEach((log, index) => {
          console.log("");
          console.log("Request number: ", index + 1);
          console.log("  Owner address: ", log.args.requester);
          console.log("  Requested CID:", log.args.ipfsCID);
        });
        console.log("");
      });
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
    const filter = await consentContractHandle.filters.RequestForData(
      null,
      taskArgs.cidhex,
    );

    // generate log with query's results
    await consentContractHandle.queryFilter(filter).then((result) => {
      console.log(result);

      console.log("");
      console.log("Queried address:", taskArgs.consentaddress);

      // print each event's arguments
      result.forEach((log, index) => {
        console.log("");
        console.log("Request number: ", index + 1);
        console.log("  Owner address: ", log.args.requester);
        console.log("  Requested CID:", log.args.ipfsCID);
      });

      console.log("");
    });
  });

// Task to revoke roles on consent contract
// As the grantRole function can only be called by the admin the specific role, pass in the index of owner address of the connected wallet
// The owner address has the DEFAULT_ADMIN_ROLE
// 0 for wallet address 1 of the mnemonic

task("grantRole", "Grant specific role on the consent contract.")
  .addParam("consentaddress", "Target consent address.")
  .addParam("grantee", "Address to grant role to.")
  .addParam("role", "Role to grant")
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const roleBytes = ethers.utils.id(taskArgs.role);
    const grantee = taskArgs.grantee;
    const consentaddress = taskArgs.consentaddress;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentaddress,
      CC().abi,
      account,
    );

    await consentContractHandle
      .grantRole(roleBytes, grantee)
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
  .addParam(
    "accountnumber",
    "integer referencing the account to you in the configured HD Wallet",
  )
  .setAction(async (taskArgs) => {
    const accountnumber = taskArgs.accountnumber;
    const accounts = await hre.ethers.getSigners();
    const account = accounts[accountnumber];

    const roleBytes = ethers.utils.id(taskArgs.role);
    const revokee = taskArgs.revokee;
    const consentaddress = taskArgs.consentaddress;

    // attach the first signer account to the consent contract handle
    const consentContractHandle = new hre.ethers.Contract(
      consentaddress,
      CC().abi,
      account,
    );

    await consentContractHandle
      .revokeRole(roleBytes, revokee)
      .then((txResponse) => {
        return txResponse.wait();
      })
      .then((txrct) => {
        logTXDetails(txrct);
      });
  });
