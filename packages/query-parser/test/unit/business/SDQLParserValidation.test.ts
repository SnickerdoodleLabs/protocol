import "reflect-metadata";
import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { IpfsCID, QueryFormatError } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync } from "neverthrow";

import { SDQLQueryWrapperMocks } from "@query-parser-test/mocks";
import { QueryObjectFactory, SDQLParser } from "@query-parser/implementations";

const cid = IpfsCID("0");
const timeUtils = new TimeUtils();

describe.only("Schema validation", () => {
  test("missing version", async () => {
    const schemaStr = JSON.stringify({
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-13T20:20:39Z",
    });
    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);

    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("version")).toBeTruthy();
      });
  });
  test("missing description", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-13T20:20:39Z",
    });
    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);

    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("description")).toBeTruthy();
      });
  });
  test("missing business", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-13T20:20:39Z",
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("business")).toBeTruthy();
      });
  });
  test("missing timestamp", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      expiry: "2023-11-13T20:20:39Z",
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("timestamp")).toBeTruthy();
      });
  });
  test("missing expiry", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39Z",
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("expiry")).toBeTruthy();
      });
  });
  test("invalid timestamp iso 8601", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-1-13T20:20:39Z",
      expiry: "2023-11-13T20:20:39Z",
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("timestamp")).toBeTruthy();
      });
  });
  test("invalid expiry iso 8601", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-10T20:20:39+00",
    });
    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);

    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("expiry")).toBeTruthy();
      });
  });
  test("missing timezone fix", async () => {
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
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateTimeStampExpiry(schema, cid)
      .andThen(() => {
        expect(schema.internalObj.timestamp).toBe("2021-11-13T20:20:39Z");
        expect(schema.internalObj.expiry).toBe("2023-11-13T20:20:39+00:00");
        return okAsync(undefined);
      })
      .mapErr((err) => {
        console.log(err);
        fail("There must be no error");
      });
  });
  test("missing queries", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-10T20:20:39Z",
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("queries")).toBeTruthy();
      });
  });
  test("missing returns", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-10T20:20:39Z",
      queries: {
        q2: {
          name: "age",
          return: "boolean",
          conditions: {
            ge: 15,
          },
        },
      },
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("returns")).toBeTruthy();
      });
  });

  test("missing compensations", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-10T20:20:39Z",
      queries: {
        q2: {
          name: "age",
          return: "boolean",
          conditions: {
            ge: 15,
          },
        },
      },
      returns: {
        r1: {
          name: "callback",
          message: "qualified",
        },
      },
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        fail("didn't return error");
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("compensations")).toBeTruthy();
      });
  });

  test("missing logic", async () => {
    const schemaStr = JSON.stringify({
      version: 0.1,
      description:
        "Intractions with the Avalanche blockchain for 15-year and older individuals",
      business: "Shrapnel",
      timestamp: "2021-11-13T20:20:39Z",
      expiry: "2023-11-10T20:20:39Z",
      queries: {
        q2: {
          name: "age",
          return: "boolean",
          conditions: {
            ge: 15,
          },
        },
      },
      returns: {
        r1: {
          name: "callback",
          message: "qualified",
        },
      },

      compensations: {
        c1: {
          description: "10% discount code for Starbucks",
          callback: "https://418e-64-85-231-39.ngrok.io/starbucks",
        },
      },
    });

    const mocks = new SDQLQueryWrapperMocks();
    const schema = mocks.makeQueryWrapper(schemaStr);
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    await parser
      .validateSchema(schema, cid)
      .andThen(() => {
        // fail("didn't return error")
        return errAsync(new Error("didn't return error"));
      })
      .mapErr((err) => {
        expect(err.constructor).toBe(QueryFormatError);
        expect(err.message.includes("logic")).toBeTruthy();
      });
  });
});
