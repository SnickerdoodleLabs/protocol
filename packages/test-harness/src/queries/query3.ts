export const query3 = {
  version: 0.1,
  timestamp: "2022-12-13T20:20:39Z",
  expiry: "2049-11-13T20:20:39Z",
  description: "Example query for 2 ads",
  business: "Hentai Paradise",
  ads: {
    a1: {
      name: "Image ad name",
      content: {
        type: "image",
        src: "https://mycdn.com/img1"
      },
      text: "Example ad text",
      type: "banner",
      weight: 100,
      expiry: "2039-11-13T20:20:39Z",
      keywords: ["muktadir", "charlie", "todd"]
    },
    a2: {
      name: "Second Image ad name",
      content: {
        type: "image",
        src: "https://mycdn.com/img1"
      },
      text: "Second Example ad text",
      type: "banner",
      weight: 10,
      expiry: "2039-11-13T20:20:39Z",
      keywords: ["messi", "xavi", "iniesta"]
    },
    a3: {
      name: "Second Image ad name",
      content: {
        type: "video",
        src: "https://mycdn.com/vid1"
      },
      text: "third Example ad text",
      type: "banner",
      weight: 11,
      expiry: "2034-11-13T20:20:39Z",
      keywords: ["a", "b", "c"]
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
    url: "https://418e-64-85-231-39.ngrok.io/insights",
  },
  compensations: {
    parameters: {
      recipientAddress: {
        type: "address",
        required: true,
      }
    },
    c1: {
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
    },
    c2: {
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
    },
    c3: {
      name: "CrazyApesClub NFT distro 2",
      image: "tq432RLMic98mbKCGsMnRxWqxMsKPL8wBQ333PBEmWNuT8",
      description: "another free CrazyApesClub NFT",
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
      chainId: 1,
      callback: {
        parameters: ["recipientAddress", "productId"],
        data: {
          trackingId: "982JJDSLAcx",
        },
      },
    },
  },
  logic: {
    returns: [
      "$r1", "$r2",
    ],
    ads: [
      "if$q1then$a1", "$a2"
    ],
    compensations: [
      "if$q1then$c1", "if$a1then$c2", 
      "if($a1and$a2)then$c3",
      "if($q1and$a2and$a3)then$c4", // c4 won't be expected
    ],
  },
};
