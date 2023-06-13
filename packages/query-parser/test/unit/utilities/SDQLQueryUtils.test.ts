import "reflect-metadata";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  AdKey,
  AdSignature,
  ChainId,
  CompensationKey,
  ERewardType,
  EVMContractAddress,
  IInsightWithProof,
  Insight,
  InsightKey,
  InsightString,
  InsightWithProof,
  IpfsCID,
  IQueryDeliveryAds,
  IQueryDeliveryInsights,
  IQueryDeliveryItems,
  JsonWebToken,
  PossibleReward,
  ProofString,
  QueryDeliveryItems,
  SDQLString,
} from "@snickerdoodlelabs/objects";

import {
  QueryObjectFactory,
  SDQLQueryUtils,
  SDQLQueryWrapperFactory,
} from "@query-parser/implementations";
import { SDQLParserFactory } from "@query-parser/implementations/utilities/SDQLParserFactory";
import { ISDQLParserFactory } from "@query-parser/interfaces/utilities/ISDQLParserFactory.js";
import { avalanche1SchemaStr } from "@query-parser/sampleData";
import { okAsync } from "neverthrow";

const avalanche1PossibleRewards = [
  new PossibleReward(
    IpfsCID(""),
    CompensationKey("c1"),
    ["location"],
    "c1",
    IpfsCID("QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR"),
    "10% discount code for Starbucks",
    ChainId(1),
    ERewardType.Direct,
  ),
  new PossibleReward(
    IpfsCID(""),
    CompensationKey("c2"),
    ["location", "age"],
    "c2",
    IpfsCID("33tq432RLMiMsKc98mbKC3P8NuTGsMnRxWqxBEmWPL8wBQ"),
    "participate in the draw to win a CryptoPunk NFT",
    ChainId(1),
    ERewardType.Direct,
  ),
  new PossibleReward(
    IpfsCID(""),
    CompensationKey("c3"),
    ["location"],
    "c3",
    IpfsCID("GsMnRxWqxMsKc98mbKC3PBEmWNuTPL8wBQ33tq432RLMi8"),
    "a free CrazyApesClub NFT",
    ChainId(1),
    ERewardType.Direct,
  ),
];

const queryDeliveryItems: QueryDeliveryItems = {
  insights: {
    i1: { insight: InsightString("qualified"), proof: ProofString("") },
    i2: { insight: InsightString("tasty"), proof: ProofString("") },
    i3: { insight: InsightString("1"), proof: ProofString("") },
  },
  ads: {},
};

const avalanche1RewardKeys = [
  CompensationKey("c1"),
  CompensationKey("c2"),
  CompensationKey("c3"),
];

const avalanche1AnsweredInsights = [
  InsightKey("i1"),
  InsightKey("i2"),
  InsightKey("i3"),
];

const avalanche1AnsweredAds = [AdKey("a1"), AdKey("a2"), AdKey("a3")];
class SDQLQueryUtilsMocks {
  protected parserFactory: ISDQLParserFactory;
  readonly queryWrapperFactory = new SDQLQueryWrapperFactory(new TimeUtils());
  readonly queryObjectFactory = new QueryObjectFactory();

  constructor() {
    this.parserFactory = new SDQLParserFactory(
      this.queryObjectFactory,
      this.queryWrapperFactory,
    );
  }

  public factory(): SDQLQueryUtils {
    return new SDQLQueryUtils(this.parserFactory, this.queryWrapperFactory);
  }

  private getInsightWithProof(name: string, data: string): IInsightWithProof {
    return new InsightWithProof(new Insight(InsightKey(name), data), "zkp");
  }

  private getAdSignature(name: string): AdSignature {
    return new AdSignature(
      EVMContractAddress(""),
      IpfsCID(""),
      AdKey(name),
      JsonWebToken(""),
    );
  }

  public getQueryDeliveryItems(): IQueryDeliveryItems {
    return new QueryDeliveryItems(
      this.getQueryDeliveryInsights(),
      this.getQueryDeliveryAds(),
    );
  }

  public getQueryDeliveryInsights(): IQueryDeliveryInsights {
    return {
      i1: this.getInsightWithProof("i1", "Hello World"),
      i2: null,
    };
  }

  public getQueryDeliveryAds(): IQueryDeliveryAds {
    return {
      a1: this.getAdSignature("a1"),
      a2: null,
    };
  }
}

describe("Compensation tests", () => {
  test("createAvailableMapForRequiresEvaluator test", async () => {
    // Acquire
    const mocks = new SDQLQueryUtilsMocks();
    const utils = mocks.factory();
    const queryDeliveryItems = mocks.getQueryDeliveryItems();
    const insightKeys = Object.keys(mocks.getQueryDeliveryInsights());
    const adKeys = Object.keys(mocks.getQueryDeliveryAds());
    const expectedKeys = [...insightKeys, ...adKeys];

    // Act
    const availableMap =
      utils["createAvailableMapForRequiresEvaluator"](queryDeliveryItems);

    // Assert
    // 1. validate keys and values
    const gotKeys = [...availableMap.keys()];
    expect(expectedKeys).toEqual(gotKeys);
    availableMap.forEach((val, key) => {
      if (key == "i1") expect(val).toBeDefined();
      else if (key == "a1") expect(val).toBeDefined();
      else if (key == "i2") expect(val).toBeNull();
      else if (key == "a2") expect(val).toBeNull();
    });
  });

  test("getCompensationsToDispense test", async () => {
    // Acquire
    const mocks = new SDQLQueryUtilsMocks();
    const utils = mocks.factory();
    const queryDeliveryItems = mocks.getQueryDeliveryItems();
    const expectedKeys = ["c1", "c3"];

    // Act
    const result = await utils.getCompensationsToDispense(
      avalanche1SchemaStr,
      queryDeliveryItems, // has values for i1 and a1 only
    );

    // Assert
    expect(result.isOk()).toBeTruthy();
    const dispensableKeys = result._unsafeUnwrap();
    expect(dispensableKeys).toEqual(expectedKeys);
  });

  test("avalanche 1: all insights answered", async () => {
    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .getCompensationsToDispense(avalanche1SchemaStr, queryDeliveryItems)
      .andThen((rewards) => {
        expect(rewards).toStrictEqual(avalanche1RewardKeys);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 1: insight 1 and insight 2 answered", async () => {
    const mocks = new SDQLQueryUtilsMocks();
    const queryDelivery1and2 = queryDeliveryItems;
    queryDelivery1and2.insights!["i3"] = null;
    Object.assign;
    await mocks
      .factory()
      .getCompensationsToDispense(avalanche1SchemaStr, queryDelivery1and2)
      .andThen((rewards) => {
        expect(rewards).toStrictEqual(avalanche1RewardKeys.slice(0, 2));
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 1: ad 1 answered", async () => {
    const queryDeliveryAd1 = queryDeliveryItems;
    const ad1delivery: IQueryDeliveryAds = {
      a1: new AdSignature(
        EVMContractAddress("0x"),
        IpfsCID("CID"),
        AdKey("a1"),
        JsonWebToken("token"),
      ),
    };
    Object.assign(queryDeliveryAd1, { insights: null, ads: ad1delivery });
    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .getCompensationsToDispense(avalanche1SchemaStr, queryDeliveryItems)
      .andThen((rewards) => {
        expect(rewards).toStrictEqual([avalanche1RewardKeys[2]]);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});

describe("SDQLQueryUtils filterCompensationsForPreviews tests", () => {
  test("avalanche 1: all compensations given, all insights", async () => {
    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .filterCompensationsForPreviews(
        avalanche1SchemaStr,
        avalanche1RewardKeys,
        avalanche1AnsweredInsights,
      )
      .andThen((rewards) => {
        expect(rewards).toStrictEqual(avalanche1PossibleRewards);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 1:  compensation 1 ,insight 1 and insight 2 answered", async () => {
    const mocks = new SDQLQueryUtilsMocks();
    Object.assign;
    await mocks
      .factory()
      .filterCompensationsForPreviews(
        avalanche1SchemaStr,
        [avalanche1RewardKeys[0]],
        avalanche1AnsweredInsights.slice(0, 2),
      )
      .andThen((rewards) => {
        expect(rewards).toStrictEqual(avalanche1PossibleRewards.slice(0, 1));
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 1: compensation 1, 3 , all ads answered", async () => {
    const reward1 = avalanche1PossibleRewards[0];
    const reward3 = avalanche1PossibleRewards[2];
    //ad1 depends on network
    Object.assign(reward3, { estimatedQueryDependencies: ["network"] });
    //ad2 depends on age
    Object.assign(reward1, { estimatedQueryDependencies: ["age"] });
    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .filterCompensationsForPreviews(
        avalanche1SchemaStr,
        [avalanche1RewardKeys[0], avalanche1RewardKeys[2]],
        avalanche1AnsweredAds,
      )
      .andThen((rewards) => {
        expect(rewards).toStrictEqual([reward1, reward3]);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 1: all compensations, all insights and all ads answered", async () => {
    const reward1 = avalanche1PossibleRewards[0];
    const reward3 = avalanche1PossibleRewards[2];
    //ad1 depends on network , i1 depends on location
    Object.assign(reward3, {
      estimatedQueryDependencies: ["location", "network"],
    });
    //ad2 depends on age , i3 depends on location
    Object.assign(reward1, { estimatedQueryDependencies: ["location", "age"] });
    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .filterCompensationsForPreviews(
        avalanche1SchemaStr,
        avalanche1RewardKeys,
        [...avalanche1AnsweredAds, ...avalanche1AnsweredInsights],
      )
      .andThen((rewards) => {
        expect(rewards).toStrictEqual([
          reward1,
          avalanche1PossibleRewards[1],
          reward3,
        ]);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});
