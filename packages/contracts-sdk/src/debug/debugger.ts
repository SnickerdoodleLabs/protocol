import "reflect-metadata";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  BaseURI,
  BigNumberString,
  Commitment,
  DomainName,
  ED25519PublicKey,
  EFarcasterKeyState,
  EVMAccountAddress,
  EVMContractAddress,
  FarcasterAddSignature,
  FarcasterEncodedSignedKeyRequestMetadata,
  FarcasterUserId,
  MarketplaceTag,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import { ethers, getBytes } from "ethers";
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
import { ERC20RewardContract } from "@contracts-sdk/implementations/ERC20RewardContract.js";
import { FarcasterIdRegistryContract } from "@contracts-sdk/implementations/farcaster/FarcasterIdRegistryContract.js";
import { FarcasterKeyGatewayContract } from "@contracts-sdk/implementations/farcaster/FarcasterKeyGatewayContract.js";
import { FarcasterKeyRegistryContract } from "@contracts-sdk/implementations/farcaster/FarcasterKeyRegistryContract.js";
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
//console.log("signer1.address", signer1.address);

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

const checkDomain = async () => {
  try {
    const response = await contracts.consentContract.checkDomain(
      DomainName("test.com"),
    );
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
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
      BigNumberString("6"),
      BigNumberString("5"),
    );

    console.log("checkEntityPure res: ", tx);
  } catch (err) {
    console.log("checkEntityPure err: ", err);
  }
};

const getTagArray = async () => {
  try {
    const tx = await contracts.consentContract3.getTagArray(
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"),
    );

    console.log("getTagArray res: ", tx);
  } catch (err) {
    console.log("getTagArray err: ", err);
  }
};

const getNumberOfStakedTags = async () => {
  try {
    const tx = await contracts.consentContract2.getNumberOfStakedTags(
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"),
    );

    console.log("getNumberOfStakedTags res: ", tx);
  } catch (err) {
    console.log("getNumberOfStakedTags err: ", err);
  }
};

const removeListing = async () => {
  try {
    const tx = await contracts.consentContract.removeListing(
      "tag1",
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
    );

    console.log("removeListing res: ", tx);
  } catch (err) {
    console.log("removeListing err: ", err);
  }
};

const newLocalTagUpstream = async () => {
  try {
    const tx = await contracts.consentContract2.newLocalTagUpstream(
      "tag2",
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
      BigNumberString("7"),
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
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
      BigNumberString("8"),
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
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
      BigNumberString("8"),
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
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
      BigNumberString("6"),
      BigNumberString("5"),
    );

    console.log("replaceExpiredListing res: ", tx);
  } catch (err) {
    console.log("replaceExpiredListing err: ", err);
  }
};

const getTagTotal = async () => {
  try {
    const tx = await contracts.factoryContract.getTagTotal(
      MarketplaceTag("tag2"),
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
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
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
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
      EVMContractAddress("0x3B6d7bF2203bad30fecDf2c03984D2b9610Eb9D7"), // test with random erc20 address
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

const getAccountBalanceForErc20 = async (
  contract: EVMContractAddress,
  account: EVMAccountAddress,
) => {
  try {
    const erc20Contract = new ERC20RewardContract(signer, contract);
    erc20Contract.balanceOf(account).then((balance) => {
      console.log("balance: ", balance);
    });
  } catch (e) {
    console.log("getAccountBalances e: ", e);
  }
};

// Function to get the ED25519 public key of the wallet we want to add
const getNobleED25519SignerPublicKey = async (ethersWallet) => {
  try {
    const keyGateway = new FarcasterKeyGatewayContract(signer1);
    keyGateway
      .getNobleED25519SignerPublicKKey(ethersWallet)
      .then((ed255519PublicKey) => {
        console.log("ed255519PublicKey: ", ed255519PublicKey);
        return ed255519PublicKey.isOk();
      });
  } catch (e) {
    console.log("getNobleED25519SignerPublicKKey error: ", e);
  }
};

const getBytesOf = async (ed25519PublicAddress) => {
  try {
    console.log(ethers.getBytes(ed25519PublicAddress));
    return ethers.getBytes(ed25519PublicAddress);
  } catch (e) {
    console.log("getBytesOf error: ", e);
    return;
  }
};

const hexilify = async (uint8array) => {
  try {
    console.log(ethers.hexlify(uint8array));
    return ethers.hexlify(uint8array);
  } catch (e) {
    console.log("hexilify error: ", e);
    return;
  }
};

const getFarcasterIdOf = async (account: EVMAccountAddress) => {
  try {
    const idRegistry = new FarcasterIdRegistryContract(signer);
    idRegistry.idOf(account).then((farcasterId) => {
      console.log("FarcasterId: ", farcasterId);
    });
  } catch (e) {
    console.log("getFarcasterIdOf e: ", e);
  }
};

const getKeysOf = async (
  farcasterUserId: FarcasterUserId,
  keyState: EFarcasterKeyState,
) => {
  try {
    const keyRegistry = new FarcasterKeyRegistryContract(signer);
    keyRegistry.keysOf(farcasterUserId, keyState).then((keys) => {
      console.log("Keys: ", keys);
    });
  } catch (e) {
    console.log("getKeysOf e: ", e);
  }
};

const deadline = 1722069682;

const getSignedKeyRequestSignatureAndEncodedMetadata = async (
  farcasterUserId: FarcasterUserId,
  ownerEVMAddress: EVMAccountAddress,
  keyToAdd: ED25519PublicKey,
  deadline: UnixTimestamp,
) => {
  try {
    const keyGateway = new FarcasterKeyGatewayContract(signer);
    keyGateway
      .getSignedKeyRequestSignatureAndEncodedMetadata(
        farcasterUserId,
        ownerEVMAddress,
        keyToAdd,
        deadline,
      )
      .then((signedKeyReq) => {
        if (signedKeyReq.isOk()) {
          console.log(
            "DEBUGGER SignedKeyRequestSignature",
            signedKeyReq.value.signedKeyRequestSignature,
          );
          console.log(
            "DEBUGGER hexed SignedKeyRequestMetadata: ",
            signedKeyReq.value.encodedSignedKeyRequestMetadata,
          );
        }
      });
  } catch (e) {
    console.log("getSignedKeyRequestSignatureAndEncodedMetadata e: ", e);
  }
};

/* SignedKeyRequest {
    signedKeyRequestSignature: '0xf5841ef34b4b90c6b5420061da65fa19698dd26c92b306c2b981a26fb4ba56455d1b6a855ddf999b901b2eb75fc1e6d2e0dcdf7875bd2328fdda2628a39a72b31b',
    encodedSignedKeyRequestMetadata: '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000a587f000000000000000000000000baea3282cd6d44672ea12eb6434ed1d1d4b615c700000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000066cc271f0000000000000000000000000000000000000000000000000000000000000041f5841ef34b4b90c6b5420061da65fa19698dd26c92b306c2b981a26fb4ba56455d1b6a855ddf999b901b2eb75fc1e6d2e0dcdf7875bd2328fdda2628a39a72b31b00000000000000000000000000000000000000000000000000000000000000'
  } */
// Called by wallet itself
const addKey = async (
  keyToAdd: ED25519PublicKey,
  encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
) => {
  try {
    const keyGateway = new FarcasterKeyGatewayContract(signer);

    keyGateway.add(keyToAdd, encodedMetadata).then((wrappedTxRes) => {
      console.log("TX response: ", wrappedTxRes);
    });
  } catch (e) {
    console.log("addKey e: ", e);
  }
};

const getAddKeySignature = async (
  ownerAddress: EVMAccountAddress,
  keyToAdd: ED25519PublicKey,
  encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
  deadline: UnixTimestamp,
) => {
  try {
    const keyGateway = new FarcasterKeyGatewayContract(signer);

    keyGateway
      .getAddSignature(ownerAddress, keyToAdd, encodedMetadata, deadline)
      .then((signature) => {
        if (signature.isOk()) {
          console.log("DEBUGGER addKeySignature hex: ", signature.value);
          console.log(
            "DEBUGGER addKeySignature bytes: ",
            ethers.getBytes(signature.value),
          );
        }
      });
  } catch (e) {
    console.log("addKey e: ", e);
  }
};

const keyGatewayAddFor = async (
  fidOwnerAddress: EVMAccountAddress,
  keyToAdd: ED25519PublicKey,
  encodedMetadata: FarcasterEncodedSignedKeyRequestMetadata,
  deadline: UnixTimestamp,
  addSignature: FarcasterAddSignature,
): Promise<void> => {
  try {
    const keyGateway = new FarcasterKeyGatewayContract(signer);
    const tx = await keyGateway.addFor(
      fidOwnerAddress,
      keyToAdd,
      encodedMetadata,
      deadline,
      addSignature,
    );
    console.log(tx);
  } catch (e) {
    console.log("keyGatewayAddFor e: ", e);
    throw e;
  }
};

const init = async () => {
  console.log("Initializing...");
  //await getLatestBlock();
  // await createConsent();
  // await sendFunds();
  // await renounceRole();
  //   await getAccountBalanceForErc20(
  //     EVMContractAddress("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"),
  //     EVMAccountAddress("0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c"),
  //   );
  // await grantRole();
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

  /* await getFarcasterIdOf(
    EVMAccountAddress("0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c"),
  ); */

  await getKeysOf(FarcasterUserId(678015), EFarcasterKeyState.Added);

  //await getNobleED25519SignerPublicKey(signer1);

  /* await getSignedKeyRequestSignatureAndEncodedMetadata(
    FarcasterUserId(678015),
    EVMAccountAddress("0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c"),
    ED25519PublicKey(
      "0x089064a1a687c1fcf5bd2450243d91bc0612070d900557cf744857420713b0d7",
    ),
    UnixTimestamp(deadline),
  ); */

  /* await getAddKeySignature(
    EVMAccountAddress("0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c"),
    ED25519PublicKey(
      "0x089064a1a687c1fcf5bd2450243d91bc0612070d900557cf744857420713b0d7",
    ),
    FarcasterEncodedSignedKeyRequestMetadata(
      "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000a587f0000000000000000000000000f9deb936f279625c13b1d3e3ef8c94734ced12c00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000066a4b2b200000000000000000000000000000000000000000000000000000000000000414aa99acf1d6d7fce1ceb27ee7e2a918cd7c38e7225df6b4e1f2f891149eab6d4281211ea5aa00b1b0ac5b3a30109c223be0cb7064b0a5468b80e5fc4dcac7b0c1b00000000000000000000000000000000000000000000000000000000000000",
    ),
    UnixTimestamp(deadline),
  ); */

  /* await keyGatewayAddFor(
    EVMAccountAddress("0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c"),
    ED25519PublicKey(
      "0x089064a1a687c1fcf5bd2450243d91bc0612070d900557cf744857420713b0d7",
    ),
    FarcasterEncodedSignedKeyRequestMetadata(
      "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000a587f0000000000000000000000000f9deb936f279625c13b1d3e3ef8c94734ced12c00000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000066a4b2b200000000000000000000000000000000000000000000000000000000000000414aa99acf1d6d7fce1ceb27ee7e2a918cd7c38e7225df6b4e1f2f891149eab6d4281211ea5aa00b1b0ac5b3a30109c223be0cb7064b0a5468b80e5fc4dcac7b0c1b00000000000000000000000000000000000000000000000000000000000000",
    ),
    UnixTimestamp(deadline),
    FarcasterAddSignature(
      "0x74169c6c625b04cb29b31058f829c07607b74abf4bfe9c4f02f54001616aaf296a3280b0c4eaddb61cf3dc2107cf9480382ce519109e47c254b40aa4176715dc1c",
    ),
  ); */
};

await init();
