import "reflect-metadata";
import { avalance1SchemaStr } from "./avalanche1.data";
import { SDQLQueryWrapper } from "@query-parser/interfaces/objects";
import { SDQLString } from "@snickerdoodlelabs/objects";

describe("SDQLQueryWrapper with Avalanche", () => {
  const sdqlSchema = SDQLQueryWrapper.fromString(SDQLString(avalance1SchemaStr));
  const querySchema = sdqlSchema.getQuerySchema();
  const returnSchema = sdqlSchema.getReturnSchema();
  const compensationSchema = sdqlSchema.getCompensationSchema();
  const logicSchema = sdqlSchema.getLogicSchema();

  test("avalance 1 has 4 query schema", () => {
    // console.log(sdqlSchema);
    // console.log(querySchema);
    expect(Object.keys(querySchema).length).toBe(4);
  });

  test("avalance q1 is a network query", () => {
    expect(querySchema["q1"].name).toBe("network");
  });

  test("avalance q3 has a integer return", () => {
    expect(querySchema["q3"].return).toBe("string");
  });

  test("avalance has 4 return schema", () => {
    expect(Object.keys(returnSchema).length).toBe(4);
  });

  test("avalance returns has a url", () => {
    expect("url" in returnSchema).toBeTruthy();
  });

  test("avalance r3 has a query", () => {
    expect("query" in returnSchema["r3"]).toBeTruthy();
  });

  test("avalance has 3 compensation schema", () => {
    expect(Object.keys(compensationSchema).length).toBe(3);
  });

  test("avalance has 2 logic schema", () => {
    expect(Object.keys(logicSchema).length).toBe(2);
  });

  test("date fix", () => {
    const schema = SDQLQueryWrapper.fromString(SDQLString(JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39",
      expiry: "2023-11-13T20:20:39+00:00",
    })));

    expect(schema.fixDateFormat("2000-11-13T20:20:39")).toBe("2000-11-13T20:20:39Z")

    expect(schema.internalObj.timestamp).toBe("2021-11-13T20:20:39Z")
    expect(schema.internalObj.expiry).toBe("2023-11-13T20:20:39+00:00")
  })
});
