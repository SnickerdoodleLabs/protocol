export const query3 = {
  version: 0.1,
  timestamp: "2022-12-13T20:20:39Z",
  expiry: "2049-11-13T20:20:39Z",
  description: "Example query for 2 ads",
  business: "Hentai Paradise",
  ads: {
    a1: {
      name: "a1",
      content: {
        type: "image",
        src: "https://mycdn.com/img1",
      },
      text: "Example ad text",
      displayType: "banner",
      weight: 100,
      expiry: "2039-11-13T20:20:39Z",
      keywords: ["muktadir", "charlie", "todd"],
      target: "$q1",
    },
    a2: {
      name: "a2",
      content: {
        type: "image",
        src: "https://mycdn.com/img1",
      },
      text: "Second Example ad text",
      displayType: "banner",
      weight: 10,
      expiry: "2039-11-13T20:20:39Z",
      keywords: ["messi", "xavi", "iniesta"],
      target: "true",
    },
    a3: {
      name: "a3",
      content: {
        type: "video",
        src: "https://mycdn.com/vid1",
      },
      text: "third Example ad text",
      displayType: "banner",
      weight: 11,
      expiry: "2034-11-13T20:20:39Z",
      keywords: ["a", "b", "c"],
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
  },
  insights: {
    i1: {
      name: "callback",
      target: "true",
      returns: "'qualified'",
    },
    i2: {
      name: "callback",
      target: "true",
      returns: "'not qualified'",
    },
    i3: {
      name: "callback",
      target: "$q2",
      returns: "'nice'",
    },
  },
  compensations: {
    parameters: {
      recipientAddress: {
        type: "address",
        required: true,
      },
    },
    c1: {
      name: "The CryptoPunk Draw",
      image: "33tq432RLMiMsKc98mbKC3P8NuTGsMnRxWqxBEmWPL8wBQ",
      description: "participate in the draw to win a CryptoPunk NFT",
      requires: "$i3",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c2: {
      name: "CrazyApesClub NFT distro",
      image: "GsMnRxWqxMsKc98mbKC3PBEmWNuTPL8wBQ33tq432RLMi8",
      description: "a free CrazyApesClub NFT",
      requires: "$a1",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c3: {
      name: "CrazyApesClub NFT distro 2",
      image: "tq432RLMic98mbKCGsMnRxWqxMsKPL8wBQ333PBEmWNuT8",
      description: "another free CrazyApesClub NFT",
      requires: "$a1 and $a2",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
    c4: {
      name: "I'm out of compensation names",
      image: "98mbKqxMsKPL8wBMnRxW32RLMicQ333PBEmWNutq4CGsT8",
      description: "some string",
      requires: "$a3",
      chainId: 1,
      callback: {
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
  },
};
