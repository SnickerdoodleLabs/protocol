import { TimeUtils } from "@snickerdoodlelabs/common-utils";

const timeUtils = new TimeUtils();
export const avalanche4SchemaStr = JSON.stringify(
{
  version: 0.1,
  timestamp:  timeUtils.getISO8601TimeString(),
  expiry : timeUtils.getISO8601TimeString(Date.now() + (1000 * 60 * 60 * 24)),
  description:
  "Interactions with the Avalanche blockchain for 15-year and older individuals",
  business: "Shrapnel",
  queries: {
    q1: {
      name: "network",
      return: "boolean",
      chain: "AVAX",
      contract: {
        networkid: "43114",
        address: "0x9366d30feba284e62900f6295bc28c9906f33172",
        function: "Transfer",
        direction: "from",
        token: "ERC20",
        blockrange: {
          start: 13001519,
          end: 14910334,
        },
      },
    },
    q2: {
      name: "age",
      return: "boolean",
      conditions: {
        ge: 15,
      },
    },
    q3: {
        name: "location",
        return: "string",
    },
    q4: {
      name: "gender",
      return: "enum",
      enum_keys: ["female", "male", "nonbinary", "unknown"],
    },
    q5: {
      name: "url_visited_count",
      return: "object",
    },
    q6: {
      name: "chain_transactions",
      return: "array",
    },
    q7: {
      name: "balance",
      networkid: "42",
      conditions: {
        ge: 10,
      },
      return: "array"
      
    },
    q8: {
      name: "balance",
      networkid: "*",
      conditions: {
        ge: 10,
      },
      return: "array"
      
    },
  },
  returns: {
    r1: {
      name: "callback",
      message: "qualified",
    },
    r2: {
      name: "callback",
      message: "not qualified",
    },
    r3: {
      name: "query_response",
      query: "q3",
    },
    r4: {
      name: "query_response",
      query: "q4",
    },
    r5: {
      name: "query_response",
      query: "q5",
    },
    r6: {
      name: "query_response",
      query: "q6",
    },
    r7: {
      name: "query_response",
      query: "q7",
    },
    r8: {
      name: "query_response",
      query: "q8",
    },
    url: "https://418e-64-85-231-39.ngrok.io/insights",
  },
  compensations: {
    c1: {
      description: "10% discount code for Starbucks",
      callback: "https://418e-64-85-231-39.ngrok.io/starbucks",
    },
    c2: {
      description:
        "participate in the draw to win a CryptoPunk NFT",
      callback: "https://418e-64-85-231-39.ngrok.io/cryptopunk",
    },
    c3: {
      description: "a free CrazyApesClub NFT",
      callback: "https://418e-64-85-231-39.ngrok.io/crazyapesclub",
    },
  },
  logic: {
    returns: [
      "if($q1and$q2)then$r1else$r2",
      "$r3",
      "$r4",
      "$r5",
      "$r6",
      "$r7",
      "$r8",
    ],
    compensations: ["if$q1then$c1", "if$q2then$c2", "if$q3then$c3"],
  },
}
);