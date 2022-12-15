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
  },
  logic: {
    returns: [
      // "if($q1>20and$q2)then$r1else$r2",
      "$r1", "$r2",
    ],
    ads: [
      "if$q1then$a1",
      // "if($q1and$q2=='nonbinary')then$a2",
    ],
    compensations: [
      "if$q1then$c1", 
      "if$a1then$c2"
    ],
  },
};
