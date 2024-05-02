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
  LanguageCode,
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
  SiteVisit,
  SiteVisitsMap,
  SiteVisitsData,
  ISO8601DateString,
  BigNumberString,
  TokenUri,
  LinkedAccount,
  EContractStandard,
  DirectReward,
  EVMNFT,
  EQuestionnaireQuestionType,
  IQuestionnaireSchema,
  EQuestionnaireStatus,
  PropertiesOf,
  QuestionnaireData,
  QuestionnaireHistory,
  Questionnaire,
  QuestionnaireAnswer,
  MarketplaceTag,
  QuestionnaireQuestion,
  QuestionnaireWithAnswers,
  SHA256Hash,
  Commitment,
  NullifierBNS,
  TrapdoorBNS,
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

export const queryString = SDQLString("queryString");

export const SDQuery = new SDQLQuery(queryCID, queryString);

// #region for config provider mock

export const controlChainId = ChainId(31337);
export const controlChainInformation = chainConfig.get(
  controlChainId,
) as ControlChainInformation;

export const defaultInsightPlatformBaseUrl = URLString(
  "http://localhost:3000/v0",
);
export const defaultGoogleCloudBucket = "ceramic-replacement-bucket";

export const defaultDropboxAppKey = "w69949reoalc9xg";
export const defaultDropboxAppSecret = "78jch5z5o800dyw";

const testDiscordConfig = {
  clientId: "1089994449830027344",
  clientSecret: TokenSecret("uqIyeAezm9gkqdudoPm9QB-Dec7ZylWQ"),
  oauthBaseUrl: URLString("https://discord.com/oauth2/authorize"),
  oauthRedirectUrl: URLString("https://localhost:9005/settings"),
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
  controlChainInformation,
  URLString("http://ipfstest.com/whatever"),
  defaultInsightPlatformBaseUrl, // defaultInsightPlatformBaseUrl
  defaultGoogleCloudBucket, // defaultGoogleCloudBucket
  defaultDropboxAppKey, // dropbox app key sample
  defaultDropboxAppSecret, // dropbox app secret sample
  "https://datawallet.snickerdoodle.com/data-dashboard/auth", // dropboxRedirectUri
  5000, // polling interval indexing,
  5000, // polling interval balance
  300000, // polling interval NFT
  1000, // dataWalletBackupIntervalMS
  3600000, // questionnairesCacheUpdateIntervalMS
  100000, // backupChunkSizeTarget
  {
    alchemyApiKeys: {
      Arbitrum: null,
      Astar: null,
      Mumbai: null,
      Optimism: null,
      Polygon: null,
      Solana: null,
      SolanaTestnet: null,
      Base: null,
    },
    etherscanApiKeys: {
      Ethereum: null,
      Polygon: null,
      Avalanche: null,
      Binance: null,
      Moonbeam: null,
      Optimism: null,
      Arbitrum: null,
      Gnosis: null,
      Fuji: null,
    },
    spaceAndTimeCredentials: {
      userId: null,
      privateKey: null,
    },
    expandApiKey: "expand api key",
    covalentApiKey: "covalent api key",
    moralisApiKey: "moralis api key",
    nftScanApiKey: "nftScan api key",
    poapApiKey: "poap api key",
    oklinkApiKey: "oklink api key",
    ankrApiKey: "ankr api key",
    bluezApiKey: "bluez api key",
    raribleApiKey: "rarible api key",
    blockvisionKey: "blockvision api key",
    primaryInfuraKey: "primary infura key",
    primaryRPCProviderURL: ProviderUrl("Primary RPC Provider URL"),
    secondaryInfuraKey: "",
    secondaryRPCProviderURL: ProviderUrl("Secondary RPC Provider URL"),
  },
  URLString("http://dnsServerAddress"),
  ECurrencyCode.USD,
  100, // etherscan tx batch size
  5000,
  new Map<EChain, URLString>([
    // alchemy endpoints
    [EChain.Solana, URLString("AlchemySolanaEndpoint")],
    [EChain.SolanaTestnet, URLString("AlchemySolanaTestnetEndpoint")],
    [EChain.Polygon, URLString("AlchemyPolygonEndpoint")],
    [EChain.Mumbai, URLString("AlchemyMumbaiEndpoint")],
    [EChain.Arbitrum, URLString("AlchemyArbitrumEndpoint")],
    [EChain.Optimism, URLString("AlchemyOptimismEndpoint")],
    [EChain.Astar, URLString("AlchemyAstroEndpoint")],
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
  ProviderUrl("devChainProviderURL"), // devChainProviderURL
  60, // maxStatsRetentionSeconds
  LanguageCode("en-pw"), // passwordLanguageCode
  100,
  URLString("https://ipfs-gateway.snickerdoodle.com/ipfs/"),
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
  "balance",
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
  "Sugar to your coffee",
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
  "The CryptoPunk Draw",
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
  "CrazyApesClub NFT distro",
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
  UnixTimestamp(1),
  0,
  "Interactions",
);

export const siteVisits: SiteVisit[] = [
  new SiteVisit(
    URLString("http://google.com"),
    UnixTimestamp(100),
    UnixTimestamp(400),
  ),
  new SiteVisit(
    URLString("http://google.com"),
    UnixTimestamp(100),
    UnixTimestamp(400),
  ),
  new SiteVisit(
    URLString("http://google.com"),
    UnixTimestamp(100),
    UnixTimestamp(400),
  ),
  new SiteVisit(
    URLString("http://gog.com"),
    UnixTimestamp(200),
    UnixTimestamp(400),
  ),
  new SiteVisit(
    URLString("http://discord.com"),
    UnixTimestamp(300),
    UnixTimestamp(400),
  ),
];

export const siteVisitsMap: SiteVisitsMap = new Map([
  [
    URLString("google.com"),
    new SiteVisitsData(
      3,
      300,
      UnixTimestamp(900),
      ISO8601DateString("1970-01-01T00:06:40.000Z"),
    ),
  ],
  [
    URLString("gog.com"),
    new SiteVisitsData(
      1,
      200,
      UnixTimestamp(200),
      ISO8601DateString("1970-01-01T00:06:40.000Z"),
    ),
  ],
  [
    URLString("discord.com"),
    new SiteVisitsData(
      1,
      100,
      UnixTimestamp(100),
      ISO8601DateString("1970-01-01T00:06:40.000Z"),
    ),
  ],
]);

const tokenAddress1 = EVMContractAddress(
  "0x0a281d992a7e454d9dcf611b6bf0201393e27438",
);
const tokenAddress2 = EVMContractAddress(
  "0x2222222222222222222222222222222222222222",
);

const tokenAddress3 = EVMContractAddress(
  "0x2222222222222222222222222233333333333333",
);

const tokenAddress4 = EVMContractAddress(
  "0x2222222222222222222222222244444444444444",
);
const tokenId = BigNumberString("0");
const contractType = EContractStandard.Erc721;
export const fujiOwner = EVMAccountAddress(
  "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc",
);
export const polygonOwner = EVMAccountAddress(
  "0xacfbc62a183d926f0c6c0c3c8d2aaaaaaaaaaaa",
);
export const linkedAccounts: LinkedAccount[] = [
  new LinkedAccount(EChain.Fuji, fujiOwner),
  new LinkedAccount(EChain.Polygon, polygonOwner),
];

export const earnedRewards: DirectReward[] = [
  new DirectReward(
    queryCID,
    "Name",
    null,
    "",
    ChainId(81),
    tokenAddress1,
    externalAccountAddress1,
  ),
];

const tokenUri = TokenUri("");
const metadata = undefined;
const amount = BigNumberString("1");

const chain = 43113;

export const fujiNfts = [
  new EVMNFT(
    tokenAddress1,
    tokenId,
    contractType,
    fujiOwner,
    tokenUri,
    metadata,
    "1",
    chain,
    amount,
    UnixTimestamp(1701779730),
  ),
  new EVMNFT(
    tokenAddress2,
    tokenId,
    contractType,
    fujiOwner,
    tokenUri,
    metadata,
    "2",
    chain,
    amount,
    UnixTimestamp(1701779730),
  ),
];

export const fujiIndexerResponseAfterRegainingTheNft = new EVMNFT(
  tokenAddress1,
  tokenId,
  contractType,
  fujiOwner,
  tokenUri,
  metadata,
  "1",
  chain,
  amount,
  UnixTimestamp(1701779738),
);

export const polygonNfts = [
  new EVMNFT(
    tokenAddress3,
    tokenId,
    contractType,
    polygonOwner,
    tokenUri,
    metadata,
    "3",
    137,
    amount,
    UnixTimestamp(1701779730),
  ),
  new EVMNFT(
    tokenAddress4,
    tokenId,
    contractType,
    polygonOwner,
    tokenUri,
    metadata,
    "4",
    137,
    amount,
    UnixTimestamp(1701779730),
  ),
];

export const indexedNfts = [
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc|#|0x0a281d992a7e454d9dcf611b6bf0201393e27438|#|0",
    nft: {
      type: 0,
      chain: 43113,
      owner: fujiOwner,
      token: "0x0a281d992a7e454d9dcf611b6bf0201393e27438",
      name: "1",
      tokenId: "0",
      contractType: "Erc721",
      tokenUri: "",
      metadata: undefined,
      blockNumber: undefined,
      lastOwnerTimeStamp: undefined,
    },
  },
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc|#|0x2222222222222222222222222222222222222222|#|0",
    nft: {
      type: 0,
      chain: 43113,
      owner: fujiOwner,
      token: "0x2222222222222222222222222222222222222222",
      name: "2",
      tokenId: "0",
      contractType: "Erc721",
      tokenUri: "",
      metadata: undefined,
      blockNumber: undefined,
      lastOwnerTimeStamp: undefined,
    },
  },
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2aaaaaaaaaaaa|#|0x2222222222222222222222222233333333333333|#|0",
    nft: {
      type: 0,
      chain: 137,
      owner: polygonOwner,
      token: "0x2222222222222222222222222233333333333333",
      name: "3",
      tokenId: "0",
      contractType: "Erc721",
      tokenUri: "",
      metadata: undefined,
      blockNumber: undefined,
      lastOwnerTimeStamp: undefined,
    },
  },
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2aaaaaaaaaaaa|#|0x2222222222222222222222222244444444444444|#|0",
    nft: {
      type: 0,
      chain: 137,
      owner: polygonOwner,
      token: "0x2222222222222222222222222244444444444444",
      name: "4",
      tokenId: "0",
      contractType: "Erc721",
      tokenUri: "",
      metadata: undefined,
      blockNumber: undefined,
      lastOwnerTimeStamp: undefined,
    },
  },
];

export const indexedNftInitialHistory = [
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc|#|0x0a281d992a7e454d9dcf611b6bf0201393e27438|#|0{-}1701779730",
    event: 1,
    amount: "1",
  },
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc|#|0x2222222222222222222222222222222222222222|#|0{-}1701779730",
    event: 1,
    amount: "1",
  },
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2aaaaaaaaaaaa|#|0x2222222222222222222222222233333333333333|#|0{-}1701779730",
    event: 1,
    amount: "1",
  },
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2aaaaaaaaaaaa|#|0x2222222222222222222222222244444444444444|#|0{-}1701779730",
    event: 1,
    amount: "1",
  },
];

export const indexedNftTransferlHistory = [
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc|#|0x0a281d992a7e454d9dcf611b6bf0201393e27438|#|0{-}1701779734",
    event: -1,
    amount: "1",
  },
  {
    id: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc|#|0x0a281d992a7e454d9dcf611b6bf0201393e27438|#|0{-}1701779738",
    event: 1,
    amount: "1",
  },
];

export const expectedFujiNfts = [
  {
    type: 0,
    chain: 43113,
    owner: fujiOwner,
    token: "0x0a281d992a7e454d9dcf611b6bf0201393e27438",
    name: "1",
    tokenId: "0",
    contractType: "Erc721",
    tokenUri: "",
    metadata: undefined,
    blockNumber: undefined,
    lastOwnerTimeStamp: undefined,
    measurementDate: 1701779730,
    amount: "1",
  },
  {
    type: 0,
    chain: 43113,
    owner: fujiOwner,
    token: "0x2222222222222222222222222222222222222222",
    name: "2",
    tokenId: "0",
    contractType: "Erc721",
    tokenUri: "",
    metadata: undefined,
    blockNumber: undefined,
    lastOwnerTimeStamp: undefined,
    measurementDate: 1701779730,
    amount: "1",
  },
];

export const expectedShibuya = [
  {
    type: 0,
    chain: 81,
    owner: "ExternalAccountAddress1",
    token: "0x0a281d992a7e454d9dcf611b6bf0201393e27438",
    name: "Name",
    tokenId: "1",
    contractType: "Unknown",
    tokenUri: undefined,
    metadata: {
      raw: '{"queryCID":"queryCID","name":"Name","image":"http://ipfstest.com/whatever","description":"","type":"Direct","chainId":81,"contractAddress":"0x0a281d992a7e454d9dcf611b6bf0201393e27438","recipientAddress":"ExternalAccountAddress1"}',
    },
    blockNumber: undefined,
    lastOwnerTimeStamp: undefined,
    amount: "1",
    measurementDate: 0,
  },
];

export const expectedPolygon = [
  {
    type: 0,
    chain: 137,
    owner: polygonOwner,
    token: "0x2222222222222222222222222233333333333333",
    name: "3",
    amount: "1",
    measurementDate: 1701779730,
    tokenId: "0",
    contractType: "Erc721",
    tokenUri: "",
    metadata: undefined,
    blockNumber: undefined,
    lastOwnerTimeStamp: undefined,
  },
  {
    type: 0,
    chain: 137,
    owner: polygonOwner,
    token: "0x2222222222222222222222222244444444444444",
    name: "4",
    amount: "1",
    measurementDate: 1701779730,
    tokenId: "0",
    contractType: "Erc721",
    tokenUri: "",
    metadata: undefined,
    blockNumber: undefined,
    lastOwnerTimeStamp: undefined,
  },
];
export const expectedNfts = [
  ...expectedShibuya,
  ...expectedFujiNfts,
  ...expectedPolygon,
];

export const nftThatGotTransferredAndGotBack = {
  type: 0,
  chain: 43113,
  owner: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc",
  token: "0x0a281d992a7e454d9dcf611b6bf0201393e27438",
  name: "1",
  tokenId: "0",
  contractType: "Erc721",
  tokenUri: "",
  metadata: undefined,
  blockNumber: undefined,
  lastOwnerTimeStamp: undefined,
  measurementDate: 1701779738,
  amount: "1",
};

const {
  amount: evmAmount,
  measurementDate,
  ...rest
} = nftThatGotTransferredAndGotBack;
export const walletNftThatGotTransferredAndGotBack = {
  id: "0xacfbc62a183d926f0c6c0c3c8d2cccccccccccc|#|0x0a281d992a7e454d9dcf611b6bf0201393e27438|#|0",
  ...rest,
  history: [
    { measurementDate: 1701779730, amount: "1", event: 1 },
    {
      amount: "1",
      event: -1,
      measurementDate: 1701779734,
    },
    {
      amount: "1",
      event: 1,
      measurementDate: 1701779738,
    },
  ],
  totalAmount: "1",
};
// #endregion

// #region for Questionnaire
export const InvalidIPFSQuestionnaireCID = IpfsCID(
  "QmeFACA648aPXQp4sP5R6sgJon4wggUhatY61Ras211111",
);
export const IPFSQuestionnaireCID = IpfsCID(
  "QmeFACA648aPXQp4sP5R6sgJon4wggUhatY61Ras2WWJLF",
);
export const mockIPFSQuestionnaire: IQuestionnaireSchema = {
  title: "Sample Questionnaire",
  description: "This is a sample questionnaire for testing purposes",
  image: URLString("https://example.com/sample-image.jpg"),
  questions: [
    {
      questionType: EQuestionnaireQuestionType.MultipleChoice,

      question: "What is your favorite color?",
      options: ["Red", "Blue", "Green"],
      isRequired: true,
    },
    {
      questionType: EQuestionnaireQuestionType.Location,
      question: "Where are you located?",
      isRequired: false,
    },
    {
      questionType: EQuestionnaireQuestionType.Text,
      question: "What is your feedback?",
      isRequired: false,
    },
  ],
};

export const mockQuestionnaireIPFSInstance = new QuestionnaireData(
  IPFSQuestionnaireCID,
  [
    {
      index: 0,
      type: EQuestionnaireQuestionType.MultipleChoice,
      text: "What is your favorite color?",
      choices: ["Red", "Blue", "Green"],
      required: true,
      minimum: null,
      maximum: null,
      multiSelect: false,
      displayType: null,
      upperLabel: null,
      lowerLabel: null,
    },
    {
      index: 1,
      type: EQuestionnaireQuestionType.Location,
      text: "Where are you located?",
      choices: null,
      required: false,
      minimum: null,
      maximum: null,
      multiSelect: false,
      displayType: null,
      upperLabel: null,
      lowerLabel: null,
    },
    {
      index: 2,
      type: EQuestionnaireQuestionType.Text,
      text: "What is your feedback?",
      choices: null,
      required: false,
      minimum: null,
      maximum: null,
      multiSelect: false,
      displayType: null,
      upperLabel: null,
      lowerLabel: null,
    },
  ],
  "Sample Questionnaire",
  [
    [
      0,
      SHA256Hash(
        "1c80cd62545938c60fc4275f84f9fa596d88a61224b2721bb1e950bf6ef68240",
      ),
    ],
    [
      1,
      SHA256Hash(
        "5a0ee45cc6c46230070f0bf9fcb10ca10721bd5fc3b1f826b155cde0c5572fa0",
      ),
    ],
    [
      2,
      SHA256Hash(
        "1ce3e462dba8ae7c251087af4b07b9b86716266c531be32544a39231d501d753",
      ),
    ],
  ],
  "This is a sample questionnaire for testing purposes",
  URLString("https://example.com/sample-image.jpg"),
);

//

export const mockQuestionnaireCID = IpfsCID(
  "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u2",
);
export const mockQuestionnaireCID2 = IpfsCID(
  "QmX5u2op8fZKSWX4vVDntxz5X7a7vFL41PgzECyEp4o6u4",
);
export const mockQuestionnaireStoredInstance = new QuestionnaireData(
  mockQuestionnaireCID,
  [
    {
      index: 0,
      type: EQuestionnaireQuestionType.MultipleChoice,
      text: "How often do you exercise?",
      choices: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
      required: false,
      maximum: null,
      minimum: null,
      multiSelect: false,
      displayType: null,
      upperLabel: null,
      lowerLabel: null,
    },
    {
      index: 1,
      type: EQuestionnaireQuestionType.Text,
      text: "What is your main motivation for exercising?",
      choices: null,
      required: false,
      maximum: null,
      minimum: null,
      multiSelect: false,
      displayType: null,
      upperLabel: null,
      lowerLabel: null,
    },
  ],
  "Sample Questionnaire 2",
  [
    [
      0,
      SHA256Hash(
        "f95b936ee4922d96d588f676b5572682739c36bff7c005d29c630e1fd54db522",
      ),
    ],
    [
      1,
      SHA256Hash(
        "a63c8485548420ffbd9dbe07b1d445cff3b71cbf16e1634a85e30e39c6f550d9",
      ),
    ],
  ],
  "Please answer the following questions about your exercise habits.",
  undefined,
);

export const mockQuestionnaireStoredInstance2 = new QuestionnaireData(
  mockQuestionnaireCID2,
  [
    {
      index: 0,
      type: EQuestionnaireQuestionType.MultipleChoice,
      text: "How often do you exercise?",
      choices: ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
      required: false,
      minimum: null,
      maximum: null,
      multiSelect: false,
      displayType: null,
      upperLabel: null,
      lowerLabel: null,
    },
    {
      index: 1,
      type: EQuestionnaireQuestionType.Text,
      text: "What is your main motivation for exercising?",
      choices: null,
      required: false,
      minimum: null,
      maximum: null,
      multiSelect: false,
      displayType: null,
      upperLabel: null,
      lowerLabel: null,
    },
  ],
  "Sample Questionnaire 22",
  [],
  "Please answer the following questions about your exercise habits.",
  undefined,
);

export const mockQuestionnaire = new Questionnaire(
  mockQuestionnaireCID,
  MarketplaceTag(`Questionnaire:${mockQuestionnaireCID}`),
  EQuestionnaireStatus.Complete,
  "Sample Questionnaire 2",
  "Please answer the following questions about your exercise habits.",
  null,
  [
    new QuestionnaireQuestion(
      0,
      EQuestionnaireQuestionType.MultipleChoice,
      "How often do you exercise?",
      ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
      null,
      null,
      null,
      false,
      false,
      null,
      null,
    ),
    new QuestionnaireQuestion(
      1,
      EQuestionnaireQuestionType.Text,
      "What is your main motivation for exercising?",
      null,
      null,
      null,
      null,
      false,
      false,
      null,
      null,
    ),
  ],
);

export const mockQuestionnaire2 = new Questionnaire(
  mockQuestionnaireCID2,
  MarketplaceTag(`Questionnaire:${mockQuestionnaireCID2}`),
  EQuestionnaireStatus.Available,
  "Sample Questionnaire 22",
  "Please answer the following questions about your exercise habits.",
  null,
  [
    new QuestionnaireQuestion(
      0,
      EQuestionnaireQuestionType.MultipleChoice,
      "How often do you exercise?",
      ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
      null,
      null,
      null,
      false,
      false,
      null,
      null,
    ),
    new QuestionnaireQuestion(
      1,
      EQuestionnaireQuestionType.Text,
      "What is your main motivation for exercising?",
      null,
      null,
      null,
      null,
      false,
      false,
      null,
      null,
    ),
  ],
);

export const mockQuestionnaireAnswer: QuestionnaireAnswer[] = [
  new QuestionnaireAnswer(mockQuestionnaireCID, 0, 0),
  new QuestionnaireAnswer(mockQuestionnaireCID, 1, "to get fresh air"),
];

export const mockQuestionnaireWithAnswer = new QuestionnaireWithAnswers(
  mockQuestionnaireCID,
  MarketplaceTag(`Questionnaire:${mockQuestionnaireCID}`),
  EQuestionnaireStatus.Complete,
  "Sample Questionnaire 2",
  "Please answer the following questions about your exercise habits.",
  null,
  [
    new QuestionnaireQuestion(
      0,
      EQuestionnaireQuestionType.MultipleChoice,
      "How often do you exercise?",
      ["Daily", "Weekly", "Monthly", "Rarely", "Never"],
      null,
      null,
      null,
      false,
      false,
      null,
      null,
    ),
    new QuestionnaireQuestion(
      1,
      EQuestionnaireQuestionType.Text,
      "What is your main motivation for exercising?",
      null,
      null,
      null,
      null,
      false,
      false,
      null,
      null,
    ),
  ],
  mockQuestionnaireAnswer,
  UnixTimestamp(1701779736),
);
export const mockQuestionnaireSecondQuestionHash = SHA256Hash(
  "a63c8485548420ffbd9dbe07b1d445cff3b71cbf16e1634a85e30e39c6f550d9",
);
export const mockQuestionnaireFirstQuestionHash = SHA256Hash(
  "f95b936ee4922d96d588f676b5572682739c36bff7c005d29c630e1fd54db522",
);
export const mockSecondQuestionnaireHistoryNewer = new QuestionnaireHistory(
  mockQuestionnaireSecondQuestionHash,
  UnixTimestamp(1701779736),
  "to get fresh air",
);

export const mockFirstQuestionnaireHistory = new QuestionnaireHistory(
  mockQuestionnaireFirstQuestionHash,
  UnixTimestamp(1701779734),
  0,
);

// #endregion

// #region Commitments
export const commitment1Index = 1;
export const commitment1 = Commitment(1234n);
export const identityNullifier = NullifierBNS("5678");
export const identityTrapdoor = TrapdoorBNS("94062");
// #endregion
