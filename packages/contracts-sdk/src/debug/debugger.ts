import "reflect-metadata";
import {
  ID_GATEWAY_ADDRESS,
  ID_REGISTRY_ADDRESS,
  ViemLocalEip712Signer,
  idGatewayABI,
  idRegistryABI,
  NobleEd25519Signer,
  KEY_GATEWAY_ADDRESS,
  keyGatewayABI,
  ID_GATEWAY_EIP_712_TYPES,
  BUNDLER_ADDRESS,
  bundlerABI,
  SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES,
  KEY_GATEWAY_EIP_712_TYPES,
} from "@farcaster/hub-nodejs";
import { CryptoUtils } from "@snickerdoodlelabs/node-utils";
import {
  BaseURI,
  BigNumberString,
  Commitment,
  ConsentName,
  DomainName,
  EVMAccountAddress,
  EVMContractAddress,
  MarketplaceTag,
  UnknownBlockchainError,
} from "@snickerdoodlelabs/objects";
import { ethers, ParamType, TypedDataField } from "ethers";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { fromString, toString } from "uint8arrays";

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

const getNativeBalance = async (
  account: EVMAccountAddress,
): Promise<bigint> => {
  try {
    const balance = await provider.getBalance(account);
    console.log("Native balance: ", balance);
    return balance;
  } catch (e) {
    console.log("getNativeBalance e: ", e);
    throw e; // Optionally rethrow the error to handle it elsewhere
  }
};

const getIdRegistrationPrice = async (): Promise<bigint> => {
  try {
    const contract = new ethers.Contract(
      ID_GATEWAY_ADDRESS,
      idGatewayABI,
      provider,
    );
    const args = [0n];
    const price: bigint = await contract["price(uint256)"].staticCall(...args);
    console.log("Id Registration Price: ", price);
    return price;
  } catch (e) {
    console.log("getIdRegistrationPrice e: ", e);
    throw e;
  }
};

const getBundlerRegistrationPrice = async (): Promise<bigint> => {
  try {
    const contract = new ethers.Contract(BUNDLER_ADDRESS, bundlerABI, provider);
    const args = [0n];
    const price: bigint = await contract["price(uint256)"].staticCall(...args);
    console.log("Bundler Registration Price: ", price);
    return price;
  } catch (e) {
    console.log("getBundlerRegistrationPrice e: ", e);
    throw e;
  }
};

// make sure to check if appSigner:
// - has enough balance
// - doesn't already have fid
const registerApp = async (
  appSigner: ethers.Wallet,
  recoveryAddress: EVMAccountAddress,
) => {
  try {
    const contract = new ethers.Contract(
      ID_GATEWAY_ADDRESS,
      idGatewayABI,
      appSigner,
    );
    const args = [recoveryAddress, 0n];
    // can do more to customize fees and other if you want
    const idRegistrationPrice = await getIdRegistrationPrice();
    const tx = await contract["register(address,uint256)"](...args, {
      value: idRegistrationPrice,
    });
    console.log("tx: ", tx);
    const receipt = await tx.wait();
    console.log("receipt: ", receipt);
    return receipt;
  } catch (e) {
    console.log("getAppFid e: ", e);
    throw e;
  }
};

const addKey = async (
  newKeySigner: ethers.Wallet,
  newKey: EVMAccountAddress,
  deadline: bigint,
) => {
  try {
    const contract = new ethers.Contract(
      KEY_GATEWAY_ADDRESS,
      keyGatewayABI,
      newKeySigner,
    );
    const encodedMetadataStruct = await signKeyRegisterEncodedMetadataCall(
      newKeySigner,
      newKey,
      deadline,
    );
    const args = [1, newKey, 1, encodedMetadataStruct];
    // can do more to customize fees and other if you want
    const tx = await contract["add"].staticCall(...args);
    console.log("tx: ", tx);
    const receipt = await tx.wait();
    console.log("receipt: ", receipt);
    return receipt;
  } catch (e) {
    console.log("addKey e: ", e);
    throw e;
  }
};

// getting 0n means the app is not registered
const getAppFid = async (
  appAddress: EVMAccountAddress | EVMContractAddress,
): Promise<bigint> => {
  try {
    const contract = new ethers.Contract(
      ID_REGISTRY_ADDRESS,
      idRegistryABI,
      provider,
    );
    const args = [appAddress];
    const fid: bigint = await contract["idOf"].staticCall(...args);
    console.log("app fid: ", fid);
    return fid;
  } catch (e) {
    console.log("getAppFid e: ", e);
    throw e;
  }
};

const getKeyGatewayNonce = async (
  address: EVMAccountAddress | EVMContractAddress,
): Promise<bigint> => {
  try {
    const contract = new ethers.Contract(
      KEY_GATEWAY_ADDRESS,
      keyGatewayABI,
      provider,
    );
    const args = [address];
    const keyGatewayNonce: bigint = await contract["nonces"].staticCall(
      ...args,
    );
    console.log("keyGateway nonce: ", keyGatewayNonce);
    return keyGatewayNonce;
  } catch (e) {
    console.log("getKeyGatewayNonce e: ", e);
    throw e;
  }
};

const HOUR_DEADLINE = BigInt(Math.floor(Date.now() / 1000) + 3600); // set the signatures' deadline to 1 hour from now

function removeReadonlyFromReadonlyTypes<T>(
  obj: T,
): Record<string, TypedDataField[]> {
  return obj as Record<string, TypedDataField[]>;
}

// allows Alice to delegate the creation of her id registration
const signIdRegisterCall = async (
  signer: ethers.Wallet, // the user wallet signer
  recoveryAddress: EVMAccountAddress | EVMContractAddress,
  deadline: bigint,
): Promise<string> => {
  try {
    const nonce = await getKeyGatewayNonce(EVMAccountAddress(signer.address));
    // message should be RegistrationParams struct
    //    https://docs.farcaster.xyz/reference/contracts/reference/id-gateway#register-signature
    //    Needs to be a EIP712 signature
    const message = {
      to: signer.address,
      recovery: recoveryAddress,
      nonce: nonce,
      deadline: deadline,
    };
    // const bytesMessage: Uint8Array = new TextEncoder().encode(
    //   JSON.stringify(message),
    // );
    const signedMessage = await signer.signTypedData(
      ID_GATEWAY_EIP_712_TYPES.domain,
      removeReadonlyFromReadonlyTypes(ID_GATEWAY_EIP_712_TYPES.types),
      message,
    );
    console.log("signedIdRegistrationMessage: ", signedMessage);
    return signedMessage;
  } catch (e) {
    console.log("signIdRegisterCall e: ", e);
    throw e;
  }
};

// creates metadata for alice to delegate the creation of her key registration
const signKeyRegisterEncodedMetadataCall = async (
  appSigner: ethers.Wallet, // the app that will register a key on behalf of the user
  keyToAdd: EVMAccountAddress, // key to be tied to account
  deadline: bigint,
): Promise<string> => {
  // TODO HexString with prefix
  try {
    const appFid = await getAppFid(EVMAccountAddress(appSigner.address));
    if (appFid === 0n) {
      throw new UnknownBlockchainError("App is not registered");
    }
    //    https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequestmetadata-struct
    //    Needs to be a EIP712 signature
    const metadataMessage = {
      requestFid: appFid,
      key: keyToAdd,
      deadline,
    };
    const metadataSignature = await appSigner.signTypedData(
      SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.domain,
      removeReadonlyFromReadonlyTypes(
        SIGNED_KEY_REQUEST_VALIDATOR_EIP_712_TYPES.types,
      ),
      metadataMessage,
    );
    const metadataStruct = {
      requestFid: appFid,
      requestSigner: keyToAdd,
      signature: metadataSignature,
      deadline: deadline,
    };
    // function similar to https://github.com/farcasterxyz/hub-monorepo/blob/27a1cfc84a19bf20120567abc806d158374cea15/packages/core/src/signers/viemLocalEip712Signer.ts#L134
    const metadataStructType = ParamType.from({
      components: [
        {
          name: "requestFid",
          type: "uint256",
        },
        {
          name: "requestSigner",
          type: "address",
        },
        {
          name: "signature",
          type: "bytes",
        },
        {
          name: "deadline",
          type: "uint256",
        },
      ],
      name: "SignedKeyRequestMetadata",
      type: "tuple",
    });
    console.log("metadataStruct: ", metadataStruct);

    const encodedMetadataStruct = ethers.AbiCoder.defaultAbiCoder().encode(
      [metadataStructType],
      [metadataStruct],
    );
    console.log("signKeyRegisterEncodedMetadataCall: ", encodedMetadataStruct);
    return encodedMetadataStruct;
  } catch (e) {
    console.log("signKeyRegisterEncodedMetadataCall e: ", e);
    throw e;
  }
};

interface AddKeySingedMetadata {
  encodedMetadataStruct: string;
  signature: string;
}
// allows Alice to delegate the creation of her key registration
const signKeyRegisterCall = async (
  accountSigner: ethers.Wallet, // the user wallet signer / owner
  keyToAdd: EVMAccountAddress,
  appSigner: ethers.Wallet, // the app that will register a key on behalf of the user
  deadline: bigint,
): Promise<AddKeySingedMetadata> => {
  try {
    const appFid = await getAppFid(EVMAccountAddress(appSigner.address));
    if (appFid === 0n) {
      throw new UnknownBlockchainError("App is not registered");
    }
    // message should be Add Signature struct
    //    https://docs.farcaster.xyz/reference/contracts/reference/key-gateway#add-signature
    //    Signature needs to include metadata
    //    https://docs.farcaster.xyz/reference/contracts/reference/signed-key-request-validator#signedkeyrequestmetadata-struct
    //    Needs to be a EIP712 signature
    const encodedMetadataStruct = await signKeyRegisterEncodedMetadataCall(
      appSigner,
      keyToAdd,
      deadline,
    );
    const nonce = await getKeyGatewayNonce(EVMAccountAddress(signer.address));
    const addKeyMessage = {
      owner: accountSigner.address,
      keyType: 1,
      key: keyToAdd,
      metadataType: 1,
      metadata: encodedMetadataStruct,
      nonce: nonce,
      deadline: deadline,
    };
    const addKeySignature = await accountSigner.signTypedData(
      KEY_GATEWAY_EIP_712_TYPES.domain,
      removeReadonlyFromReadonlyTypes(KEY_GATEWAY_EIP_712_TYPES.types),
      addKeyMessage,
    );
    console.log("signKeyRegisterCall: ", addKeySignature);
    return {
      encodedMetadataStruct: encodedMetadataStruct,
      signature: addKeySignature,
    };
  } catch (e) {
    console.log("signKeyRegisterCall e: ", e);
    throw e;
  }
};

const idGatewayRegisterFor = async (
  appSigner: ethers.Wallet, // needs to have existing fid
  mainUserSigner: ethers.Wallet,
  recoveryAddress: EVMAccountAddress,
  deadline: bigint,
): Promise<bigint> => {
  try {
    const contract = new ethers.Contract(
      ID_GATEWAY_ADDRESS,
      idGatewayABI,
      appSigner,
    );
    const registerIdSig = await signIdRegisterCall(
      mainUserSigner,
      recoveryAddress,
      deadline,
    );
    const idGatewayRegisterForParams = {
      to: mainUserSigner.address,
      recovery: recoveryAddress,
      sig: registerIdSig,
      deadline: deadline,
    };
    const idRegistrationPrice = await getIdRegistrationPrice();
    console.log("idRegistrationPrice: ", idRegistrationPrice);
    const args = [
      idGatewayRegisterForParams.to,
      idGatewayRegisterForParams.recovery,
      idGatewayRegisterForParams.deadline,
      idGatewayRegisterForParams.sig,
      0n,
    ];
    //"register((address,address,uint256,bytes),(uint32,bytes,uint8,bytes,uint256,bytes)[],uint256)"
    const registerCall = await contract["registerFor"].staticCall(...args, {
      value: idRegistrationPrice,
    });
    console.log("idGatewayRegisterFor: ", registerCall);
    return registerCall;
  } catch (e) {
    console.log("idGatewayRegisterFor e: ", e);
    throw e;
  }
};

const keyGatewayAddFor = async (
  appSigner: ethers.Wallet, // needs to have existing fid
  mainUserSigner: ethers.Wallet,
  keyToAdd: EVMAccountAddress,
  deadline: bigint,
): Promise<bigint> => {
  try {
    const contract = new ethers.Contract(
      KEY_GATEWAY_ADDRESS,
      keyGatewayABI,
      appSigner,
    );
    const { encodedMetadataStruct, signature } = await signKeyRegisterCall(
      mainUserSigner,
      keyToAdd,
      appSigner,
      deadline,
    );
    const keyGatewayRegisterForParams = {
      keyType: 1, // 1 is the only key type for now
      key: mainUserSigner.address, // the key to be registered - doesn't have to be same key as mainUser, could be a newly generated key
      metadataType: 1,
      metadata: encodedMetadataStruct,
      sig: signature,
      deadline: deadline,
    };
    const args = [
      appSigner.address,
      keyGatewayRegisterForParams.keyType,
      keyGatewayRegisterForParams.key,
      keyGatewayRegisterForParams.metadataType,
      keyGatewayRegisterForParams.metadata,
      keyGatewayRegisterForParams.deadline,
      keyGatewayRegisterForParams.sig,
    ];
    //"register((address,address,uint256,bytes),(uint32,bytes,uint8,bytes,uint256,bytes)[],uint256)"
    const addForCall = await contract["addFor"].staticCall(...args);
    console.log("keyGatewayAddFor: ", addForCall);
    return addForCall;
  } catch (e) {
    console.log("keyGatewayAddFor e: ", e);
    throw e;
  }
};

const haveAppCallBundlerToCreateNewAccounts = async (
  appSigner: ethers.Wallet, // needs to have existing fid
  mainUserSigner: ethers.Wallet,
  keyToAdd: EVMAccountAddress,
  recoveryAddress: EVMAccountAddress,
  deadline: bigint,
): Promise<bigint> => {
  try {
    const contract = new ethers.Contract(
      BUNDLER_ADDRESS,
      bundlerABI,
      appSigner,
    );
    const registerIdSig = await signIdRegisterCall(
      mainUserSigner,
      recoveryAddress,
      deadline,
    );
    const idGatewayRegisterForParams = {
      to: mainUserSigner.address,
      recovery: recoveryAddress,
      sig: registerIdSig,
      deadline: deadline,
    };
    const { encodedMetadataStruct, signature } = await signKeyRegisterCall(
      mainUserSigner,
      keyToAdd,
      appSigner,
      deadline,
    );
    const keyGatewayRegisterForParams = {
      keyType: 1, // 1 is the only key type for now
      key: mainUserSigner.address, // the key to be registered - doesn't have to be same key as mainUser, could be a newly generated key
      metadataType: 1,
      metadata: encodedMetadataStruct,
      sig: signature,
      deadline: deadline,
    };
    const bundlerRegistrationPrice = await getBundlerRegistrationPrice();
    console.log("bundlerRegistrationPrice: ", bundlerRegistrationPrice);
    const args = [
      idGatewayRegisterForParams,
      [keyGatewayRegisterForParams],
      0n,
    ];
    //"register((address,address,uint256,bytes),(uint32,bytes,uint8,bytes,uint256,bytes)[],uint256)"
    const registerCall = await contract["register"].staticCall(...args, {
      value: bundlerRegistrationPrice,
    });
    console.log("haveAppCallBundlerToCreateNewAccounts: ", registerCall);
    return registerCall;
  } catch (e) {
    console.log("haveAppCallBundlerToCreateNewAccounts e: ", e);
    throw e;
  }
};

const init = async () => {
  console.log("Initializing...");
  await getLatestBlock();
  // await createConsent();
  // await sendFunds();
  // await renounceRole();
  // await getAccountBalanceForErc20(
  //   EVMContractAddress("0x94b008aA00579c1307B0EF2c499aD98a8ce58e58"),
  //   EVMAccountAddress("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"),
  // );
  const testAccount = EVMAccountAddress(
    "0x0F9Deb936F279625C13b1d3E3ef8c94734cEd12c",
  );
  const testAccountSigner = new ethers.Wallet(
    "46cb718f767d331ac76f04dc8771adf96f9ab21132545dd0c7797524684d0d63",
    provider,
  );
  await getNativeBalance(testAccount);
  await getIdRegistrationPrice();
  await getBundlerRegistrationPrice();
  await getAppFid(testAccount);
  await getKeyGatewayNonce(EVMAccountAddress(signer.address));
  await signIdRegisterCall(signer, testAccount, HOUR_DEADLINE);
  await signKeyRegisterEncodedMetadataCall(
    testAccountSigner,
    EVMAccountAddress(signer.address),
    HOUR_DEADLINE,
  );
  await signKeyRegisterCall(
    signer,
    EVMAccountAddress(signer.address),
    testAccountSigner,
    HOUR_DEADLINE,
  );
  await idGatewayRegisterFor(
    testAccountSigner,
    signer,
    EVMAccountAddress(signer.address),
    HOUR_DEADLINE,
  );
  await addKey(
    testAccountSigner,
    EVMAccountAddress("0x36F452f0253d0E878BC8a114FF3fA8664EEcbA95"),
    HOUR_DEADLINE,
  );
  // await keyGatewayAddFor(
  //   testAccountSigner,
  //   testAccountSigner,
  //   EVMAccountAddress(signer.address),
  //   HOUR_DEADLINE,
  // );
  // await haveAppCallBundlerToCreateNewAccounts(
  //   testAccountSigner,
  //   signer,
  //   EVMAccountAddress(signer.address),
  //   testAccount,
  //   HOUR_DEADLINE,
  // );
  // await registerApp(testAccountSigner, testAccount);
  // await registerApp();
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
};

await init();
