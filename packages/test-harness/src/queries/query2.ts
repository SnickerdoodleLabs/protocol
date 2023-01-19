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
            tickerSymbol: {
              type: "string",
            },
            incomingValue: {
              type: "number"
            },
            incomingCount: {
              type: "integer"
            },
            outgoingValue: {
              type: "number"
            },
            outgoingCount: {
              type: "integer"
            }
          },
          required: [
            "tickerSymbol", 
            "incomingValue", 
            "incomingCount",
            "outgoingValue", 
            "outgoingCount",
          ],
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
      name: "Sugar to your coffee",
      image: "QmbWqxBEKC3P8tqsKc98xmWN33432RLMiMPL8wBuTGsMnR",
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
      name: "The CryptoPunk Draw",
      image: "33tq432RLMiMsKc98mbKC3P8NuTGsMnRxWqxBEmWPL8wBQ",
      description: "participate in the draw to win a CryptoPunk NFT",
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
      name: "CrazyApesClub NFT distro",
      image: "GsMnRxWqxMsKc98mbKC3PBEmWNuTPL8wBQ33tq432RLMi8",
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
    compensations: ["$c1", "$c2", "$c3"],
  },
}