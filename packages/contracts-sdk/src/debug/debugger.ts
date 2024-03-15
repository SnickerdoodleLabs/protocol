import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  BaseURI,
  BigNumberString,
  Commitment,
  ConsentName,
  DomainName,
  EVMAccountAddress,
  MarketplaceTag,
} from "@snickerdoodlelabs/objects";
import { ethers } from "ethers";
import { ResultUtils } from "neverthrow-result-utils";

import {
  consentAddress,
  privateKey,
  privateKey1,
  privateKey2,
  providerUrl,
} from "@contracts-sdk/debug/constants.js";
import { Contracts } from "@contracts-sdk/debug/contracts.js";
import { ConsentContract } from "@contracts-sdk/implementations/ConsentContract.js";
import {
  EConsentRoles,
  ContractOverrides,
} from "@contracts-sdk/interfaces/index.js";

console.log("providerUrl", providerUrl);

const cryptoUtils = new CryptoUtils();

// provider and signer
const provider = new ethers.JsonRpcProvider(providerUrl);
const signer = new ethers.Wallet(privateKey, provider);

const signer1 = new ethers.Wallet(privateKey1, provider);

console.log("signer.address", signer.address);
console.log("signer1.address", signer1.address);

// Initializing contracts
const contracts = new Contracts(signer, signer1, cryptoUtils);

console.log(
  "factoryContractPure.address: ",
  contracts.factoryContractPure.address,
);

const getLatestBlock = async () => {
  try {
    const latest = await provider.getBlock("latest");
    console.log("Latest block: ", latest);
  } catch (e) {
    console.log("getLatestBlock error: ", e);
  }
};

const createConsent = async () => {
  try {
    const response = await contracts.factoryContract.createConsent(
      EVMAccountAddress(signer.address),
      BaseURI("base1"),
    );
    console.log("createConsent response: ", response);
  } catch (e) {
    console.log("createConsent e: ", e);
  }
};

const getUserDeployedConsents = async () => {
  try {
    const response = await contracts.factoryContract.getUserDeployedConsents(
      EVMAccountAddress(signer.address),
    );
    console.log("getUserDeployedConsents response: ", response);
  } catch (e) {
    console.log("getUserDeployedConsents e: ", e);
  }
};

const getUserDeployedConsentsCount = async () => {
  try {
    const response =
      await contracts.factoryContract.getUserDeployedConsentsCount(
        EVMAccountAddress(signer.address),
      );
    console.log("getUserDeployedConsentsCount response: ", response);
  } catch (e) {
    console.log("getUserDeployedConsentsCount e: ", e);
  }
};

const createConsentPure = async () => {
  try {
    const tx = await contracts.factoryContractPure.createConsent(
      "0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7",
      "baseuri1",
      "name1",
    );

    const txrcpt = await tx.wait();
    console.log("txrcpt: ", txrcpt);
  } catch (err) {
    console.log("errerrerr: ", err);
  }
};

const getUserDeployedConsentsCountPure = async () => {
  try {
    const tx = await contracts.factoryContractPure.getUserDeployedConsentsCount(
      "0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7",
    );

    console.log("tx", tx);
  } catch (err) {
    console.log("errerrerr: ", err);
  }
};

const addDomain = async () => {
  try {
    const response = await contracts.consentContract.addDomain(
      DomainName("snickerdoodle.com"),
      // {
      //   nonce: 100, // Should be way too high
      // } as ContractOverrides,
    );
    console.log("addDomain response: ", response);
  } catch (e) {
    console.log("addDomain e: ", e);
  }
};

const getDomains = async () => {
  try {
    const response = await contracts.consentContract.getDomains();
    console.log("getDomain response: ", response);
  } catch (e) {
    console.log("getDomain e: ", e);
  }
};

const setBaseUri = async () => {
  await contracts.consentContractNoPerms
    .setBaseURI(BaseURI("base2"))
    .map((transaction) => {
      console.log("setBaseURI response: ", transaction);
    })
    .mapErr((e) => {
      console.log("setBaseURI e: ", e);
    });
};

async function getBaseUri() {
  await contracts.consentContract
    .baseURI()
    .map((baseUri) => {
      console.log("getBaseURI response: ", baseUri);
    })
    .mapErr((e) => {
      console.log("getBaseURI e: ", e);
    });
}

async function grantRole(
  role: EConsentRoles = EConsentRoles.DEFAULT_ADMIN_ROLE,
) {
  await contracts.consentContract
    .grantRole(role, EVMAccountAddress(signer1.address))
    .map((transaction) => {
      console.log("grantRole response: ", transaction);
    })
    .mapErr((e) => {
      console.log("grantRole e: ", e);
    });
}

async function renounceRole(
  role: EConsentRoles = EConsentRoles.DEFAULT_ADMIN_ROLE,
) {
  await contracts.consentContractNoPerms
    .renounceRole(role, EVMAccountAddress(signer1.address))
    .map((transaction) => {
      console.log("renounceRole response: ", transaction);
    })
    .mapErr((e) => {
      console.log("renounceRole e: ", e);
    });
}

const totalSupply = async () => {
  try {
    const response = await contracts.consentContract.totalSupply();
    console.log("totalSupply response: ", response);
  } catch (e) {
    console.log("totalSupply e: ", e);
  }
};

// const testContract = async (contractAddress1: string) => {
//   try {
//     const response = await provider.getCode(contractAddress1);
//     console.log("testContract response: ", response);
//     console.log("bytecode matched: ", response == CrumbsContractAbi.bytecode);
//     console.log(
//       "deployedBytecode matched: ",
//       response == CrumbsContractAbi.deployedBytecode,
//     );
//   } catch (e) {
//     console.log("testContract e: ", e);
//   }
// };

const newGlobalTag = async () => {
  try {
    const tx = await contracts.consentContract.newGlobalTag(
      "tag2",
      BigNumberString("5"),
    );

    console.log("checkEntityPure res: ", tx);
  } catch (err) {
    console.log("checkEntityPure err: ", err);
  }
};

const getTagArray = async () => {
  try {
    const tx = await contracts.consentContract3.getTagArray();

    console.log("getTagArray res: ", tx);
  } catch (err) {
    console.log("getTagArray err: ", err);
  }
};

const getNumberOfStakedTags = async () => {
  try {
    const tx = await contracts.consentContract2.getNumberOfStakedTags();

    console.log("getNumberOfStakedTags res: ", tx);
  } catch (err) {
    console.log("getNumberOfStakedTags err: ", err);
  }
};

const removeListing = async () => {
  try {
    const tx = await contracts.consentContract.removeListing("tag1");

    console.log("removeListing res: ", tx);
  } catch (err) {
    console.log("removeListing err: ", err);
  }
};

const newLocalTagUpstream = async () => {
  try {
    const tx = await contracts.consentContract2.newLocalTagUpstream(
      "tag2",
      BigNumberString("6"),
      BigNumberString("5"),
    );

    console.log("newLocalTagUpstream1 res: ", tx);
  } catch (err) {
    console.log("newLocalTagUpstream1 err: ", err);
  }

  try {
    const tx2 = await contracts.consentContract3.newLocalTagUpstream(
      "tag2",
      BigNumberString("7"),
      BigNumberString("6"),
    );

    console.log("newLocalTagUpstream2 res: ", tx2);
  } catch (err) {
    console.log("newLocalTagUpstream2 err: ", err);
  }
};

const newLocalTagDownstream = async () => {
  try {
    const tx = await contracts.consentContract3.newLocalTagDownstream(
      "tag1",
      BigNumberString("7"),
      BigNumberString("4"),
    );

    console.log("newLocalTagDownstream res: ", tx);
  } catch (err) {
    console.log("newLocalTagDownstream err: ", err);
  }
};

const replaceExpiredListing = async () => {
  try {
    const tx = await contracts.consentContract.replaceExpiredListing(
      "tag1",
      BigNumberString("5"),
    );

    console.log("replaceExpiredListing res: ", tx);
  } catch (err) {
    console.log("replaceExpiredListing err: ", err);
  }
};

const getListingDetail = async () => {
  try {
    //BigNumberString(ethers.constants.MaxUint256.toString())
    const tx = await contracts.factoryContract.getListingDetail(
      MarketplaceTag("tag2"),
      BigNumberString(ethers.MaxUint256.toString()),
    );

    console.log("getListingDetail res: ", tx);
  } catch (err) {
    console.log("getListingDetail err: ", err);
  }
};

const getTagTotal = async () => {
  try {
    const tx = await contracts.factoryContract.getTagTotal(
      MarketplaceTag("tag2"),
    );

    console.log("getTagTotal res: ", tx);
  } catch (err) {
    console.log("getTagTotal err: ", err);
  }
};

const getListingsForward = async () => {
  try {
    const tx = await contracts.factoryContract.getListingsForward(
      MarketplaceTag("tag2"),
      BigNumberString("7"),
      3,
      true,
    );

    console.log("getListingsForward res: ", tx);
  } catch (err) {
    console.log("getListingsForward err: ", err);
  }
};

const getListingsBackward = async () => {
  try {
    const tx = await contracts.factoryContract.getListingsBackward(
      MarketplaceTag("tag2"),
      BigNumberString("5"),
      6,
      true,
    );

    console.log("getListingsBackward res: ", tx);
  } catch (err) {
    console.log("getListingsBackward err: ", err);
  }
};

const sendFunds = async () => {
  const tx = {
    //to: "0xF0CE81C1832B8eb87179Ee578c360b528BcFB3E8",
    to: signer1.address,
    value: ethers.parseEther((100).toString()),
  };
  try {
    const transaction = await signer.sendTransaction(tx);
    console.log("sendFunds transaction: ", transaction);
  } catch (e) {
    console.error("sendFunds error: ", e);
  }
};

const addDomainList = async () => {
  const listOfDomains = [DomainName("domain5"), DomainName("domain6")];
  return ResultUtils.executeSerially(
    listOfDomains.map((domain) => {
      return () => contracts.consentContract.addDomain(domain);
    }),
  )
    .map((val) => {
      console.log("val: ", val);
    })
    .mapErr((e) => {
      console.log("addDomain e: ", e);
    });
};

const removeDomainList = async () => {
  const listOfDomains = [DomainName("dsfds.com")];
  return ResultUtils.executeSerially(
    listOfDomains.map((domain) => {
      return () => contracts.consentContract.removeDomain(domain);
    }),
  )
    .map((val) => {
      console.log("val: ", val);
    })
    .mapErr((e) => {
      console.log("removeDomain e: ", e);
    });
};

const listTransferEvents = async () => {
  try {
    const eventFilter = contracts.consentContract.filters.Transfer(null, null);
    const logsEvents = await contracts.consentContract.queryFilter(eventFilter);

    logsEvents._unsafeUnwrap().forEach((logEvent) => {
      //console.log('logEvent: ', logEvent);
      console.log(" logEvent.args[3]: ", logEvent?.blockNumber);
      //console.log(' logEvent.args[4]: ',  (logEvent as any)?.args );
    });
  } catch (err) {
    console.log("listTransferEvents err: ", err);
  }
};

const tempOptIn = async () => {
  try {
    const tempSigner = new ethers.Wallet(privateKey2 as any, provider);

    const tempConsentContract = new ConsentContract(
      tempSigner,
      consentAddress,
      cryptoUtils,
    );

    const response = await tempConsentContract.optIn(Commitment(3n));
    console.log("optIn response: ", response);
  } catch (e) {
    console.log("optIn e: ", e);
  }
};

const init = async () => {
  console.log("Initializing...");
  await getLatestBlock();
  // await createConsent();
  // await sendFunds();
  // await renounceRole();
  await grantRole();
  // await getBaseUri();
  // await setBaseUri();
  // await getBaseUri();
  //getUserDeployedConsents();
  //createConsentPure();
  //getUserDeployedConsentsCount();
  //getUserDeployedConsentsCountPure();
  //getDomains();
  // await addDomain();
  //addDomainList();
  //removeDomainList();
  //getConsentTokensOfAddress();
  //optIn();
  //getBaseUri();
  //totalSupply();
  //listingsTotal();
  //testContract(crumbsContractAddress);
  //tempOptIn();
  //listTransferEvents();
  //tempOptOut();
};

await init();
