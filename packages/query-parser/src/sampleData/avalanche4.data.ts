import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { MillisecondTimestamp } from "@snickerdoodlelabs/objects";

const timeUtils = new TimeUtils();
export const avalanche4SchemaStr = JSON.stringify({
  version: "0.1",
  timestamp: "2023-09-25T17:28:25.898Z",
  description: "",
  business: "b55edb39-d9f3-457b-bf7b-4256f8dcb4c1",
  queries: {
    q1: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "MATIC",
      contract: {
        networkid: "137",
        address: "ax",
        function: "Transfer",
        direction: "to",
        timestampRange: {
          start: 0,
          end: "<this should be populated with epoch time>",
        },
      },
    },
    q2: {
      name: "chain_transactions",
      return: "array",
      array_items: {
        type: "object",
        object_schema: {
          properties: {
            tickerSymbol: { type: "string" },
            incomingValue: { type: "number" },
            incomingCount: { type: "integer" },
            outgoingValue: { type: "number" },
            outgoingCount: { type: "integer" },
          },
          required: [
            "tickerSymbol",
            "incomingValue",
            "incomingCount",
            "outgoingValue",
            "outgoingCount",
          ],
        },
      },
    },
  },
  ads: {},
  insights: {
    i1: { name: "Transaction History", target: "$q1", returns: "$q1" },
    i2: { name: "Dapps", target: "$q2", returns: "$q2" },
  },
  compensations: {
    parameters: { recipientAddress: { type: "0x", required: false } },
    c1: {
      name: "hashut",
      image: "QmNTHRwMkS4tRz7i29KRbcneZm9eqkeyy65rZxQZZrVV71",
      description: "hashut",
      chainId: 31337,
      requires: " $i1 ",
      callback: {
        parameters: ["recipientAddress"],
        data: { trackingId: "982JJDSLAcx" },
      },
    },
  },
  expiry: "3022-09-13T19:19:42.000Z",
});
