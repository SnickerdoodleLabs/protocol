import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import {
  IpfsCID,
  MillisecondTimestamp,
  MissingASTError,
  QueryFormatError,
  SDQLQuery,
  SDQLString,
} from "@snickerdoodlelabs/objects";
import "reflect-metadata";

import {
  QueryObjectFactory,
  SDQLParser,
} from "@query-parser/implementations/business/index.js";
import { SDQLQueryWrapperFactory } from "@query-parser/implementations/utilities/index.js";

const cid = IpfsCID("0");
const timeUtils = new TimeUtils();
const futureTimeISO = timeUtils.getISO8601TimeString(
  MillisecondTimestamp(Date.now() + 1000 * 60 * 60 * 24),
);
const pastTimeISO = timeUtils.getISO8601TimeString(
  MillisecondTimestamp(Date.now() - 1000 * 60 * 60 * 24),
);
const currentTimeISO = timeUtils.getISO8601TimeString();
const queryWrapperFactory = new SDQLQueryWrapperFactory(timeUtils);

describe.only("Schema context validation", () => {
  test("invalid return query", async () => {
    const schemaStr = SDQLString(
      JSON.stringify({
        version: 0.1,
        description:
          "Intractions with the Avalanche blockchain for 15-year and older individuals",
        business: "Shrapnel",
        timestamp: currentTimeISO,
        expiry: futureTimeISO,
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
          r2: {
            name: "query_response",
            query: "q0",
          },
        },

        compensations: {
          c1: {
            description: "10% discount code for Starbucks",
            callback: "https://418e-64-85-231-39.ngrok.io/starbucks",
          },
        },

        logic: {
          returns: [],
          compensations: [],
        },
      }),
    );

    const schema = queryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, schemaStr),
    );
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    const res = await parser.buildAST();

    if (res.isOk()) {
      // console.log(res.value.returns)
      fail("Didn't catch the error for q0");
    }
    if (res.isErr()) {
      // console.log(res.error)
      expect(res.error.constructor).toBe(MissingASTError);
      const error = res.error as MissingASTError;
      expect(error.forId).toBe("q0");
    }
  });
  test("invalid return schema", async () => {
    const schemaStr = SDQLString(
      JSON.stringify({
        version: 0.1,
        description:
          "Intractions with the Avalanche blockchain for 15-year and older individuals",
        business: "Shrapnel",
        timestamp: currentTimeISO,
        expiry: futureTimeISO,
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
          r2: {
            name: "query_response",
            invalid: "invalid",
          },
        },

        compensations: {
          c1: {
            description: "10% discount code for Starbucks",
            callback: "https://418e-64-85-231-39.ngrok.io/starbucks",
          },
        },

        logic: {
          returns: [],
          compensations: [],
        },
      }),
    );

    const schema = queryWrapperFactory.makeWrapper(
      new SDQLQuery(cid, schemaStr),
    );
    const parser = new SDQLParser(cid, schema, new QueryObjectFactory());

    const res = await parser.buildAST();

    if (res.isOk()) {
      // console.log(res.value.returns)
      fail("Didn't catch the error for invalid");
    }
    if (res.isErr()) {
      // console.log(res.error)
      expect(res.error.constructor).toBe(QueryFormatError);
      const error = res.error as QueryFormatError;
      expect(error.data.invalid).toBe("invalid");
    }
  });
});
