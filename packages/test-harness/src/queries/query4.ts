export const query4 = {
  version: 0.1,
  timestamp: "2023-02-01T15:33:08.421Z",
  expiry: "3022-09-13T19:19:42.000Z",
  description: "Ad query with no returns",
  business: "Hentai Paradise",
  ads: {
    a1: {
      name: "TestAd1",
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
      name: "TestAd2",
      content: {
        type: "video",
        src: "testSrc",
      },
      text: "ASDASD",
      displayType: "popup",
      weight: 7,
      expiry: 1735678,
      keywords: ["1", "2", "3"],
      target: "true",
    },
    a3: {
      name: "TestAd3",
      content: {
        type: "image",
        src: "testSrc",
      },
      text: "text",
      displayType: "banner",
      weight: 8,
      expiry: 1735678800,
      keywords: ["q", "w", "e"],
      target: "true",
    },
  },
  queries: {
    q1: {
      name: "age",
      return: "boolean",
      conditions: {
        ge: 18,
      },
    },
    q2: {
      name: "gender",
      return: "enum",
      enum_keys: ["female", "male", "nonbinary", "unknown"],
    },
  },
  compensations: {
    c1: {
      name: "The CryptoPunk Draw",
      image: "tq432RLMic98mbKCGsMnRxWqxMsKPL8wBQ333PBEmWNuT9",
      description: "participate in the draw to win a CryptoPunk NFT",
      requires: "$q2",
      chainId: 31337,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c2: {
      name: "SECOND REWARD NAME",
      image: "tq432RLMic98mbKCGsMnRxWqxMsKPL8wBQ333PBEmWNuT8",
      description: "SECOND REWARD DESC",
      requires: "$a1",
      chainId: 31337,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c3: {
      name: "THIRD REWARD NAME",
      image: "tq432RLMic98mbKCGsMnRxWqxMsKPL8wBQ333PBEmWNuT1",
      description: "THIRD REWARD DESC",
      requires: "$a1 and $a2",
      chainId: 31337,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c4: {
      name: "FOURTH REWARD NAME",
      image: "qq432RLMic98mbKCGsMnRxWqxMsKPL8wBQ333PBEmWNuT1",
      description: "FOURTH REWARD DESC",
      requires : "$a3",
      chainId: 31337,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
  }
};
