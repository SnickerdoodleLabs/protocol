import { TimeUtils } from "@snickerdoodlelabs/common-utils";
import { SDQLString, MillisecondTimestamp } from "@snickerdoodlelabs/objects";

const timeUtils = new TimeUtils();

export const avalanche1SchemaStr = SDQLString(
  JSON.stringify({
    version: 0.1,
    timestamp: timeUtils.getISO8601TimeString(),
    expiry: timeUtils.getISO8601TimeString(
      MillisecondTimestamp(Date.now() + 1000 * 60 * 60 * 24),
    ),
    description:
      "Interactions with the Avalanche blockchain for 15-year and older individuals",
    business: "Shrapnel",
    ads: {
      a1: {
        name: "a1",
        content: {
          type: "image",
          src: "testSrc",
        },
        text: "QWEQWEWQE",
        displayType: "banner",
        weight: 6,
        expiry: 1735678800,
        keywords: ["a", "b", "c"],
        target: "$q1",
      },
      a2: {
        name: "a2",
        content: {
          type: "video",
          src: "testSrc",
        },
        text: "ASDASD",
        displayType: "popup",
        weight: 7,
        expiry: 1735678,
        keywords: ["1", "2", "3"],
        target: "$q2",
      },
      a3: {
        name: "a3",
        content: {
          type: "image",
          src: "testSrc",
        },
        text: "text",
        displayType: "banner",
        weight: 8,
        expiry: 1735678800,
        keywords: ["q", "w", "e"],
        target: "$q1>30",
      },
      
      
    },
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
        return: "number"
      },
      q3: {
        name: "location",
        return: "string",
      },
      q4: {
        name: "balance",
        networkid: "1",
        conditions: {
          ge: 10,
        },
        return: "array",
      },
    },
    insights: {
      i1: {
        name: "user age range",
        target: "$q2>10",
        returns: "'qualified'",
      },
      i2: {
        name: "q2",
        target: "$q2",
        returns: "'yum'",//TODO add not qualified
      },
      i3: {
        name: "query_response",
        target: "true",
        returns: "$q3",
      },
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
        requires: "$i1",
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
        requires: "$i1 and $i2",
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
        requires: "$i3 or $a1",
        chainId: 1,
        callback: {
          parameters: ["recipientAddress", "productId"],
          data: {
            trackingId: "982JJDSLAcx",
          },
        },
      },
    },
  }),
);
