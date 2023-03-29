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
  ECurrencyCode,
} from "@snickerdoodlelabs/objects";

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

export const queryCID = IpfsCID("queryCID");

export const qureyString = SDQLString("qurey");

export const SDQuery = new SDQLQuery(queryCID, qureyString);

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

export const defaultInsightPlatformBaseUrl = URLString(
  "http://localhost:3000/v0",
);
export const defaultGoogleCloudBucket = "ceramic-replacement-bucket";

const discordConfig = {
  clientId: "1089994449830027344",
  oauthBaseUrl: URLString("https://discord.com/oauth2/authorize"),
  oauthRedirectUrl: URLString("https://localhost:9005/data-dashboard/social-media-data"),
  accessTokenUrl: URLString("https://discord.com/api/oauth2/authorize"),
  refreshTokenUrl: URLString("https://discord.com/api/oauth2/authorize"),
  dataAPIUrl: URLString("https://discord.com/api"),
  iconBaseUrl: URLString("https://cdn.discordapp.com/icons"),
  pollInterval: 1 * 24 * 3600 * 1000, // days * hours * seconds * milliseconds
};

export const testCoreConfig = new CoreConfig(
  controlChainId,
  [], //TODO: supported chains
  chainConfig,
  controlChainInformation,
  URLString("http://ipfstest.com/whatever"),
  defaultInsightPlatformBaseUrl, // defaultInsightPlatformBaseUrl
  defaultGoogleCloudBucket, // defaultGoogleCloudBucket
  5000, // polling interval indexing,
  5000, // polling interval balance
  5000, // polling interval NFT
  1000, // dataWalletBackupIntervalMS
  100000, // backupChunkSizeTarget
  "covalent api key",
  "moralis api key",
  "nftScan api key",
  "poap api key",
  URLString("http://dnsServerAddress"),
  modelAliases, // ceramicModelAliases
  URLString("http://ceramicNodeURL"), // ceramicNodeURL
  ECurrencyCode.USD,
  new Map(),
  100, // etherscan tx batch size
  5000,
  { solana: "", solanaTestnet: "", polygon: "", polygonMumbai: "" }, // alchemy endpoints
  10000,
  "(localhost|chrome:\/\/)",
  false,
  discordConfig,
);

// #endregion
