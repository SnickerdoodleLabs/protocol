export const query2 = {
  version: 0.1,
  timestamp: "2021-11-13T20:20:39Z",
  expiry: "2023-11-13T20:20:39Z",
  description: "///This should dynamically populate",
  business: "/////This should dynamically populate",
  queries: {
    q1: {
      name: "url_visited_count",
      return: "object"
    },
    q2: {
      name: "chain_transactions",
      return: "array",
      array_items: {
        type: "object",
        object_schema: {
          properties: {
            networkId: {
              type: "string",
            },
            value: {
              type: "number",
            },
            count: {
              type: "integer",
            }
          },
          required: ["networkId", "value", "count"],
        }
      }
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
              type: "string",
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