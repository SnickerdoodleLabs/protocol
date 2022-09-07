import { ISO8601DateString } from "@snickerdoodlelabs/objects";
import "reflect-metadata";
import { SDQLQueryWrapperMocks } from "../../mocks";
import { avalance1SchemaStr } from "./avalanche1.data";



describe("SDQLQueryWrapper with Avalanche", () => {

  test("avalance 1 has 4 query schema", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const querySchema = sdqlSchema.getQuerySchema();
    expect(Object.keys(querySchema).length).toBe(4);
  });

  test("avalance q1 is a network query", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const querySchema = sdqlSchema.getQuerySchema();
    expect(querySchema["q1"].name).toBe("network");
  });

  test("avalance q3 has a integer return", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const querySchema = sdqlSchema.getQuerySchema();
    expect(querySchema["q3"].return).toBe("string");
  });

  test("avalance has 4 return schema", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const returnSchema = sdqlSchema.getReturnSchema();
    expect(Object.keys(returnSchema).length).toBe(4);
  });

  test("avalance returns has a url", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const returnSchema = sdqlSchema.getReturnSchema();
    expect("url" in returnSchema).toBeTruthy();
  });

  test("avalance r3 has a query", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const returnSchema = sdqlSchema.getReturnSchema();
    expect("query" in returnSchema["r3"]).toBeTruthy();
  });

  test("avalance has 3 compensation schema", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const compensationSchema = sdqlSchema.getCompensationSchema();
    expect(Object.keys(compensationSchema).length).toBe(3);
  });

  test("avalance has 2 logic schema", () => {
    const mocks = new SDQLQueryWrapperMocks();
    const sdqlSchema = mocks.makeQueryWrapper(avalance1SchemaStr);
    const logicSchema = sdqlSchema.getLogicSchema();
    expect(Object.keys(logicSchema).length).toBe(2);
  });

  test("date fix", () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39",
      expiry: "2023-11-13T20:20:39+00:00",
    });
    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);

    expect(schema.fixDateFormat(ISO8601DateString("2000-11-13T20:20:39"))).toBe("2000-11-13T20:20:39Z")

    expect(schema.internalObj.timestamp).toBe("2021-11-13T20:20:39Z")
    expect(schema.internalObj.expiry).toBe("2023-11-13T20:20:39+00:00")
  })
});
