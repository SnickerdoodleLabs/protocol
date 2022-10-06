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
  compensations: {
      parameters: {
        recipientAddress: {
            type: "address",
            required: true
        },
        productId: {
            type: "string",
            required: false,
            values: [
              "https://product1",
              "https://product2",
            ]
        },
        shippingAddress: {
            type: "string",
            required: false,
        },

    },
    c1: {
      description: "10% discount code for Starbucks",
      chainId: 1,
      callback: {
        parameters: [
          "recipientAddress"
        ],
        data: {
          trackingId: "982JJDSLAcx",
        }
      }
    },
    c2: {
      description:
        "participate in the draw to win a CryptoPunk NFT",
      chainId: 1,
      callback: {
        parameters: [
          "recipientAddress",
          "productId"
        ],
        data: {
          trackingId: "982JJDSLAcx",
        }
      },
      alternatives: ["c3"]
    },
    c3: {
      description: "a free CrazyApesClub NFT",
      chainId: 1,
      callback: {
        parameters: [
          "recipientAddress",
          "productId"
        ],
        data: {
          trackingId: "982JJDSLAcx",
        }
      },
      alternatives: ["c2"]
    },
  },
  logic: {
    returns: ["$r1", "$r2", "$r3"],
    compensations: [],
  },
}