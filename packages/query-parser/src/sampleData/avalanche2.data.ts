import { TimeUtils } from "@snickerdoodlelabs/common-utils";

const timeUtils = new TimeUtils();
export const avalanche2SchemaStr = JSON.stringify({
  version: 0.1,
  timestamp: timeUtils.getISO8601TimeString(),
  expiry: timeUtils.getISO8601TimeString(Date.now() + 1000 * 60 * 60 * 24),
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
        timestampRange: {
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
    url: "https://418e-64-85-231-39.ngrok.io/insights",
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
  logic: {
    returns: ["if($q1and$q2)then$r1else$r2", "$r3", "$r4", "$r5"],
    compensations: ["if$q1then$c1", "if$q2then$c2", "if$q3then$c3"],
  },
});
