import {
  chainConfig,
  ChainId,
  CompensationKey,
  ControlChainInformation,
  DataWalletAddress,
  EChain,
  ECurrencyCode,
  EHashAlgorithm,
  ESignatureAlgorithm,
  EVMContractAddress,
  EVMPrivateKey,
  IpfsCID,
  ProviderUrl,
  SDQLQuery,
  SDQLString,
  SDQL_Name,
  TokenSecret,
  URLString,
  UnixTimestamp,
  AdContent,
  EAdContentType,
  EAdDisplayType,
  ISDQLConditionString,
  ESDQLQueryReturn,
  ISDQLExpressionString,
  Version,
  EVMAccountAddress,
  EVMChainCode,
} from "@snickerdoodlelabs/objects";


import {
  AST_ConditionExpr,
  AST_Ad,
  AST_BalanceQuery,
  AST_BlockchainTransactionQuery,
  AST_PropertyQuery,
  AST_Insight,
  AST_Expr,
  AST_BoolExpr,
  AST_Compensation,
  AST_RequireExpr,
  AST_Contract,
  AST,
  AST_SubQuery,
} from "@snickerdoodlelabs/query-parser";
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
  apiKey: "IksHLFQGjifiBzswDKpdjtyqW",
  apiSecretKey: TokenSecret(
    "y4FOFgQnuRo7vvnRuKqFhBbM3sYWuSZyg5RqHlRIc3DZ4N7Hnx",
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
    alchemyApiKeys: {
      Arbitrum: "",
      Astar: "",
      Mumbai: "",
      Optimism: "",
      Polygon: "",
      Solana: "",
      SolanaTestnet: "",
    },
    etherscanApiKeys: {
      Ethereum: "",
      Polygon: "",
      Avalanche: "",
      Binance: "",
      Moonbeam: "",
      Optimism: "",
      Arbitrum: "",
      Gnosis: "",
      Fuji: "",
    },
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
  100, // etherscan tx batch size
  5000,
  new Map<EChain, URLString>([
    // alchemy endpoints
    [EChain.Solana, URLString("")],
    [EChain.SolanaTestnet, URLString("")],
    [EChain.Polygon, URLString("")],
    [EChain.Mumbai, URLString("")],
    [EChain.Arbitrum, URLString("")],
    [EChain.Optimism, URLString("")],
    [EChain.Astar, URLString("")],
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



const adContent1: AdContent = new AdContent(
  EAdContentType.IMAGE,
  IpfsCID("testSrc"),
);
const adContent2: AdContent = new AdContent(
  EAdContentType.VIDEO,
  IpfsCID("testSrc"),
);
const adContent3: AdContent = new AdContent(
  EAdContentType.IMAGE,
  IpfsCID("testSrc"),
);

const targetExpr1: AST_ConditionExpr = new AST_ConditionExpr(
  SDQL_Name("$q1"),
  true,
);
const targetExpr2: AST_ConditionExpr = new AST_ConditionExpr(
  SDQL_Name("$q2"),
  true,
);
const targetExpr3: AST_ConditionExpr = new AST_ConditionExpr(
  SDQL_Name("$q1>30"),
  true,
);

const ad1: AST_Ad = new AST_Ad(
  SDQL_Name("a1"),
  SDQL_Name("a1"),
  adContent1,
  "QWEQWEWQE",
  EAdDisplayType.BANNER,
  6,
  UnixTimestamp(1735678800),
  ["a", "b", "c"],
  targetExpr1,
  ISDQLConditionString("$q1"),
);

const ad2: AST_Ad = new AST_Ad(
  SDQL_Name("a2"),
  SDQL_Name("a2"),
  adContent2,
  "ASDASD",
  EAdDisplayType.POPUP,
  7,
  UnixTimestamp(1735678),
  ["1", "2", "3"],
  targetExpr2,
  ISDQLConditionString("$q2"),
);

const ad3: AST_Ad = new AST_Ad(
  SDQL_Name("a3"),
  SDQL_Name("a3"),
  adContent3,
  "text",
  EAdDisplayType.BANNER,
  8,
  UnixTimestamp(1735678800),
  ["q", "w", "e"],
  targetExpr3,
  ISDQLConditionString("$q1>30"),
);

// Creating the ads map
const adsMap: Map<SDQL_Name, AST_Ad> = new Map();
adsMap.set(ad1.key, ad1);
adsMap.set(ad2.key, ad2);
adsMap.set(ad3.key, ad3);

// Creating the other maps and objects...
// (subqueries, insights, compensationParameters, compensations)
// Create AST_Subquery instances
const subquery1 = new AST_BlockchainTransactionQuery(
  SDQL_Name("q1"),
  ESDQLQueryReturn.Boolean,
  "network",
  { name: "network", return: ESDQLQueryReturn.Boolean },
  EVMChainCode("AVAX"),
  AST_Contract.fromSchema({
    networkid: "43114",
    address: "0x9366d30feba284e62900f6295bc28c9906f33172",
    function: "Transfer",
    direction: "from",
    token: "ERC20",
    timestampRange: {
      start: 13001519,
      end: 14910334,
    },
  }),
);
const subquery2 = new AST_PropertyQuery(
  SDQL_Name("q2"),
  ESDQLQueryReturn.Number,
  "age",
  [],
  undefined,
  undefined,
  undefined,
);
const subquery3 = new AST_PropertyQuery(
  SDQL_Name("q3"),
  ESDQLQueryReturn.String,
  "location",
  [],
  undefined,
  undefined,
  undefined,
);
const subquery4 = new AST_BalanceQuery(
  SDQL_Name("q4"),
  ESDQLQueryReturn.Array,
  ChainId(1),
  [
    /* conditions array */
  ],
);

// Create subqueries map
const subqueriesMap: Map<SDQL_Name, AST_SubQuery> = new Map();
subqueriesMap.set(SDQL_Name("q1"), subquery1);
subqueriesMap.set(SDQL_Name("q2"), subquery2);
subqueriesMap.set(SDQL_Name("q3"), subquery3);
subqueriesMap.set(SDQL_Name("q4"), subquery4);

// Create AST_ConditionExpr instances for insights' targets
const target1: AST_ConditionExpr = new AST_ConditionExpr(SDQL_Name(">2"), true);
const target2: AST_ConditionExpr = new AST_ConditionExpr(SDQL_Name("q2"), true);
const target3: AST_ConditionExpr = new AST_ConditionExpr(
  SDQL_Name("boolean"),
  true,
);

// Create AST_Expr instances for insights' returns
const returns1 = new AST_Expr(SDQL_Name("string"), "qualified");
const returns2 = new AST_Expr(SDQL_Name("string"), "not qualified");
const returns3 = new AST_Expr(SDQL_Name("q3"), true);

// Create AST_Insight instances
const insight1: AST_Insight = new AST_Insight(
  SDQL_Name("i1"),
  target1,
  ISDQLConditionString("$q1>30"),
  returns1,
  ISDQLExpressionString("'qualified'"),
);
const insight2: AST_Insight = new AST_Insight(
  SDQL_Name("i2"),
  target2,
  ISDQLConditionString("$q2"),
  returns2,
  ISDQLExpressionString("'not qualified'"),
);
const insight3: AST_Insight = new AST_Insight(
  SDQL_Name("i3"),
  target3,
  ISDQLConditionString("true"),
  returns3,
  ISDQLExpressionString("$q3"),
);

// Create insights map
const insightsMap: Map<SDQL_Name, AST_Insight> = new Map();
insightsMap.set(SDQL_Name("i1"), insight1);
insightsMap.set(SDQL_Name("i2"), insight2);
insightsMap.set(SDQL_Name("i3"), insight3);

const requires1: AST_BoolExpr = new AST_BoolExpr(SDQL_Name("boolean"), true);
const requires2: AST_BoolExpr = new AST_BoolExpr(SDQL_Name("boolean"), true);
const requires3: AST_BoolExpr = new AST_BoolExpr(SDQL_Name("boolean"), true);

// Create AST_Compensation instances
const compensation1: AST_Compensation = new AST_Compensation(
  SDQL_Name("c1"),
  "10% discount code for Starbucks",
  requires1 as AST_RequireExpr,
  ISDQLConditionString("true"),
  ChainId(1),
  { parameters: [], data: {} },
  [],
  IpfsCID("QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR"),
);
const compensation2: AST_Compensation = new AST_Compensation(
  SDQL_Name("c2"),
  "participate in the draw to win a CryptoPunk NFT",
  requires2 as AST_RequireExpr,
  ISDQLConditionString("true"),
  ChainId(1),
  { parameters: [], data: {} },
  [CompensationKey("c3")],
  IpfsCID("33tq432RLMiMsKc98mbKC3P8NuTGsMnRxWqxBEmWPL8wBQ"),
);
const compensation3: AST_Compensation = new AST_Compensation(
  SDQL_Name("c3"),
  "a free CrazyApesClub NFT",
  requires3 as AST_RequireExpr,
  ISDQLConditionString("true"),
  ChainId(1),
  { parameters: [], data: {} },
  [],
  IpfsCID("GsMnRxWqxMsKc98mbKC3PBEmWNuTPL8wBQ33tq432RLMi8"),
);

// Create compensations map
const compensationsMap: Map<SDQL_Name, AST_Compensation> = new Map();
compensationsMap.set(SDQL_Name("c1"), compensation1);
compensationsMap.set(SDQL_Name("c2"), compensation2);
compensationsMap.set(SDQL_Name("c3"), compensation3);

const compensationParameters = {
  recipientAddress: { type: EVMAccountAddress("address"), required: true },
  productId: {
    type: "string",
    required: false,
    values: ["https://product1", "https://product2"],
  },
  shippingAddress: { type: "string", required: false },
};
// Creating the final AST instance
export const avalanche1AstInstance = new AST(
  Version("0.1"),
  "Interactions with the Avalanche blockchain for 15-year and older individuals",
  "Shrapnel",
  adsMap,
  subqueriesMap,
  insightsMap,
  compensationParameters,
  compensationsMap,
);

// #endregion
