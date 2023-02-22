export const query4 = {
  version: 0.1,
  timestamp: "2023-02-01T15:33:08.421Z",
  expiry: "3022-09-13T19:19:42.000Z",
  description: "Example query for 2 ads",
  business: "Hentai Paradise",
  ads: {
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
    },
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
    c3: {
      name: "THIRD REWARD NAME",
      image: null,
      description: "THIRD REWARD DESC",
      chainId: 31337,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c1: {
      name: "The CryptoPunk Draw",
      image: null,
      description: "participate in the draw to win a CryptoPunk NFT",
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
      image: null,
      description: "FOURTH REWARD DESC",
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
      image: null,
      description: "SECOND REWARD DESC",
      chainId: 31337,
      callback: {
        parameters: ["recipientAddress"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
  },
  logic: {
    ads: ["if$q1then$a1", "$a2"],
    compensations: [
      "if$q2then$c1",
      "if$a1then$c2",
      "if($a1and$a2)then$c3",
      "if$a3then$c4",
    ],
  },
};
