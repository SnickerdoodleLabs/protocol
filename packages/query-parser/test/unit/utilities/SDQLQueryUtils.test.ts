import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLString } from "@snickerdoodlelabs/objects";

import {
  QueryObjectFactory,
  SDQLQueryUtils,
  SDQLQueryWrapperFactory,
} from "@query-parser/implementations";
import { SDQLParserFactory } from "@query-parser/implementations/utilities/SDQLParserFactory";
import { ISDQLParserFactory } from "@query-parser/interfaces";
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
}

describe("Dummy describe block", () => {
  test("Dummy test", async () => {
    const schemaString = SDQLString(avalanche1SchemaStr);
    expect(1).toBe(1);
  });
});

// describe("SDQLQueryUtils query to compensation tests", () => {
//   test("avalanche 1: ['q1'] -> ['c1']", async () => {
//     // input-output
//     const schemaString = SDQLString(avalanche1SchemaStr);
//     const queryIds = ["q1"].map(SubqueryKey);
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
//     const queryIds = ["q2"].map(SubqueryKey);
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
//     const queryIds = ["q3"].map(SubqueryKey);
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
//     const queryIds = ["q1", "q2"].map(SubqueryKey);
//     const expected = ["c1", "c2"];

//     const mocks = new SDQLQueryUtilsMocks();
//     const result = await mocks
//       .factory()
//       .getEligibleCompensations(schemaString, queryIds);

//     expect(result.isOk()).toBeTruthy();

//     expect(result._unsafeUnwrap()).toEqual(expected);
//   });
// });
