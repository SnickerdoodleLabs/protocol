export const query2 = {
  version: 0.1,
  timestamp: "2021-11-13T20:20:39",
  expiry: "2022-11-13T20:20:39",
  description: "///This should dynamically populate",
  business: "/////This should dynamically populate",
  queries: {
    q1: {
      name: "url_visited_count",
      return: "object",
      object_schema: {
        patternProperties: {
          "^http(s)?://[\\-a-zA-Z0-9]*.[a-zA-Z0-9]*.[a-zA-Z]*/[a-zA-Z0-9]*$":
            {
              type: "integer",
            },
        },
      },
    },
    q2: {
      name: "chain_transaction_count",
      return: "object",
      object_schema: {
        patternProperties: {
          "^ETH|AVAX|SOL$": {
            type: "integer",
          },
        },
      },
    },
    q3: {
      name: "balance",
      networkid: "*",
      return: "array",
      array_items: {
        type: "object",
        object_schema: {
          properties: {
            address: {
              type: "string",
            },
            networkId: {
              type: "integer",
            },
            balance: {
              type: "number",
            },
          },
          required: ["networkId", "balance"],
        },
      },
    },
  },
  returns: {
    r1: {
      name: "query_response",
      query: "q1",
    },
    r2: {
      name: "query_response",
      query: "q2",
    },
    r3: {
      name: "query_response",
      query: "q3",
    },
    url: "/////This should dynamically populate",
  },
  logic: {
    returns: ["$r1", "$r2", "$r3"],
    compensations: [],
  },
}