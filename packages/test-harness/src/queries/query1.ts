export const query1 = {
  version: 0.1,
  timestamp: "2021-11-13T20:20:39Z",
  expiry: "2023-11-13T20:20:39Z",
  description:
    "Intractions with the Avalanche blockchain for 15-year and older individuals",
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
      return: "integer",
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
      name: "chain_transaction_count",
      return: "object",
    },
    q7: {
      name: "balance",
      networkid: "42",
      conditions: {
        ge: 10,
      },
      return: "array",
      array_items: {
        type: "object",
        object_schema: {
          properties: {
            networkid: {
              type: "integer",
            },
            address: {
              type: "string",
              pattern: "^0x[a-fA-F0-9]{40}$",
            },
            balance: {
              type: "number",
            },
          },
          required: ["networkid", "address", "balance"],
        },
      },
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
      aleternatives: ["c3"]
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
      }
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