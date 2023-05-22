import "reflect-metadata";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  AdKey,
  AdSignature,
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

describe("Dummy describe block", () => {
  test("Dummy test", async () => {
    const schemaString = SDQLString(avalanche1SchemaStr);
    expect(1).toBe(1);
  });
});

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
  });
});

// describe("SDQLQueryUtils query to compensation tests", () => {
//   test("avalanche 1: ['q1'] -> ['c1']", async () => {
//     // input-output
//     const schemaString = SDQLString(avalanche1SchemaStr);
//     const queryIds = ["q1"].map(SubQueryKey);
//     const expected = ["c1"];

//     const mocks = new SDQLQueryUtilsMocks();
//     const resultWrapped = await mocks
//       .factory()
//       .getEligibleCompensations(schemaString, queryIds);

//     expect(resultWrapped.isOk()).toBeTruthy();
//     expect(resultWrapped._unsafeUnwrap()).toEqual(expected);
//   });

//   test("avalanche 1: ['q2'] -> ['c2']", async () => {
//     // input-output
//     const schemaString = SDQLString(avalanche1SchemaStr);
//     const queryIds = ["q2"].map(SubQueryKey);
//     const expected = ["c2"];

//     const mocks = new SDQLQueryUtilsMocks();
//     const result = await mocks
//       .factory()
//       .getEligibleCompensations(schemaString, queryIds);

//     expect(result.isOk()).toBeTruthy();
//     expect(result._unsafeUnwrap()).toEqual(expected);
//   });
//   test("avalanche 1: ['q3'] -> ['c3']", async () => {
//     // input-output
//     const schemaString = SDQLString(avalanche1SchemaStr);
//     const queryIds = ["q3"].map(SubQueryKey);
//     const expected = ["c3"];

//     const mocks = new SDQLQueryUtilsMocks();
//     const result = await mocks
//       .factory()
//       .getEligibleCompensations(schemaString, queryIds);

//     expect(result.isOk()).toBeTruthy();

//     expect(result._unsafeUnwrap()).toEqual(expected);
//   });
//   test("avalanche 1: ['q1', 'q2'] -> ['c1', 'c2']", async () => {
//     // input-output
//     const schemaString = SDQLString(avalanche1SchemaStr);
//     const queryIds = ["q1", "q2"].map(SubQueryKey);
//     const expected = ["c1", "c2"];

//     const mocks = new SDQLQueryUtilsMocks();
//     const result = await mocks
//       .factory()
//       .getEligibleCompensations(schemaString, queryIds);

//     expect(result.isOk()).toBeTruthy();

//     expect(result._unsafeUnwrap()).toEqual(expected);
//   });
// });
