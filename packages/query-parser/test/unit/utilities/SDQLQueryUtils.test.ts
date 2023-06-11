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
  InsightWithProof,
  IpfsCID,
  IQueryDeliveryAds,
  IQueryDeliveryInsights,
  IQueryDeliveryItems,
  JsonWebToken,
  PossibleReward,
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

const avalanche1Rewards = [
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
    [],
    "c3",
    IpfsCID("GsMnRxWqxMsKc98mbKC3PBEmWNuTPL8wBQ33tq432RLMi8"),
    "a free CrazyApesClub NFT",
    ChainId(1),
    ERewardType.Direct,
  ),
];
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
});

describe("SDQLQueryUtils query to compensation tests", () => {
  test("avalanche 1: all insights answered", async () => {
    const schemaString = SDQLString(avalanche1SchemaStr);
    const insights = [InsightKey("$i1"), InsightKey("$i2"), InsightKey("$i3")];
    new PossibleReward(
      IpfsCID(""),
      CompensationKey("c1"),
      ["location"],
      "c1",
      IpfsCID("QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR"),
      "10% discount code for Starbucks",
      ChainId(1),
      ERewardType.Direct,
    );

    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .getPossibleRewardsFromIP(schemaString, IpfsCID(""), insights)
      .andThen((rewards) => {
        expect(rewards).toStrictEqual(avalanche1Rewards);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 1: insight 1 and insight 2 answered", async () => {
    const schemaString = SDQLString(avalanche1SchemaStr);
    const insights = [InsightKey("$i1"), InsightKey("$i2")];

    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .getPossibleRewardsFromIP(schemaString, IpfsCID(""), insights)
      .andThen((rewards) => {
        expect(rewards).toStrictEqual(avalanche1Rewards.slice(0, 2));
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });

  test("avalanche 1: ad 1 answered", async () => {
    const schemaString = SDQLString(avalanche1SchemaStr);
    const insights = [AdKey("$a1")];

    const reward3 = avalanche1Rewards[2];
    Object.assign(reward3, { estimatedQueryDependencies: ["network"] });
    // ad 1 depends on the network query
    const mocks = new SDQLQueryUtilsMocks();
    await mocks
      .factory()
      .getPossibleRewardsFromIP(schemaString, IpfsCID(""), insights)
      .andThen((rewards) => {
        expect(rewards).toStrictEqual([reward3]);
        return okAsync(undefined);
      })
      .mapErr((e) => {
        console.log(e);
        fail(e.message);
      });
  });
});
