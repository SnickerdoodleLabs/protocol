export const query2 = {
  version: 0.1,
  timestamp: "2021-11-13T20:20:39Z",
  expiry: "2023-11-13T20:20:39Z",
  description: "///This should dynamically populate",
  business: "/////This should dynamically populate",
  queries: {
    q1: {
      name: "url_visited_count",
      return: "object",
      timestampRange: {
        start: "450",
        end: "*",
      },
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
              type: "number",
            },
            incomingCount: {
              type: "integer",
            },
            outgoingValue: {
              type: "number",
            },
            outgoingCount: {
              type: "integer",
            },
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
    q4 : {
      name: "url_visited_count",
      return: "object",
      timestampRange: {
        start: "*",
        end: "50",
      },
    }
    
  },
  insights: {
    i1: {
      name: "callback",
      target :"true",
      returns: "$q1",
    },
    i2: {
      name: "callback",
      target :"true",
      returns: "$q2",
    },
    i3: {
      name: "callback",
      target :"true",
      returns: "$q3",
    },
    i4: {
      name: "callback",
      target :"true",
      returns: "$q4",
    }
  },
  compensations: {
    parameters: {
      recipientAddress: {
        type: "address",
        required: true,
      },
      productId: {
        type: "string",
        required: false,
        values: ["https://product1", "https://product2"],
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
      requires : "true",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c2: {
      name: "The CryptoPunk Draw",
      image: "33tq432RLMiMsKc98mbKC3P8NuTGsMnRxWqxBEmWPL8wBQ",
      description: "participate in the draw to win a CryptoPunk NFT",
      requires : "true",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
      alternatives: ["c3"],
    },
    c3: {
      name: "CrazyApesClub NFT distro",
      image: "GsMnRxWqxMsKc98mbKC3PBEmWNuTPL8wBQ33tq432RLMi8",
      description: "a free CrazyApesClub NFT",
      requires : "true",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
      alternatives: ["c2"],
    },
  },
  
};
