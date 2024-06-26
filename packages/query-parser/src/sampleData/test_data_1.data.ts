export const testData1 = JSON.stringify({
  version: 0.1,
  timestamp: "2022-09-13T17:50:32.000Z",
  expiry: "3022-09-13T17:50:32.000Z",
  description:
    "Retrieve high-level Web 3.0 usage data from your campaign corhort.",
  business: "Muho",
  queries: {
    q1: {
      name: "url_visited_count",
      return: "object",
      object_schema: {
        patternProperties: {
          "^http(s)?://[\\\\-a-zA-Z0-9]*.[a-zA-Z0-9]*.[a-zA-Z]*/[a-zA-Z0-9]*$":
            {
              type: "integer",
            },
        },
      },
    },
    q2: {
      name: "chain_transaction_count",
      return: "object",
      object_schema: {
        patternProperties: {
          "^ETH|AVAX|SOL$": {
            type: "integer",
          },
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
            ticker: {
              type: "string",
            },
            address: {
              type: "string",
            },
            networkId: {
              type: "integer",
            },
            balance: {
              type: "number",
            },
          },
          required: ["ticker", "networkId", "balance"],
        },
      },
    },
    q4: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xcd17fA52528f37FACB3028688E62ec82d9417581",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q5: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x61E90A50137E1F645c9eF4a0d3A4f01477738406",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q6: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x0f5d2fb29fb7d3cfee444a200298f468908cc942",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q7: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xd5d86fc8d5c0ea1ac1ac5dfab6e529c9967a45e9",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q8: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x767fe9edc9e0df98e07454847909b5e959d7ca0e",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q9: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x60cd862c9C687A9dE49aecdC3A99b74A4fc54aB6",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q10: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x011C77fa577c500dEeDaD364b8af9e8540b808C0",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q11: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q12: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x5911a6DA952A9D1B67Be13cEcB389aD247420360",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q13: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xfc0d6cf33e38bce7ca7d89c0e292274031b7157a",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q14: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x497a9A79e82e6fC0FF10a16f6F75e6fcd5aE65a8",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q15: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x2aF75676692817d85121353f0D6e8E9aE6AD5576",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q16: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xd0258a3fd00f38aa8090dfee343f10a9d4d30d3f",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q17: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x5C1A0CC6DAdf4d0fB31425461df35Ba80fCBc110",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q18: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xF7a6E15dfD5cdD9ef12711Bd757a9b6021ABf643",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q19: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x4f81C790581b240A5C948Afd173620EcC8C71c8d",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q20: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xd6a5ab46ead26f49b03bbb1f9eb1ad5c1767974a",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q21: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x16cda4028e9e872a38acb903176719299beaed87",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q22: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x9F52c8ecbEe10e00D9faaAc5Ee9Ba0fF6550F511",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q23: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x329fa32F6520FB67Bb3C1fc3a6909BEb8239544c",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q24: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x6FbBc8977616e0425911C69d72E12d32A5865560",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q25: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x6317C4CAB501655D7B85128A5868E98a094C0082",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q26: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x3c8D2FCE49906e11e71cB16Fa0fFeB2B16C29638",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q27: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x7f268357A8c2552623316e2562D90e642bB538E5",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q28: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x1c9052e823b5f4611ef7d5fb4153995b040ccbf5",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q29: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xC36442b4a4522E871399CD717aBDD847Ab11FE88",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q30: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x881d40237659c251811cec9c364ef91dc08d300c",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q31: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q32: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q33: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q34: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x1e4ede388cbc9f4b5c79681b7f94d36a11abebc9",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q35: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x949C4828890e939deF03a2776135fB4C18fAdAAe",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q36: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x80336Ad7A747236ef41F47ed2C7641828a480BAA",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q37: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x111111111117dc0aa78b770fa6a738034120c302",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q38: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x3B3ee1931Dc30C1957379FAc9aba94D1C48a5405",
        function: "Transfer",
        direction: "to",
        token: "ERC721",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q39: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xDEf1CA1fb7FBcDC777520aa7f396b4E015F497aB",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q40: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xf4d2888d29d722226fafa5d9b24f9164c092421e",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q41: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q42: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q43: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x20f780a973856b93f63670377900c1d2a50a77c4",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q44: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q45: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x27c70cd1946795b66be9d954418546998b546634",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q46: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xd533a949740bb3306d119cc777fa900ba034cd52",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q47: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q48: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xc5102fe9359fd9a28f877a67e36b0f050d81a3cc",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q49: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q50: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x1A4b46696b2bB4794Eb3D4c26f1c55F9170fa4C5",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q51: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x6810e776880C02933D47DB1b9fc05908e5386b96",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q52: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q53: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x64aa3364F17a4D01c6f1751Fd97C2BD3D7e7f1D5",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q54: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q55: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q56: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q57: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
        },
      },
    },
    q58: {
      name: "network",
      return: "object",
      object_schema: {
        properties: {
          networkid: {
            type: "integer",
          },
          address: {
            type: "string",
            pattern: "^0x[a-fA-F0-9]{40}$",
          },
          return: {
            type: "boolean",
          },
        },
        required: ["networkid", "address", "return"],
      },
      chain: "ETH",
      contract: {
        networkid: "1",
        address: "0x6123B0049F904d730dB3C36a31167D9d4121fA6B",
        function: "Transfer",
        direction: "to",
        token: "ERC20",
        timestampRange: {
          start: 0,
          end: 15442629,
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
    r4: {
      name: "query_response",
      query: "q0",
    },
    r5: {
      name: "query_response",
      query: "q1",
    },
    r6: {
      name: "query_response",
      query: "q2",
    },
    r7: {
      name: "query_response",
      query: "q3",
    },
    r8: {
      name: "query_response",
      query: "q4",
    },
    r9: {
      name: "query_response",
      query: "q5",
    },
    r10: {
      name: "query_response",
      query: "q6",
    },
    r11: {
      name: "query_response",
      query: "q7",
    },
    r12: {
      name: "query_response",
      query: "q8",
    },
    r13: {
      name: "query_response",
      query: "q9",
    },
    r14: {
      name: "query_response",
      query: "q10",
    },
    r15: {
      name: "query_response",
      query: "q11",
    },
    r16: {
      name: "query_response",
      query: "q12",
    },
    r17: {
      name: "query_response",
      query: "q13",
    },
    r18: {
      name: "query_response",
      query: "q14",
    },
    r19: {
      name: "query_response",
      query: "q15",
    },
    r20: {
      name: "query_response",
      query: "q16",
    },
    r21: {
      name: "query_response",
      query: "q17",
    },
    r22: {
      name: "query_response",
      query: "q18",
    },
    r23: {
      name: "query_response",
      query: "q19",
    },
    r24: {
      name: "query_response",
      query: "q20",
    },
    r25: {
      name: "query_response",
      query: "q21",
    },
    r26: {
      name: "query_response",
      query: "q22",
    },
    r27: {
      name: "query_response",
      query: "q23",
    },
    r28: {
      name: "query_response",
      query: "q24",
    },
    r29: {
      name: "query_response",
      query: "q25",
    },
    r30: {
      name: "query_response",
      query: "q26",
    },
    r31: {
      name: "query_response",
      query: "q27",
    },
    r32: {
      name: "query_response",
      query: "q28",
    },
    r33: {
      name: "query_response",
      query: "q29",
    },
    r34: {
      name: "query_response",
      query: "q30",
    },
    r35: {
      name: "query_response",
      query: "q31",
    },
    r36: {
      name: "query_response",
      query: "q32",
    },
    r37: {
      name: "query_response",
      query: "q33",
    },
    r38: {
      name: "query_response",
      query: "q34",
    },
    r39: {
      name: "query_response",
      query: "q35",
    },
    r40: {
      name: "query_response",
      query: "q36",
    },
    r41: {
      name: "query_response",
      query: "q37",
    },
    r42: {
      name: "query_response",
      query: "q38",
    },
    r43: {
      name: "query_response",
      query: "q39",
    },
    r44: {
      name: "query_response",
      query: "q40",
    },
    r45: {
      name: "query_response",
      query: "q41",
    },
    r46: {
      name: "query_response",
      query: "q42",
    },
    r47: {
      name: "query_response",
      query: "q43",
    },
    r48: {
      name: "query_response",
      query: "q44",
    },
    r49: {
      name: "query_response",
      query: "q45",
    },
    r50: {
      name: "query_response",
      query: "q46",
    },
    r51: {
      name: "query_response",
      query: "q47",
    },
    r52: {
      name: "query_response",
      query: "q48",
    },
    r53: {
      name: "query_response",
      query: "q49",
    },
    r54: {
      name: "query_response",
      query: "q50",
    },
    r55: {
      name: "query_response",
      query: "q51",
    },
    r56: {
      name: "query_response",
      query: "q52",
    },
    r57: {
      name: "query_response",
      query: "q53",
    },
    r58: {
      name: "query_response",
      query: "q54",
    },
    url: "https://insight-api.dev.snickerdoodle.dev/v0",
  },
  compensations: {},
  logic: {
    returns: [
      "$r1",
      "$r2",
      "$r3",
      "$r4",
      "$r5",
      "$r6",
      "$r7",
      "$r8",
      "$r9",
      "$r10",
      "$r11",
      "$r12",
      "$r13",
      "$r14",
      "$r15",
      "$r16",
      "$r17",
      "$r18",
      "$r19",
      "$r20",
      "$r21",
      "$r22",
      "$r23",
      "$r24",
      "$r25",
      "$r26",
      "$r27",
      "$r28",
      "$r29",
      "$r30",
      "$r31",
      "$r32",
      "$r33",
      "$r34",
      "$r35",
      "$r36",
      "$r37",
      "$r38",
      "$r39",
      "$r40",
      "$r41",
      "$r42",
      "$r43",
      "$r44",
      "$r45",
      "$r46",
      "$r47",
      "$r48",
      "$r49",
      "$r50",
      "$r51",
      "$r52",
      "$r53",
      "$r54",
      "$r55",
      "$r56",
      "$r57",
      "$r58",
    ],
    compensations: [],
  },
});
