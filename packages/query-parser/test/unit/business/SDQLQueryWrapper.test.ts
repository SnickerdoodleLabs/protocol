import "reflect-metadata";

import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  IpfsCID,
  ISO8601DateString,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";

import { SDQLQueryWrapperFactory } from "@query-parser/implementations";
import { avalanche1SchemaStr } from "@query-parser/sampleData/avalanche1.data";

const cid = IpfsCID("0");
const timeUtils = new TimeUtils();
const sdqlQueryWrapperFactory = new SDQLQueryWrapperFactory(timeUtils);

describe("SDQLQueryWrapper with Avalanche", () => {
  test("avalanche 1 has 4 query schema", () => {
    const sdqlSchema = sdqlQueryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, avalanche1SchemaStr),
    );
    const querySchema = sdqlSchema.getQuerySchema();
    expect(Object.keys(querySchema).length).toBe(4);
  });

  test("avalanche q1 is a blockchain transactions query", () => {
    const sdqlSchema = sdqlQueryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, avalanche1SchemaStr),
    );
    const querySchema = sdqlSchema.getQuerySchema();
    expect(querySchema["q1"].name).toBe("network");
  });

  test("avalanche q3 has a integer return", () => {
    const sdqlSchema = sdqlQueryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, avalanche1SchemaStr),
    );
    const querySchema = sdqlSchema.getQuerySchema();
    expect(querySchema["q3"].return).toBe("string");
  });

  // test("avalanche has 4 return schema", () => {
  //   const mocks = new SDQLQueryWrapperMocks();
  //   const sdqlSchema = mocks.makeQueryWrapper(avalanche1SchemaStr);
  //   const returnSchema = sdqlSchema.getReturnSchema();
  //   expect(Object.keys(returnSchema).length).toBe(4);
  // });

  // test("avalanche returns has a url", () => {
  //   const mocks = new SDQLQueryWrapperMocks();
  //   const sdqlSchema = mocks.makeQueryWrapper(avalanche1SchemaStr);
  //   const returnSchema = sdqlSchema.getReturnSchema();
  //   expect("url" in returnSchema).toBeTruthy();
  // });

  // test("avalanche r3 has a query", () => {
  //   const mocks = new SDQLQueryWrapperMocks();
  //   const sdqlSchema = mocks.makeQueryWrapper(avalanche1SchemaStr);
  //   const returnSchema = sdqlSchema.getReturnSchema();
  //   expect("query" in returnSchema["r3"]).toBeTruthy();
  // });

  test("avalanche has 3 compensation schema and 1 parameters", () => {
    const sdqlSchema = sdqlQueryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, avalanche1SchemaStr),
    );
    const compensationSchema = sdqlSchema.getCompensationSchema();
    expect(Object.keys(compensationSchema).length).toBe(4);
    expect(Object.keys(compensationSchema).includes("parameters")).toBeTruthy();
    expect(Object.keys(compensationSchema).includes("c1")).toBeTruthy();
    expect(Object.keys(compensationSchema).includes("c2")).toBeTruthy();
    expect(Object.keys(compensationSchema).includes("c3")).toBeTruthy();
  });

  // test("avalanche has 2 logic schema", () => {
  //   const mocks = new SDQLQueryWrapperMocks();
  //   const sdqlSchema = mocks.makeQueryWrapper(avalanche1SchemaStr);
  //   const logicSchema = sdqlSchema.getLogicSchema();
  //   expect(Object.keys(logicSchema).length).toBe(2);
  // });

  test("date fix", () => {
    const schemaStr = SDQLString(
      JSON.stringify({
        version: 0.1,
        description:
          "Intractions with the Avalanche blockchain for 15-year and older individuals",
        business: "Shrapnel",
        timestamp: "2021-11-13T20:20:39",
        expiry: "2023-11-13T20:20:39+00:00",
      }),
    );
    const schema = sdqlQueryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, schemaStr),
    );

    expect(schema.fixDateFormat(ISO8601DateString("2000-11-13T20:20:39"))).toBe(
      "2000-11-13T20:20:39Z",
    );

    expect(schema.internalObj.timestamp).toBe("2021-11-13T20:20:39Z");
    expect(schema.internalObj.expiry).toBe("2023-11-13T20:20:39+00:00");
  });
});
