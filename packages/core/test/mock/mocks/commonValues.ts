import {
  ChainInformation,
  ControlChainInformation,
} from "@objects/businessObjects";
import {
  URLString,
  ChainId,
  chainConfig,
  DataWalletAddress,
  EVMContractAddress,
  EVMPrivateKey,
  IpfsCID,
  SDQLQuery,
  SDQLString,
  EVMAccountAddress,
} from "@snickerdoodlelabs/objects";
import { snickerdoodleSigningDomain } from "@snickerdoodlelabs/signature-verification";

import { CoreConfig } from "@core/interfaces/objects/index.js";

export const externalAccountAddress1 = EVMAccountAddress(
  "ExternalAccountAddress1",
);
export const externalAccountAddress2 = EVMAccountAddress(
  "ExternalAccountAddress2",
);

export const dataWalletAddress = DataWalletAddress("dataWalletAddress");
export const dataWalletKey = EVMPrivateKey("dataWalletKey");

export const consentContractAddress1 = EVMContractAddress(
  "consentContractAddress1",
);
export const consentContractAddress2 = EVMContractAddress(
  "consentContractAddress1",
);

export const queryId = IpfsCID("queryId");

export const qureyString = SDQLString("qurey");

export const SDQuery = new SDQLQuery(queryId, qureyString);

// #region for config provider mock

export const controlChainId = ChainId(31337);
export const controlChainInformation = chainConfig.get(
  controlChainId,
) as ControlChainInformation;

export const testCoreConfig = new CoreConfig(
  controlChainId,
  [], //TODO: supported chains
  chainConfig,
  controlChainInformation,
  URLString("http://ipfstest.com/whatever"),
  URLString("http://localhost:3000/v0"),
  snickerdoodleSigningDomain,
  5000, // polling interval indexing,
  5000, // polling interval balance
  5000, // polling interval NFT
  1000, // dataWalletBackupIntervalMS
  100000, // backupChunkSizeTarget
  "covalent api key",
  "moralis api key",
  URLString("http://dnsServerAddress"),
);

// #endregion
