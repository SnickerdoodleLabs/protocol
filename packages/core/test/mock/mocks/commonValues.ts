import {
  chainConfig,
  ChainId,
  ControlChainInformation,
  DataWalletAddress,
  EChain,
  ECurrencyCode,
  EHashAlgorithm,
  ESignatureAlgorithm,
  EVMAccountAddress,
  EVMContractAddress,
  EVMPrivateKey,
  IpfsCID,
  ProviderUrl,
  SDQLQuery,
  SDQLString,
  TokenSecret,
  URLString,
} from "@snickerdoodlelabs/objects";

import {
  CoreConfig,
  MetatransactionGasAmounts,
} from "@core/interfaces/objects/index.js";

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

export const defaultInsightPlatformBaseUrl = URLString(
  "http://localhost:3000/v0",
);
export const defaultGoogleCloudBucket = "ceramic-replacement-bucket";

const testDiscordConfig = {
  clientId: "1089994449830027344",
  clientSecret: TokenSecret("uqIyeAezm9gkqdudoPm9QB-Dec7ZylWQ"),
  oauthBaseUrl: URLString("https://discord.com/oauth2/authorize"),
  oauthRedirectUrl: URLString(
    "https://localhost:9005/data-dashboard/social-media-data",
  ),
  accessTokenUrl: URLString("https://discord.com/api/oauth2/authorize"),
  refreshTokenUrl: URLString("https://discord.com/api/oauth2/authorize"),
  dataAPIUrl: URLString("https://discord.com/api"),
  iconBaseUrl: URLString("https://cdn.discordapp.com/icons"),
  pollInterval: 2 * 1000, // days * hours * seconds * milliseconds
};

const testTwitterConfig = {
  apiKey: "boxruvqZNqFDLsWgc2BkbhHzn",
  apiSecretKey: TokenSecret(
    "WT2Cfs6rhhdEVFamfYpgGusBcIP8ZXAv4cnN2ghtVuUpLu0AYw",
  ),
  signingAlgorithm: ESignatureAlgorithm.HMAC,
  hashingAlgorithm: EHashAlgorithm.SHA1,
  oAuthBaseUrl: URLString("https://api.twitter.com/oauth"),
  oAuthCallbackUrl: URLString("oob"),
  dataAPIUrl: URLString("https://api.twitter.com/2"),
  pollInterval: 1 * 24 * 3600 * 1000,
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
  {
    covalentApiKey: "covalent api key",
    moralisApiKey: "moralis api key",
    nftScanApiKey: "nftScan api key",
    poapApiKey: "poap api key",
    oklinkApiKey: "oklink api key",
    primaryInfuraKey: "",
    ankrApiKey: "ankr api key",
    secondaryInfuraKey: "",
  },
  URLString("http://dnsServerAddress"),
  URLString("http://ceramicNodeURL"), // ceramicNodeURL
  ECurrencyCode.USD,
  new Map(),
  100, // etherscan tx batch size
  5000,
  new Map<EChain, URLString>([
    // alchemy endpoints
    [EChain.Solana, URLString("")],
    [EChain.SolanaTestnet, URLString("")],
    [EChain.Polygon, URLString("")],
    [EChain.Mumbai, URLString("")],
  ]),
  10000,
  "(localhost|chrome://)",
  false,
  300000,
  1000,
  testDiscordConfig,
  testTwitterConfig,
  60000, // heartbeatIntervalMS
  new MetatransactionGasAmounts(
    10000000, // createCrumbGas
    10000000, // removeCrumbGas,
    10000000, // optInGas
    10000000, // optOutGas
    10000000, // updateAgreementFlagsGas
  ), // metatransactionGasAmounts
  ProviderUrl(""),
);

// #endregion
