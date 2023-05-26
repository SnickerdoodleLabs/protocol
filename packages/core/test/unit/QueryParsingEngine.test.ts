import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  Age,
  ChainId,
  CompensationKey,
  CountryCode,
  ERewardType,
  ExpectedReward,
  Gender,
  HexString32,
  ISDQLCompensations,
  IpfsCID,
  SDQLQuery,
  SDQLString,
  SDQL_Return,
  SubQueryKey,
  TransactionPaymentCounter,
  DataPermissions,
  QueryExpiredError,
  EWalletDataType,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import {
  IQueryObjectFactory,
  ISDQLQueryUtils,
  ISDQLQueryWrapperFactory,
  QueryObjectFactory,
  SDQLQueryWrapperFactory,
  avalanche1ExpiredSchemaStr,
  avalanche2SchemaStr,
  avalanche1SchemaStr,
  avalanche4SchemaStr,
  IQueryFactories,
  QueryFactories,
  AST,
  AST_SubQuery,
} from "@snickerdoodlelabs/query-parser";
import { errAsync, okAsync } from "neverthrow";
import * as td from "testdouble";
import { BaseOf } from "ts-brand";

import { QueryParsingEngine } from "@core/implementations/business/utilities/index.js";
import {
  BalanceQueryEvaluator,
  BlockchainTransactionQueryEvaluator,
  NftQueryEvaluator,
  QueryEvaluator,
  QueryRepository,
} from "@core/implementations/business/utilities/query/index.js";
import {
  AdContentRepository,
  AdDataRepository,
} from "@core/implementations/data";
import { SnickerdoodleCore } from "@core/index";
import {
  IBrowsingDataRepository,
  IDataWalletPersistence,
  IDemographicDataRepository,
  IPortfolioBalanceRepository,
  ISocialRepository,
  ITransactionHistoryRepository,
} from "@core/interfaces/data/index.js";
import { AjaxUtilsMock, ConfigProviderMock } from "@core-tests/mock/utilities";
import { IProfileService } from "@core/interfaces/business";


import {
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
} from "@snickerdoodlelabs/query-parser";

const adContent1: AdContent = new AdContent(
  EAdContentType.IMAGE,
  IpfsCID("testSrc"),
);
const adContent2: AdContent = new AdContent(
  EAdContentType.VIDEO,
  IpfsCID("cid2"),
);
const adContent3: AdContent = new AdContent(
  EAdContentType.IMAGE,
  IpfsCID("cid3"),
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
  ["a", "b","c"],
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
  ["keyword3", "keyword4"],
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
  ["keyword5", "keyword6"],
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
 const avalanche1AstInstance = new AST(
  Version("0.1"),
  "Interactions with the Avalanche blockchain for 15-year and older individuals",
  "Shrapnel",
  adsMap,
  subqueriesMap,
  insightsMap,
  compensationParameters,
  compensationsMap,

);

const queryCID = IpfsCID("Beep");
const sdqlQueryExpired = new SDQLQuery(
  queryCID,
  SDQLString(avalanche1ExpiredSchemaStr),
);
const sdqlQuery = new SDQLQuery(queryCID, SDQLString(avalanche1SchemaStr));
const astQuery = avalanche1AstInstance
const sdqlQuery2 = new SDQLQuery(queryCID, SDQLString(avalanche2SchemaStr));
const sdqlQuery4 = new SDQLQuery(queryCID, SDQLString(avalanche4SchemaStr));

const country = CountryCode("1");
const allPermissions = HexString32(
  "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
);
const noPermissions = HexString32(
  "0x0000000000000000000000000000000000000000000000000000000000000000",
);

class QueryParsingMocks {
  public transactionRepo = td.object<ITransactionHistoryRepository>();
  public balanceRepo = td.object<IPortfolioBalanceRepository>();
  public demoDataRepo = td.object<IDemographicDataRepository>();
  public profileService = td.object<IProfileService>();
  public browsingDataRepo = td.object<IBrowsingDataRepository>();
  public adDataRepo = td.object<AdDataRepository>();
  public socialRepo = td.object<ISocialRepository>();

  public blockchainTransactionQueryEvaluator =
    new BlockchainTransactionQueryEvaluator(this.transactionRepo);

  public nftQueryEvaluator = new NftQueryEvaluator(this.balanceRepo);

  public balanceQueryEvaluator = new BalanceQueryEvaluator(this.balanceRepo);

  public queryUtils = td.object<ISDQLQueryUtils>();

  public queryObjectFactory: IQueryObjectFactory;
  public queryFactories: IQueryFactories;
  public queryWrapperFactory: ISDQLQueryWrapperFactory;
  public queryRepository: QueryRepository;
  public queryEvaluator: QueryEvaluator;

  public adContentRepository: AdContentRepository;

  public constructor() {
    this.queryObjectFactory = new QueryObjectFactory();
    this.queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());

    const expectedCompensationsMap = new Map<
      CompensationKey,
      ISDQLCompensations
    >();
    expectedCompensationsMap
      .set(CompensationKey("c1"), {
        description: "Only the chainId is compared, so this can be random.",
        chainId: ChainId(1),
      } as ISDQLCompensations)
      .set(CompensationKey("c2"), {
        description: "Only the chainId is compared, so this can be random.",
        chainId: ChainId(1),
      } as ISDQLCompensations)
      .set(CompensationKey("c3"), {
        description: "Only the chainId is compared, so this can be random.",
        chainId: ChainId(1),
      } as ISDQLCompensations);

    td.when(this.demoDataRepo.getGender()).thenReturn(
      okAsync(Gender("female")),
    );
    td.when(this.profileService.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.demoDataRepo.getAge()).thenReturn(okAsync(Age(10)));
    td.when(this.demoDataRepo.getLocation()).thenReturn(okAsync(country));
    td.when(
      this.browsingDataRepo.getSiteVisitsMap(td.matchers.anything()),
    ).thenReturn(okAsync(new Map()));
    td.when(
      this.transactionRepo.getTransactions(td.matchers.anything()),
    ).thenReturn(okAsync([]));
    td.when(this.transactionRepo.getTransactionValueByChain()).thenReturn(
      okAsync(new Array<TransactionPaymentCounter>()),
    );
    td.when(this.balanceRepo.getAccountBalances()).thenReturn(okAsync([]));

    this.queryEvaluator = new QueryEvaluator(
      this.balanceQueryEvaluator,
      this.blockchainTransactionQueryEvaluator,
      this.nftQueryEvaluator,
      this.profileService,
      this.demoDataRepo,
      this.browsingDataRepo,
      this.transactionRepo,
      this.socialRepo,
    );
    this.queryRepository = new QueryRepository(this.queryEvaluator);

    this.queryFactories = new QueryFactories(
      this.queryObjectFactory,
      this.queryWrapperFactory,
      this.queryRepository,
    );
    this.adContentRepository = new AdContentRepository(
      new AjaxUtilsMock(),
      new ConfigProviderMock(),
    );
  }

  public factory() {
    return new QueryParsingEngine(
      this.queryFactories,
      this.queryRepository,
      this.queryUtils,
      this.adContentRepository,
      this.adDataRepo,
    );
  }

  public SDQLReturnToSubQueryKey(sdqlR: SDQL_Return): SubQueryKey {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;
    if (typeof actualTypeData == "string") {
      return SubQueryKey(actualTypeData);
    } else if (actualTypeData == null) {
      return SubQueryKey("");
    } else {
      return SubQueryKey(JSON.stringify(actualTypeData));
    }
  }

  // TODO: Add Lazy and Web2 Reward Implementation
  public SDQLReturnToExpectedReward(sdqlR: SDQL_Return): ExpectedReward {
    const actualTypeData = sdqlR as BaseOf<SDQL_Return>;

    if (typeof actualTypeData == "object") {
      if (actualTypeData != null) {
        console.log("rewardData: ", JSON.stringify(actualTypeData));
        console.log(
          "rewardData['description']: ",
          actualTypeData["description"],
        );
        console.log("rewardData['callback']: ", actualTypeData["callback"]);
        console.log(
          "rewardData['callback']['parameters']: ",
          actualTypeData["callback"]["parameters"],
        );
        console.log(
          "rewardData['callback']['data']: ",
          actualTypeData["callback"]["data"],
        );
        return new ExpectedReward(
          actualTypeData["compensationKey"],
          actualTypeData["description"],
          ChainId(actualTypeData["chainId"]),
          actualTypeData["callback"],
          ERewardType.Direct,
        );
      }
    }
    if (typeof actualTypeData == "string") {
      const rewardData = JSON.parse(actualTypeData);
      console.log("rewardData: ", rewardData);
      console.log("rewardData['description']: ", rewardData["description"]);
      console.log("rewardData['callback']: ", rewardData["callback"]);
      console.log(
        "rewardData['callback']['parameters']: ",
        rewardData["callback"]["parameters"],
      );
      console.log(
        "rewardData['callback']['data']: ",
        rewardData["callback"]["data"],
      );
      return new ExpectedReward(
        rewardData["compensationKey"],
        rewardData["description"],
        ChainId(rewardData["chainId"]),
        rewardData["callback"],
        ERewardType.Direct,
      );
    }

    return new ExpectedReward("", "", ChainId(0), "", ERewardType.Direct);
  }
}

describe("Dummy describe block", () => {
  test("Dummy test", async () => {
    const mocks = new QueryParsingMocks();
    const engine = mocks.factory();
    expect(1).toBe(1);
  });
});

describe("Handle Query", () => {
  test("Should handle query with no ads", async () => {
    const mocks = new QueryParsingMocks();
    const engine = mocks.factory();

    await engine
      .handleQuery(sdqlQuery2, new DataPermissions(allPermissions))
      .andThen((insights) => {
        expect(insights).toEqual({
          insights: {
            q1: { insight: "false", proof: "" },
            q2: { insight: "true", proof: "" },
            q3: { insight: "1", proof: "" },
            q4: { insight: "female", proof: "" },
            q5: { insight: "{}", proof: "" },
            q6: { insight: "[]", proof: "" },
          },
          ads: {},
        });
        return okAsync(insights);
      })
      .mapErr((e) => {
        console.log(e);
        expect(1).toBe(2);
      });
  });

  test("Expired query must return QueryExpiredError", async () => {
    const mocks = new QueryParsingMocks();
    const engine = mocks.factory();

    await engine
      .handleQuery(sdqlQueryExpired, new DataPermissions(allPermissions))
      .andThen((_insights) => {
        fail("Expired query was executed!");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryExpiredError);
      });
  });
});

describe("Tests with data permissions", () => {
  const mocks = new QueryParsingMocks();
  const engine = mocks.factory();

  test("avalanche 2 first insight is null when age permission is not given", async () => {
    const givenPermissions = new DataPermissions(noPermissions);

    await engine
      .handleQuery(sdqlQuery2, givenPermissions)
      .andThen((deliveredInsights) => {
        expect(deliveredInsights.insights!["q1"]).toBe(null);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 2 first insight is null when network permission is not given", async () => {
    const givenPermissions = DataPermissions.createWithPermissions([
      EWalletDataType.Age,
    ]);

    await engine
      .handleQuery(sdqlQuery2, givenPermissions)
      .andThen((deliveredInsights) => {
        expect(deliveredInsights.insights!["q1"]).toBe(null);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 2 first insight is not null when network and age permissions are given", async () => {
    const givenPermissions = DataPermissions.createWithPermissions([
      EWalletDataType.Age,
      EWalletDataType.EVMTransactions,
    ]);

    await engine
      .handleQuery(sdqlQuery2, givenPermissions)
      .andThen((deliveredInsights) => {
        expect(deliveredInsights.insights!["q1"] !== null).toBeTruthy();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("all null when no permissions are given", async () => {
    const givenPermissions = new DataPermissions(noPermissions);

    const expectedResult = {
      q1: null,
      q2: null,
      q3: null,
      q4: null,
      q5: null,
      q6: null,
    };
    await engine
      .handleQuery(sdqlQuery2, givenPermissions)
      .andThen((deliveredInsights) => {
        expect(deliveredInsights.insights).toEqual(expectedResult);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 2 5th insight not null when siteVisits given", async () => {
    const givenPermissions = DataPermissions.createWithPermissions([
      EWalletDataType.SiteVisits,
    ]);

    await engine
      .handleQuery(sdqlQuery2, givenPermissions)
      .andThen((deliveredInsights) => {
        expect(deliveredInsights.insights!["q5"] !== null).toBeTruthy();
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});

describe("Testing avalanche 4", () => {
  test("avalanche 4", async () => {
    const mocks = new QueryParsingMocks();
    const engine = mocks.factory();

    const expectedInsights = {
      q1: { insight: "false", proof: "" },
      q2: { insight: "true", proof: "" },
      q3: { insight: "1", proof: "" },
      q4: { insight: "female", proof: "" },
      q5: { insight: "{}", proof: "" },
      q6: { insight: "[]", proof: "" },
      q7: { insight: "[]", proof: "" },
      q8: { insight: "[]", proof: "" },
    }; 



    await engine
      .handleQuery(sdqlQuery4, new DataPermissions(allPermissions))
      .andThen((deliveredInsights) => {
        expect(deliveredInsights.insights).toEqual(expectedInsights);
        expect(
          Object.values(deliveredInsights.insights!).length > 0,
        ).toBeTruthy();

        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});

describe.only("Testing parsing", () => {
  test("avalanche 4", async () => {
    const mocks = new QueryParsingMocks();
    const engine = mocks.factory();

    
    

    await engine
      .parseQuery(sdqlQuery)
      .andThen((astQuery) => {
        console.log("ral : ",astQuery);
        console.log("mi : ",avalanche1AstInstance)
        expect(astQuery).toMatchObject(avalanche1AstInstance);
        

        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});


