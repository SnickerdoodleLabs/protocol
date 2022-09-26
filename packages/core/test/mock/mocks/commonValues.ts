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
  ControlChainInformation,
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

export const modelAliases = {
  definitions: {
    backupIndex:
      "kjzl6cwe1jw149f06c8o6hgro45rerad83swxqn5nrijb4i271uc1g5dybjjk22",
  },
  schemas: {
    BackupIndex:
      "ceramic://k3y52l7qbv1frxm8elgkbtatgwkukhh7f3he8h6jarqy8szuq39x96heksob9hqtc",
    DataWalletBackup:
      "ceramic://k3y52l7qbv1frxmf8dp0byvefkkj7j9f4hztn82r85lmpsrln5195njzlaw6zq680",
  },
  tiles: {},
};

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
  modelAliases, // ceramicModelAliases
  URLString("http://ceramicNodeURL"), // ceramicNodeURL
  "USD",
);

// #endregion
