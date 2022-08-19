import { ChainId, EVMAccountAddress } from "@snickerdoodlelabs/objects";

const accountAddress: EVMAccountAddress = EVMAccountAddress(
  "0x38779eDe53AB96451772b79cb08A91677442a40B",
);
const startTime: Date = new Date("2022-01-01");
const chainId: ChainId = ChainId(1);

function getExpectedURL(apiKey: string): string {
  return `https://api.covalenthq.com/v1/${chainId.toString()}/address/${accountAddress.toString()}/transactions_v2/?key=${apiKey}&match={%22block_signed_at%22:{%22$gt%22:%22${startTime.toISOString()}%22}}`;
}

const response = {
  data: {
    address: "0x38779ede53ab96451772b79cb08a91677442a40b",
    updated_at: "2022-07-18T21:11:14.570925300Z",
    next_update_at: "2022-07-18T21:16:14.570925480Z",
    quote_currency: "USD",
    chain_id: 1,
    items: [
      {
        block_signed_at: "2022-03-18T08:06:40Z",
        block_height: 14409240,
        tx_hash:
          "0xac08b4799ef36adcfc42e719affdb3afb5b9ac56c44c7760e9f86349a85c85ae",
        tx_offset: 122,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
        to_address_label: "CryptoKitties (CK)",
        value: "16000000000000000",
        value_quote: 46.21338671875,
        gas_offered: 108547,
        gas_spent: 72365,
        gas_price: 29488377978,
        fees_paid: "2133926472377970",
        gas_quote: 6.16349808108632,
        gas_quote_rate: 2888.336669921875,
        log_events: [
          {
            block_signed_at: "2022-03-18T08:06:40Z",
            block_height: 14409240,
            tx_offset: 122,
            log_offset: 183,
            tx_hash:
              "0xac08b4799ef36adcfc42e719affdb3afb5b9ac56c44c7760e9f86349a85c85ae",
            raw_log_topics: [
              "0x241ea03ca20251805084d27d4440371c34a0b85ff108f6bb5611248f73818b80",
            ],
            sender_contract_decimals: 0,
            sender_name: "CryptoKitties: Core",
            sender_contract_ticker_symbol: "CK",
            sender_address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
            sender_address_label: "CryptoKitties (CK)",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x06012c8cf97bead5deae237070f9587f8e7a266d.png",
            raw_log_data:
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b0000000000000000000000000000000000000000000000000000000000091f6500000000000000000000000000000000000000000000000000000000001eb0ee0000000000000000000000000000000000000000000000000000000000dbdff8",
            decoded: {
              name: "Pregnant",
              signature:
                "Pregnant(address owner, uint256 matronId, uint256 sireId, uint256 cooldownEndBlock)",
              params: [
                {
                  name: "owner",
                  type: "address",
                  indexed: false,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
                {
                  name: "matronId",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "597861",
                },
                {
                  name: "sireId",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "2011374",
                },
                {
                  name: "cooldownEndBlock",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "14409720",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-18T08:00:05Z",
        block_height: 14409204,
        tx_hash:
          "0xc4938aae19d94b7e878b9ac4b1526746648342ff27cdd100e57d57511a8fb58b",
        tx_offset: 274,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0xb1690c08e213a35ed9bab7b318de14420fb57d8c",
        to_address_label: "CryptoKitties: Sales Auction",
        value: "5000000000000000",
        value_quote: 14.441683349609375,
        gas_offered: 132435,
        gas_spent: 73079,
        gas_price: 33128260424,
        fees_paid: "2420980143525496",
        gas_quote: 6.9926057256974135,
        gas_quote_rate: 2888.336669921875,
        log_events: [
          {
            block_signed_at: "2022-03-18T08:00:05Z",
            block_height: 14409204,
            tx_offset: 274,
            log_offset: 301,
            tx_hash:
              "0xc4938aae19d94b7e878b9ac4b1526746648342ff27cdd100e57d57511a8fb58b",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            ],
            sender_contract_decimals: 0,
            sender_name: "CryptoKitties: Core",
            sender_contract_ticker_symbol: "CK",
            sender_address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
            sender_address_label: "CryptoKitties (CK)",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x06012c8cf97bead5deae237070f9587f8e7a266d.png",
            raw_log_data:
              "0x000000000000000000000000b1690c08e213a35ed9bab7b318de14420fb57d8c00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b0000000000000000000000000000000000000000000000000000000000091f65",
            decoded: {
              name: "Transfer",
              signature:
                "Transfer(indexed address from, indexed address to, uint256 value)",
              params: null,
            },
          },
          {
            block_signed_at: "2022-03-18T08:00:05Z",
            block_height: 14409204,
            tx_offset: 274,
            log_offset: 300,
            tx_hash:
              "0xc4938aae19d94b7e878b9ac4b1526746648342ff27cdd100e57d57511a8fb58b",
            raw_log_topics: [
              "0x4fcc30d90a842164dd58501ab874a101a3749c3d4747139cefe7c876f4ccebd2",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0xb1690c08e213a35ed9bab7b318de14420fb57d8c",
            sender_address_label: "CryptoKitties: Sales Auction",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0xb1690c08e213a35ed9bab7b318de14420fb57d8c.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000000000000000000000091f650000000000000000000000000000000000000000000000000011c37937e0800000000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            decoded: {
              name: "AuctionSuccessful",
              signature:
                "AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner)",
              params: [
                {
                  name: "tokenId",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "597861",
                },
                {
                  name: "totalPrice",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "5000000000000000",
                },
                {
                  name: "winner",
                  type: "address",
                  indexed: false,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-18T07:30:32Z",
        block_height: 14409075,
        tx_hash:
          "0xed680c72c503eedefdaddf7d696473e9a7a60e830b85ffd3c1da19707ae32064",
        tx_offset: 443,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
        to_address_label: "CryptoKitties (CK)",
        value: "16000000000000000",
        value_quote: 46.21338671875,
        gas_offered: 108547,
        gas_spent: 72365,
        gas_price: 35318621649,
        fees_paid: "2555832055629885",
        gas_quote: 7.3821034484376025,
        gas_quote_rate: 2888.336669921875,
        log_events: [
          {
            block_signed_at: "2022-03-18T07:30:32Z",
            block_height: 14409075,
            tx_offset: 443,
            log_offset: 427,
            tx_hash:
              "0xed680c72c503eedefdaddf7d696473e9a7a60e830b85ffd3c1da19707ae32064",
            raw_log_topics: [
              "0x241ea03ca20251805084d27d4440371c34a0b85ff108f6bb5611248f73818b80",
            ],
            sender_contract_decimals: 0,
            sender_name: "CryptoKitties: Core",
            sender_contract_ticker_symbol: "CK",
            sender_address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
            sender_address_label: "CryptoKitties (CK)",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x06012c8cf97bead5deae237070f9587f8e7a266d.png",
            raw_log_data:
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b000000000000000000000000000000000000000000000000000000000008a712000000000000000000000000000000000000000000000000000000000008b9400000000000000000000000000000000000000000000000000000000000dbdd9b",
            decoded: {
              name: "Pregnant",
              signature:
                "Pregnant(address owner, uint256 matronId, uint256 sireId, uint256 cooldownEndBlock)",
              params: [
                {
                  name: "owner",
                  type: "address",
                  indexed: false,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
                {
                  name: "matronId",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "567058",
                },
                {
                  name: "sireId",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "571712",
                },
                {
                  name: "cooldownEndBlock",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "14409115",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-18T07:25:27Z",
        block_height: 14409058,
        tx_hash:
          "0x81dee41921968092f3b6ead72a6259b2a776b75b1ee8d9735e0bc9480c62d9e6",
        tx_offset: 281,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0xb1690c08e213a35ed9bab7b318de14420fb57d8c",
        to_address_label: "CryptoKitties: Sales Auction",
        value: "5000000000000000",
        value_quote: 14.441683349609375,
        gas_offered: 132435,
        gas_spent: 73079,
        gas_price: 29904161945,
        fees_paid: "2185366250778655",
        gas_quote: 6.312073479333674,
        gas_quote_rate: 2888.336669921875,
        log_events: [
          {
            block_signed_at: "2022-03-18T07:25:27Z",
            block_height: 14409058,
            tx_offset: 281,
            log_offset: 369,
            tx_hash:
              "0x81dee41921968092f3b6ead72a6259b2a776b75b1ee8d9735e0bc9480c62d9e6",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            ],
            sender_contract_decimals: 0,
            sender_name: "CryptoKitties: Core",
            sender_contract_ticker_symbol: "CK",
            sender_address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
            sender_address_label: "CryptoKitties (CK)",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x06012c8cf97bead5deae237070f9587f8e7a266d.png",
            raw_log_data:
              "0x000000000000000000000000b1690c08e213a35ed9bab7b318de14420fb57d8c00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b000000000000000000000000000000000000000000000000000000000008a712",
            decoded: {
              name: "Transfer",
              signature:
                "Transfer(indexed address from, indexed address to, uint256 value)",
              params: null,
            },
          },
          {
            block_signed_at: "2022-03-18T07:25:27Z",
            block_height: 14409058,
            tx_offset: 281,
            log_offset: 368,
            tx_hash:
              "0x81dee41921968092f3b6ead72a6259b2a776b75b1ee8d9735e0bc9480c62d9e6",
            raw_log_topics: [
              "0x4fcc30d90a842164dd58501ab874a101a3749c3d4747139cefe7c876f4ccebd2",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0xb1690c08e213a35ed9bab7b318de14420fb57d8c",
            sender_address_label: "CryptoKitties: Sales Auction",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0xb1690c08e213a35ed9bab7b318de14420fb57d8c.png",
            raw_log_data:
              "0x000000000000000000000000000000000000000000000000000000000008a7120000000000000000000000000000000000000000000000000011c37937e0800000000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            decoded: {
              name: "AuctionSuccessful",
              signature:
                "AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner)",
              params: [
                {
                  name: "tokenId",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "567058",
                },
                {
                  name: "totalPrice",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "5000000000000000",
                },
                {
                  name: "winner",
                  type: "address",
                  indexed: false,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-18T07:21:37Z",
        block_height: 14409035,
        tx_hash:
          "0xb66259a43efc2b07f884549ad6eee37e62aeee29e7a86b4c49a3c8298e05d95a",
        tx_offset: 123,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0xb1690c08e213a35ed9bab7b318de14420fb57d8c",
        to_address_label: "CryptoKitties: Sales Auction",
        value: "5000000000000000",
        value_quote: 14.441683349609375,
        gas_offered: 158316,
        gas_spent: 90179,
        gas_price: 35622494211,
        fees_paid: "3212400905453769",
        gas_quote: 9.278495333712355,
        gas_quote_rate: 2888.336669921875,
        log_events: [
          {
            block_signed_at: "2022-03-18T07:21:37Z",
            block_height: 14409035,
            tx_offset: 123,
            log_offset: 164,
            tx_hash:
              "0xb66259a43efc2b07f884549ad6eee37e62aeee29e7a86b4c49a3c8298e05d95a",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            ],
            sender_contract_decimals: 0,
            sender_name: "CryptoKitties: Core",
            sender_contract_ticker_symbol: "CK",
            sender_address: "0x06012c8cf97bead5deae237070f9587f8e7a266d",
            sender_address_label: "CryptoKitties (CK)",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x06012c8cf97bead5deae237070f9587f8e7a266d.png",
            raw_log_data:
              "0x000000000000000000000000b1690c08e213a35ed9bab7b318de14420fb57d8c00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b000000000000000000000000000000000000000000000000000000000008b940",
            decoded: {
              name: "Transfer",
              signature:
                "Transfer(indexed address from, indexed address to, uint256 value)",
              params: null,
            },
          },
          {
            block_signed_at: "2022-03-18T07:21:37Z",
            block_height: 14409035,
            tx_offset: 123,
            log_offset: 163,
            tx_hash:
              "0xb66259a43efc2b07f884549ad6eee37e62aeee29e7a86b4c49a3c8298e05d95a",
            raw_log_topics: [
              "0x4fcc30d90a842164dd58501ab874a101a3749c3d4747139cefe7c876f4ccebd2",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0xb1690c08e213a35ed9bab7b318de14420fb57d8c",
            sender_address_label: "CryptoKitties: Sales Auction",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0xb1690c08e213a35ed9bab7b318de14420fb57d8c.png",
            raw_log_data:
              "0x000000000000000000000000000000000000000000000000000000000008b9400000000000000000000000000000000000000000000000000011c37937e0800000000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            decoded: {
              name: "AuctionSuccessful",
              signature:
                "AuctionSuccessful(uint256 tokenId, uint256 totalPrice, address winner)",
              params: [
                {
                  name: "tokenId",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "571712",
                },
                {
                  name: "totalPrice",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "5000000000000000",
                },
                {
                  name: "winner",
                  type: "address",
                  indexed: false,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-18T01:59:02Z",
        block_height: 14407574,
        tx_hash:
          "0xd88eb35c410e07c1c721954fcf4e1ad3ca790940776d7b49a00388186b6ccd76",
        tx_offset: 147,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
        to_address_label: null,
        value: "58535146272124971",
        value_quote: 169.06920945701927,
        gas_offered: 199309,
        gas_spent: 142127,
        gas_price: 53326998941,
        fees_paid: "7579206378487507",
        gas_quote: 21.89129971189124,
        gas_quote_rate: 2888.336669921875,
        log_events: [
          {
            block_signed_at: "2022-03-18T01:59:02Z",
            block_height: 14407574,
            tx_offset: 147,
            log_offset: 213,
            tx_hash:
              "0xd88eb35c410e07c1c721954fcf4e1ad3ca790940776d7b49a00388186b6ccd76",
            raw_log_topics: [
              "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
              "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            ],
            sender_contract_decimals: 18,
            sender_name: "Uniswap V2",
            sender_contract_ticker_symbol: "UNI-V2",
            sender_address: "0xc730ef0f4973da9cc0ab8ab291890d3e77f58f79",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xc730ef0f4973da9cc0ab8ab291890d3e77f58f79.png",
            raw_log_data:
              "0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b9e9aaf0269fb300000000000000000000000000000000000000000000000ad78ebc5ac62004bb0000000000000000000000000000000000000000000000000000000000000000",
            decoded: {
              name: "Swap",
              signature:
                "Swap(indexed address sender, uint256 amount0In, uint256 amount1In, uint256 amount0Out, uint256 amount1Out, indexed address to)",
              params: [
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
                },
                {
                  name: "amount0In",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "0",
                },
                {
                  name: "amount1In",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "52329791074246579",
                },
                {
                  name: "amount0Out",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "200000000000000001211",
                },
                {
                  name: "amount1Out",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "0",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-18T01:59:02Z",
            block_height: 14407574,
            tx_offset: 147,
            log_offset: 212,
            tx_hash:
              "0xd88eb35c410e07c1c721954fcf4e1ad3ca790940776d7b49a00388186b6ccd76",
            raw_log_topics: [
              "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
            ],
            sender_contract_decimals: 18,
            sender_name: "Uniswap V2",
            sender_contract_ticker_symbol: "UNI-V2",
            sender_address: "0xc730ef0f4973da9cc0ab8ab291890d3e77f58f79",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xc730ef0f4973da9cc0ab8ab291890d3e77f58f79.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000002b849761ded273d18f11100000000000000000000000000000000000000000000002e806fcadb6c0aab14",
            decoded: {
              name: "Sync",
              signature: "Sync(uint112 reserve0, uint112 reserve1)",
              params: [
                {
                  name: "reserve0",
                  type: "uint112",
                  indexed: false,
                  decoded: true,
                  value: "3288122195614277450658065",
                },
                {
                  name: "reserve1",
                  type: "uint112",
                  indexed: false,
                  decoded: true,
                  value: "857805066193668320020",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-18T01:59:02Z",
            block_height: 14407574,
            tx_offset: 147,
            log_offset: 211,
            tx_hash:
              "0xd88eb35c410e07c1c721954fcf4e1ad3ca790940776d7b49a00388186b6ccd76",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x000000000000000000000000c730ef0f4973da9cc0ab8ab291890d3e77f58f79",
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            ],
            sender_contract_decimals: 18,
            sender_name: "Audius",
            sender_contract_ticker_symbol: "AUDIO",
            sender_address: "0x18aaa7115705e8be94bffebde57af9bfc265b998",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x18aaa7115705e8be94bffebde57af9bfc265b998.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000ad78ebc5ac62004bb",
            decoded: {
              name: "Transfer",
              signature:
                "Transfer(indexed address from, indexed address to, uint256 value)",
              params: [
                {
                  name: "from",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xc730ef0f4973da9cc0ab8ab291890d3e77f58f79",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "200000000000000001211",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-18T01:59:02Z",
            block_height: 14407574,
            tx_offset: 147,
            log_offset: 210,
            tx_hash:
              "0xd88eb35c410e07c1c721954fcf4e1ad3ca790940776d7b49a00388186b6ccd76",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
              "0x000000000000000000000000c730ef0f4973da9cc0ab8ab291890d3e77f58f79",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped Ether",
            sender_contract_ticker_symbol: "WETH",
            sender_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            sender_address_label: "Wrapped Ether",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000b9e9aaf0269fb3",
            decoded: {
              name: "Transfer",
              signature:
                "Transfer(indexed address from, indexed address to, uint256 value)",
              params: [
                {
                  name: "from",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xc730ef0f4973da9cc0ab8ab291890d3e77f58f79",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "52329791074246579",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-18T01:59:02Z",
            block_height: 14407574,
            tx_offset: 147,
            log_offset: 209,
            tx_hash:
              "0xd88eb35c410e07c1c721954fcf4e1ad3ca790940776d7b49a00388186b6ccd76",
            raw_log_topics: [
              "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
              "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped Ether",
            sender_contract_ticker_symbol: "WETH",
            sender_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            sender_address_label: "Wrapped Ether",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000b9e9aaf0269fb3",
            decoded: {
              name: "Deposit",
              signature: "Deposit(indexed address dst, uint256 wad)",
              params: [
                {
                  name: "dst",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
                },
                {
                  name: "wad",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "52329791074246579",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-18T01:26:21Z",
        block_height: 14407449,
        tx_hash:
          "0xe509a78b95ff12047d56688ddaac09cc847376e5e6e3536ca9f03ab0ca84ef8b",
        tx_offset: 221,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
        to_address_label: null,
        value: "50000000000000000",
        value_quote: 144.41683349609374,
        gas_offered: 180066,
        gas_spent: 125568,
        gas_price: 66140184221,
        fees_paid: "8305090652262528",
        gas_quote: 23.987897877955245,
        gas_quote_rate: 2888.336669921875,
        log_events: [
          {
            block_signed_at: "2022-03-18T01:26:21Z",
            block_height: 14407449,
            tx_offset: 221,
            log_offset: 253,
            tx_hash:
              "0xe509a78b95ff12047d56688ddaac09cc847376e5e6e3536ca9f03ab0ca84ef8b",
            raw_log_topics: [
              "0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67",
              "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x290a6a7460b308ee3f19023d2d00de604bcf5b42",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0x290a6a7460b308ee3f19023d2d00de604bcf5b42.png",
            raw_log_data:
              "0xfffffffffffffffffffffffffffffffffffffffffffffffac5280ab5ebb7b01600000000000000000000000000000000000000000000000000b1a2bc2ec50000000000000000000000000000000000000000000005d1bb77aa51a968188a75f800000000000000000000000000000000000000000000c1bc87590b60c101e940fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffed85c",
            decoded: {
              name: "Swap",
              signature:
                "Swap(indexed address sender, indexed address recipient, int256 amount0, int256 amount1, uint160 sqrtPriceX96, uint128 liquidity, int24 tick)",
              params: [
                {
                  name: "sender",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
                },
                {
                  name: "recipient",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
                {
                  name: "amount0",
                  type: "int256",
                  indexed: false,
                  decoded: true,
                  value: "-96473847641257037802",
                },
                {
                  name: "amount1",
                  type: "int256",
                  indexed: false,
                  decoded: true,
                  value: "50000000000000000",
                },
                {
                  name: "sqrtPriceX96",
                  type: "uint160",
                  indexed: false,
                  decoded: true,
                  value: "1800975835373800960343832056",
                },
                {
                  name: "liquidity",
                  type: "uint128",
                  indexed: false,
                  decoded: true,
                  value: "914894471918677152360768",
                },
                {
                  name: "tick",
                  type: "int24",
                  indexed: false,
                  decoded: true,
                  value: "-75684",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-18T01:26:21Z",
            block_height: 14407449,
            tx_offset: 221,
            log_offset: 252,
            tx_hash:
              "0xe509a78b95ff12047d56688ddaac09cc847376e5e6e3536ca9f03ab0ca84ef8b",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
              "0x000000000000000000000000290a6a7460b308ee3f19023d2d00de604bcf5b42",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped Ether",
            sender_contract_ticker_symbol: "WETH",
            sender_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            sender_address_label: "Wrapped Ether",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000b1a2bc2ec50000",
            decoded: {
              name: "Transfer",
              signature:
                "Transfer(indexed address from, indexed address to, uint256 value)",
              params: [
                {
                  name: "from",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x290a6a7460b308ee3f19023d2d00de604bcf5b42",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "50000000000000000",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-18T01:26:21Z",
            block_height: 14407449,
            tx_offset: 221,
            log_offset: 251,
            tx_hash:
              "0xe509a78b95ff12047d56688ddaac09cc847376e5e6e3536ca9f03ab0ca84ef8b",
            raw_log_topics: [
              "0xe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c",
              "0x00000000000000000000000068b3465833fb72a70ecdf485e0e4c7bd8665fc45",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped Ether",
            sender_contract_ticker_symbol: "WETH",
            sender_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
            sender_address_label: "Wrapped Ether",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000b1a2bc2ec50000",
            decoded: {
              name: "Deposit",
              signature: "Deposit(indexed address dst, uint256 wad)",
              params: [
                {
                  name: "dst",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45",
                },
                {
                  name: "wad",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "50000000000000000",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-18T01:26:21Z",
            block_height: 14407449,
            tx_offset: 221,
            log_offset: 250,
            tx_hash:
              "0xe509a78b95ff12047d56688ddaac09cc847376e5e6e3536ca9f03ab0ca84ef8b",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x000000000000000000000000290a6a7460b308ee3f19023d2d00de604bcf5b42",
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            ],
            sender_contract_decimals: 18,
            sender_name: "Matic Token",
            sender_contract_ticker_symbol: "MATIC",
            sender_address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000000000053ad7f54a14484fea",
            decoded: {
              name: "Transfer",
              signature:
                "Transfer(indexed address from, indexed address to, uint256 value)",
              params: [
                {
                  name: "from",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x290a6a7460b308ee3f19023d2d00de604bcf5b42",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "96473847641257037802",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-17T20:22:45Z",
        block_height: 14406111,
        tx_hash:
          "0xbb8e45b740b8a95727bb0e3a07b3eb95adac64b89d4d4571b0a53f745e90a1dc",
        tx_offset: 84,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0x72a06bf2a1ce5e39cba06c0cab824960b587d64c",
        to_address_label: null,
        value: "44800000000000000",
        value_quote: 126.759696875,
        gas_offered: 127718,
        gas_spent: 125915,
        gas_price: 53261720466,
        fees_paid: "6706449532476390",
        gas_quote: 18.975614059022156,
        gas_quote_rate: 2829.45751953125,
        log_events: [
          {
            block_signed_at: "2022-03-17T20:22:45Z",
            block_height: 14406111,
            tx_offset: 84,
            log_offset: 167,
            tx_hash:
              "0xbb8e45b740b8a95727bb0e3a07b3eb95adac64b89d4d4571b0a53f745e90a1dc",
            raw_log_topics: [
              "0x06724742ccc8c330a39a641ef02a0b419bd09248360680bb38159b0a8c2635d6",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x5fdcca53617f4d2b9134b29090c87d01058e27e9",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0x5fdcca53617f4d2b9134b29090c87d01058e27e9.png",
            raw_log_data:
              "0x00000000000000000000000072a06bf2a1ce5e39cba06c0cab824960b587d64c06cd9c40f5272c945cb235aa4ef6950db10458860d59532a9ee7334a00db172c000000000000000000000000000000000000000000000000000000000b11da5702705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e000000000000000000000000000000000000000000000000009f295cd5f00000000000000000000000000000000000000000000000000000000000001ab3f000",
            decoded: null,
          },
          {
            block_signed_at: "2022-03-17T20:22:45Z",
            block_height: 14406111,
            tx_offset: 84,
            log_offset: 166,
            tx_hash:
              "0xbb8e45b740b8a95727bb0e3a07b3eb95adac64b89d4d4571b0a53f745e90a1dc",
            raw_log_topics: [
              "0xcab1cf17c190e4e2195a7b8f7b362023246fa774390432b4704ab6b29d56b07b",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x5fdcca53617f4d2b9134b29090c87d01058e27e9",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0x5fdcca53617f4d2b9134b29090c87d01058e27e9.png",
            raw_log_data:
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b06cd9c40f5272c945cb235aa4ef6950db10458860d59532a9ee7334a00db172c00000000000000000000000072a06bf2a1ce5e39cba06c0cab824960b587d64c",
            decoded: null,
          },
        ],
      },
      {
        block_signed_at: "2022-03-17T07:09:10Z",
        block_height: 14402565,
        tx_hash:
          "0x8335db58170fce2832e1df05f4748d2deffa610fa7ca6e6e7b2a47c4076a2417",
        tx_offset: 146,
        successful: true,
        from_address: "0xeb2629a2734e272bcc07bda959863f316f4bd4cf",
        from_address_label: "Coinbase 6",
        to_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        to_address_label: null,
        value: "137741310000000000",
        value_quote: 389.73318532958496,
        gas_offered: 21000,
        gas_spent: 21000,
        gas_price: 35121313940,
        fees_paid: "737547592740000",
        gas_quote: 2.086859582290365,
        gas_quote_rate: 2829.45751953125,
        log_events: [],
      },
      {
        block_signed_at: "2022-03-17T00:56:14Z",
        block_height: 14400910,
        tx_hash:
          "0x2078eba94b8b0a9cb5aecd818e26bea355bc44325173cd34d67245255c71fcc0",
        tx_offset: 243,
        successful: true,
        from_address: "0xb5d85cbf7cb3ee0d56b3bb207d5fc4b82f43f511",
        from_address_label: "Coinbase 5",
        to_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        to_address_label: null,
        value: "140579970000000000",
        value_quote: 397.76505321197754,
        gas_offered: 21000,
        gas_spent: 21000,
        gas_price: 42980725951,
        fees_paid: "902595244971000",
        gas_quote: 2.553854902976347,
        gas_quote_rate: 2829.45751953125,
        log_events: [],
      },
      {
        block_signed_at: "2022-03-10T22:37:34Z",
        block_height: 14361843,
        tx_hash:
          "0xab7f5d3d39f21cee01ad9ab3fe4aca43e0b8b35ef6161c4104bf6ba3498d60da",
        tx_offset: 169,
        successful: true,
        from_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        from_address_label: null,
        to_address: "0x7f268357a8c2552623316e2562d90e642bb538e5",
        to_address_label: "Wyvern Exchange Contract (-)",
        value: "20000000000000000",
        value_quote: 55.5367529296875,
        gas_offered: 285079,
        gas_spent: 211550,
        gas_price: 25039231827,
        fees_paid: "5297049493001850",
        gas_quote: 14.70904644745851,
        gas_quote_rate: 2776.837646484375,
        log_events: [
          {
            block_signed_at: "2022-03-10T22:37:34Z",
            block_height: 14361843,
            tx_offset: 169,
            log_offset: 631,
            tx_hash:
              "0xab7f5d3d39f21cee01ad9ab3fe4aca43e0b8b35ef6161c4104bf6ba3498d60da",
            raw_log_topics: [
              "0xc4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9",
              "0x000000000000000000000000a749b058ee2a54e98342f4865cd3062eac14b451",
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
              "0x0000000000000000000000000000000000000000000000000000000000000000",
            ],
            sender_contract_decimals: 0,
            sender_name: "Wyvern Exchange Contract",
            sender_contract_ticker_symbol: null,
            sender_address: "0x7f268357a8c2552623316e2562d90e642bb538e5",
            sender_address_label: "Wyvern Exchange Contract (-)",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0x7f268357a8c2552623316e2562d90e642bb538e5.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000000000000000000000000000c4dfc62eef500a61a86731f8027db8a12eecdb161117ae8b7057be8fbc9e1a6900000000000000000000000000000000000000000000000000470de4df820000",
            decoded: {
              name: "OrdersMatched",
              signature:
                "OrdersMatched(bytes32 buyHash, bytes32 sellHash, indexed address maker, indexed address taker, uint256 price, indexed bytes32 metadata)",
              params: [
                {
                  name: "buyHash",
                  type: "bytes32",
                  indexed: false,
                  decoded: true,
                  value: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
                },
                {
                  name: "sellHash",
                  type: "bytes32",
                  indexed: false,
                  decoded: true,
                  value: "xN/GLu9QCmGoZzH4An24oS7s2xYRF66LcFe+j7yeGmk=",
                },
                {
                  name: "maker",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa749b058ee2a54e98342f4865cd3062eac14b451",
                },
                {
                  name: "taker",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
                {
                  name: "price",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "20000000000000000",
                },
                {
                  name: "metadata",
                  type: "bytes32",
                  indexed: true,
                  decoded: true,
                  value: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=",
                },
              ],
            },
          },
          {
            block_signed_at: "2022-03-10T22:37:34Z",
            block_height: 14361843,
            tx_offset: 169,
            log_offset: 630,
            tx_hash:
              "0xab7f5d3d39f21cee01ad9ab3fe4aca43e0b8b35ef6161c4104bf6ba3498d60da",
            raw_log_topics: [
              "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62",
              "0x000000000000000000000000b6e2e27cf5a7ae925ff3737a393c7592d81b50e1",
              "0x000000000000000000000000a749b058ee2a54e98342f4865cd3062eac14b451",
              "0x00000000000000000000000038779ede53ab96451772b79cb08a91677442a40b",
            ],
            sender_contract_decimals: 0,
            sender_name: "OpenSea Shared Storefront",
            sender_contract_ticker_symbol: "OPENSTORE",
            sender_address: "0x495f947276749ce646f68ac8c248420045cb7b5e",
            sender_address_label: "OpenSea Shared Storefront (OPENSTORE)",
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/1/0x495f947276749ce646f68ac8c248420045cb7b5e.png",
            raw_log_data:
              "0xa749b058ee2a54e98342f4865cd3062eac14b4510000000000003100000000630000000000000000000000000000000000000000000000000000000000000001",
            decoded: {
              name: "TransferSingle",
              signature:
                "TransferSingle(indexed address _operator, indexed address _from, indexed address _to, uint256 _id, uint256 _amount)",
              params: [
                {
                  name: "_operator",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xb6e2e27cf5a7ae925ff3737a393c7592d81b50e1",
                },
                {
                  name: "_from",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa749b058ee2a54e98342f4865cd3062eac14b451",
                },
                {
                  name: "_to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x38779ede53ab96451772b79cb08a91677442a40b",
                },
                {
                  name: "_id",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value:
                    "75666442654048390426435034800241856743433055545947981270133463919865163153507",
                },
                {
                  name: "_amount",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "1",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2022-03-02T23:37:06Z",
        block_height: 14310572,
        tx_hash:
          "0x4bfbb2834ac3e9f39169ffcd13bbc4eb4bed4ab615f9de466df9a35288d8f290",
        tx_offset: 195,
        successful: true,
        from_address: "0xddfabcdc4d8ffc6d5beaf154f18b778f892a0740",
        from_address_label: "Coinbase 3",
        to_address: "0x38779ede53ab96451772b79cb08a91677442a40b",
        to_address_label: null,
        value: "128456660000000000",
        value_quote: 383.6514958346289,
        gas_offered: 21000,
        gas_spent: 21000,
        gas_price: 65705550434,
        fees_paid: "1379816559114000",
        gas_quote: 4.120990588432525,
        gas_quote_rate: 2986.6220703125,
        log_events: [],
      },
    ],
    pagination: {
      has_more: false,
      page_number: 0,
      page_size: 100,
      total_count: null,
    },
  },
  error: false,
  error_message: null,
  error_code: null,
};

export { accountAddress, chainId, startTime, response, getExpectedURL };
