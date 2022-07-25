import { ChainId, EVMAccountAddress } from "@snickerdoodlelabs/objects";

const accountAddress: EVMAccountAddress = EVMAccountAddress(
  "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
);
const startTime: Date = new Date("2021-01-01");
const endTime: Date = new Date("2022-01-01");
const chainId: ChainId = ChainId(43114);

function getExpectedURL(apiKey: string): string {
  return `https://api.covalenthq.com/v1/${chainId.toString()}/address/${accountAddress.toString()}/transactions_v2/?key=${apiKey}&match={%22$and%22:[{%22block_signed_at%22:{%22$gt%22:%22${startTime.toISOString()}%22}},{%22block_signed_at%22:{%22$lt%22:%22${endTime.toISOString()}%22}}]}`;
}

const response = {
  data: {
    address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
    updated_at: "2022-07-18T23:54:43.540446909Z",
    next_update_at: "2022-07-18T23:59:43.540447098Z",
    quote_currency: "USD",
    chain_id: 43114,
    items: [
      {
        block_signed_at: "2021-02-21T04:26:50Z",
        block_height: 264091,
        tx_hash:
          "0x53b46180de1073fd4076a108891e0ebd03174abde59b68a7c05a8c9d4b8b984e",
        tx_offset: 0,
        successful: true,
        from_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        from_address_label: null,
        to_address: "0x0cd4f5525b59df7cf2eed8e054403a093e62176a",
        to_address_label: null,
        value: "20726747100000000000",
        value_quote: 734.0065363475361,
        gas_offered: 21000,
        gas_spent: 21000,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 0.34953118686676027,
        gas_quote_rate: 35.41349411010742,
        log_events: [],
      },
      {
        block_signed_at: "2021-02-21T04:23:09Z",
        block_height: 264069,
        tx_hash:
          "0xd5c9f629612a522e34dc72c43f2504f64df17943b3ce04d86a774114f3122cd7",
        tx_offset: 0,
        successful: true,
        from_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        from_address_label: null,
        to_address: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        gas_offered: 180544,
        gas_spent: 123849,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 2.0613851410600663,
        gas_quote_rate: 35.41349411010742,
        log_events: [
          {
            block_signed_at: "2021-02-21T04:23:09Z",
            block_height: 264069,
            tx_offset: 0,
            log_offset: 5,
            tx_hash:
              "0xd5c9f629612a522e34dc72c43f2504f64df17943b3ce04d86a774114f3122cd7",
            raw_log_topics: [
              "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped AVAX",
            sender_contract_ticker_symbol: "WAVAX",
            sender_address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000000000000b9ee0959477e96a",
            decoded: {
              name: "Withdrawal",
              signature: "Withdrawal(indexed address src, uint256 wad)",
              params: [
                {
                  name: "src",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "wad",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "837353513783126378",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:23:09Z",
            block_height: 264069,
            tx_offset: 0,
            log_offset: 4,
            tx_hash:
              "0xd5c9f629612a522e34dc72c43f2504f64df17943b3ce04d86a774114f3122cd7",
            raw_log_topics: [
              "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Pangolin Liquidity",
            sender_contract_ticker_symbol: "PGL",
            sender_address: "0x92dc558cb9f8d0473391283ead77b79b416877ca",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x92dc558cb9f8d0473391283ead77b79b416877ca.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000b9ee0959477e96a0000000000000000000000000000000000000000000000000000000000000000",
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
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
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
                  value: "1000000000000000000",
                },
                {
                  name: "amount0Out",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "837353513783126378",
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
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:23:09Z",
            block_height: 264069,
            tx_offset: 0,
            log_offset: 3,
            tx_hash:
              "0xd5c9f629612a522e34dc72c43f2504f64df17943b3ce04d86a774114f3122cd7",
            raw_log_topics: [
              "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
            ],
            sender_contract_decimals: 18,
            sender_name: "Pangolin Liquidity",
            sender_contract_ticker_symbol: "PGL",
            sender_address: "0x92dc558cb9f8d0473391283ead77b79b416877ca",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0x92dc558cb9f8d0473391283ead77b79b416877ca.png",
            raw_log_data:
              "0x000000000000000000000000000000000000000000001c58f03c722923e675130000000000000000000000000000000000000000000021c0925523b7da8e1cc8",
            decoded: {
              name: "Sync",
              signature: "Sync(uint112 reserve0, uint112 reserve1)",
              params: [
                {
                  name: "reserve0",
                  type: "uint112",
                  indexed: false,
                  decoded: true,
                  value: "133866885835425233401107",
                },
                {
                  name: "reserve1",
                  type: "uint112",
                  indexed: false,
                  decoded: true,
                  value: "159390413170225636580552",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:23:09Z",
            block_height: 264069,
            tx_offset: 0,
            log_offset: 2,
            tx_hash:
              "0xd5c9f629612a522e34dc72c43f2504f64df17943b3ce04d86a774114f3122cd7",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x00000000000000000000000092dc558cb9f8d0473391283ead77b79b416877ca",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped AVAX",
            sender_contract_ticker_symbol: "WAVAX",
            sender_address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000000000000b9ee0959477e96a",
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
                  value: "0x92dc558cb9f8d0473391283ead77b79b416877ca",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "837353513783126378",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:23:09Z",
            block_height: 264069,
            tx_offset: 0,
            log_offset: 1,
            tx_hash:
              "0xd5c9f629612a522e34dc72c43f2504f64df17943b3ce04d86a774114f3122cd7",
            raw_log_topics: [
              "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Uniswap",
            sender_contract_ticker_symbol: "UNI",
            sender_address: "0xf39f9671906d8630812f9d9863bbef5d523c84ab",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0xf39f9671906d8630812f9d9863bbef5d523c84ab.png",
            raw_log_data:
              "0xfffffffffffffffffffffffffffffffffffffffffffffffff21f494c589bffff",
            decoded: {
              name: "Approval",
              signature:
                "Approval(indexed address owner, indexed address spender, uint256 value)",
              params: [
                {
                  name: "owner",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "spender",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value:
                    "115792089237316195423570985008687907853269984665640564039456584007913129639935",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:23:09Z",
            block_height: 264069,
            tx_offset: 0,
            log_offset: 0,
            tx_hash:
              "0xd5c9f629612a522e34dc72c43f2504f64df17943b3ce04d86a774114f3122cd7",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
              "0x00000000000000000000000092dc558cb9f8d0473391283ead77b79b416877ca",
            ],
            sender_contract_decimals: 18,
            sender_name: "Uniswap",
            sender_contract_ticker_symbol: "UNI",
            sender_address: "0xf39f9671906d8630812f9d9863bbef5d523c84ab",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0xf39f9671906d8630812f9d9863bbef5d523c84ab.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
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
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0x92dc558cb9f8d0473391283ead77b79b416877ca",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "1000000000000000000",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2021-02-21T04:22:49Z",
        block_height: 264067,
        tx_hash:
          "0xb26a29327e9236f1c65a8da4890078e4cd125dd4ae09cf9355e6e1e18eb00713",
        tx_offset: 0,
        successful: true,
        from_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        from_address_label: null,
        to_address: "0xf39f9671906d8630812f9d9863bbef5d523c84ab",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        gas_offered: 48959,
        gas_spent: 44509,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 0.7408230283929825,
        gas_quote_rate: 35.41349411010742,
        log_events: [
          {
            block_signed_at: "2021-02-21T04:22:49Z",
            block_height: 264067,
            tx_offset: 0,
            log_offset: 0,
            tx_hash:
              "0xb26a29327e9236f1c65a8da4890078e4cd125dd4ae09cf9355e6e1e18eb00713",
            raw_log_topics: [
              "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Uniswap",
            sender_contract_ticker_symbol: "UNI",
            sender_address: "0xf39f9671906d8630812f9d9863bbef5d523c84ab",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0xf39f9671906d8630812f9d9863bbef5d523c84ab.png",
            raw_log_data:
              "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
            decoded: {
              name: "Approval",
              signature:
                "Approval(indexed address owner, indexed address spender, uint256 value)",
              params: [
                {
                  name: "owner",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "spender",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value:
                    "115792089237316195423570985008687907853269984665640564039457584007913129639935",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2021-02-21T04:22:26Z",
        block_height: 264064,
        tx_hash:
          "0xf8e6a38d197592fb5b5ddf6dac85d63eef730ac893b0c9acf2730ea9cee8dbdb",
        tx_offset: 0,
        successful: true,
        from_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        from_address_label: null,
        to_address: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        gas_offered: 177081,
        gas_spent: 120701,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 2.0089887517145155,
        gas_quote_rate: 35.41349411010742,
        log_events: [
          {
            block_signed_at: "2021-02-21T04:22:26Z",
            block_height: 264064,
            tx_offset: 0,
            log_offset: 4,
            tx_hash:
              "0xf8e6a38d197592fb5b5ddf6dac85d63eef730ac893b0c9acf2730ea9cee8dbdb",
            raw_log_topics: [
              "0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped AVAX",
            sender_contract_ticker_symbol: "WAVAX",
            sender_address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000111a2c80211ee0ef0",
            decoded: {
              name: "Withdrawal",
              signature: "Withdrawal(indexed address src, uint256 wad)",
              params: [
                {
                  name: "src",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "wad",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "19717542029797756656",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:22:26Z",
            block_height: 264064,
            tx_offset: 0,
            log_offset: 3,
            tx_hash:
              "0xf8e6a38d197592fb5b5ddf6dac85d63eef730ac893b0c9acf2730ea9cee8dbdb",
            raw_log_topics: [
              "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Pangolin Liquidity",
            sender_contract_ticker_symbol: "PGL",
            sender_address: "0xd7538cabbf8605bde1f4901b47b8d42c61de0367",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0xd7538cabbf8605bde1f4901b47b8d42c61de0367.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000422e219ce221d08900000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000111a2c80211ee0ef0",
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
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "amount0In",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "76300576209990650000",
                },
                {
                  name: "amount1In",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "0",
                },
                {
                  name: "amount0Out",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "0",
                },
                {
                  name: "amount1Out",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "19717542029797756656",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:22:26Z",
            block_height: 264064,
            tx_offset: 0,
            log_offset: 2,
            tx_hash:
              "0xf8e6a38d197592fb5b5ddf6dac85d63eef730ac893b0c9acf2730ea9cee8dbdb",
            raw_log_topics: [
              "0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1",
            ],
            sender_contract_decimals: 18,
            sender_name: "Pangolin Liquidity",
            sender_contract_ticker_symbol: "PGL",
            sender_address: "0xd7538cabbf8605bde1f4901b47b8d42c61de0367",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0xd7538cabbf8605bde1f4901b47b8d42c61de0367.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000dc1bb36f5c4e6c39861a00000000000000000000000000000000000000000000390c13c11730737b8237",
            decoded: {
              name: "Sync",
              signature: "Sync(uint112 reserve0, uint112 reserve1)",
              params: [
                {
                  name: "reserve0",
                  type: "uint112",
                  indexed: false,
                  decoded: true,
                  value: "1039431617975859201803802",
                },
                {
                  name: "reserve1",
                  type: "uint112",
                  indexed: false,
                  decoded: true,
                  value: "269397673896908380930615",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:22:26Z",
            block_height: 264064,
            tx_offset: 0,
            log_offset: 1,
            tx_hash:
              "0xf8e6a38d197592fb5b5ddf6dac85d63eef730ac893b0c9acf2730ea9cee8dbdb",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x000000000000000000000000d7538cabbf8605bde1f4901b47b8d42c61de0367",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Wrapped AVAX",
            sender_contract_ticker_symbol: "WAVAX",
            sender_address: "0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000111a2c80211ee0ef0",
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
                  value: "0xd7538cabbf8605bde1f4901b47b8d42c61de0367",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "19717542029797756656",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:22:26Z",
            block_height: 264064,
            tx_offset: 0,
            log_offset: 0,
            tx_hash:
              "0xf8e6a38d197592fb5b5ddf6dac85d63eef730ac893b0c9acf2730ea9cee8dbdb",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
              "0x000000000000000000000000d7538cabbf8605bde1f4901b47b8d42c61de0367",
            ],
            sender_contract_decimals: 18,
            sender_name: "Pangolin",
            sender_contract_ticker_symbol: "PNG",
            sender_address: "0x60781c2586d68229fde47564546784ab3faca982",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0x60781c2586d68229fde47564546784ab3faca982.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000422e219ce221d0890",
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
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xd7538cabbf8605bde1f4901b47b8d42c61de0367",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "76300576209990650000",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2021-02-21T04:22:01Z",
        block_height: 264062,
        tx_hash:
          "0x4205499f5226eb090252a66f12109a9487f7201d3bccf2fa6f716ec87bcc53c1",
        tx_offset: 0,
        successful: true,
        from_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        from_address_label: null,
        to_address: "0x60781c2586d68229fde47564546784ab3faca982",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        gas_offered: 50508,
        gas_spent: 45917,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 0.7642582622552873,
        gas_quote_rate: 35.41349411010742,
        log_events: [
          {
            block_signed_at: "2021-02-21T04:22:01Z",
            block_height: 264062,
            tx_offset: 0,
            log_offset: 0,
            tx_hash:
              "0x4205499f5226eb090252a66f12109a9487f7201d3bccf2fa6f716ec87bcc53c1",
            raw_log_topics: [
              "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
              "0x000000000000000000000000e54ca86531e17ef3616d22ca28b0d458b6c89106",
            ],
            sender_contract_decimals: 18,
            sender_name: "Pangolin",
            sender_contract_ticker_symbol: "PNG",
            sender_address: "0x60781c2586d68229fde47564546784ab3faca982",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0x60781c2586d68229fde47564546784ab3faca982.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000ffffffffffffffffffffffff",
            decoded: {
              name: "Approval",
              signature:
                "Approval(indexed address owner, indexed address spender, uint256 value)",
              params: [
                {
                  name: "owner",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "spender",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xe54ca86531e17ef3616d22ca28b0d458b6c89106",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "79228162514264337593543950335",
                },
              ],
            },
          },
        ],
      },
      {
        block_signed_at: "2021-02-21T04:09:56Z",
        block_height: 263959,
        tx_hash:
          "0x7c15d13457597b021414f44eb7c07acf64f4d3440e4f9195ff6cfb0b14f9136e",
        tx_offset: 0,
        successful: false,
        from_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        from_address_label: null,
        to_address: "0x0c58c2041da4cfccf5818bbe3b66dbc23b3902d9",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        gas_offered: 109777,
        gas_spent: 23343,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 0.38852888071575165,
        gas_quote_rate: 35.41349411010742,
        log_events: [],
      },
      {
        block_signed_at: "2021-02-21T04:09:50Z",
        block_height: 263957,
        tx_hash:
          "0x30db1a56c9ebcc15a1a65f5d5a2adec52e4f152ef2033324135ca967e53d8688",
        tx_offset: 0,
        successful: true,
        from_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        from_address_label: null,
        to_address: "0x0c58c2041da4cfccf5818bbe3b66dbc23b3902d9",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        gas_offered: 109777,
        gas_spent: 57997,
        gas_price: 500000000000,
        fees_paid: null,
        gas_quote: 1.02693820895195,
        gas_quote_rate: 35.41349411010742,
        log_events: [
          {
            block_signed_at: "2021-02-21T04:09:50Z",
            block_height: 263957,
            tx_offset: 0,
            log_offset: 1,
            tx_hash:
              "0x30db1a56c9ebcc15a1a65f5d5a2adec52e4f152ef2033324135ca967e53d8688",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x0000000000000000000000000c58c2041da4cfccf5818bbe3b66dbc23b3902d9",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
            ],
            sender_contract_decimals: 18,
            sender_name: "Pangolin",
            sender_contract_ticker_symbol: "PNG",
            sender_address: "0x60781c2586d68229fde47564546784ab3faca982",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0x60781c2586d68229fde47564546784ab3faca982.png",
            raw_log_data:
              "0x00000000000000000000000000000000000000000000000422e219ce221d0890",
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
                  value: "0x0c58c2041da4cfccf5818bbe3b66dbc23b3902d9",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "76300576209990650000",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T04:09:50Z",
            block_height: 263957,
            tx_offset: 0,
            log_offset: 0,
            tx_hash:
              "0x30db1a56c9ebcc15a1a65f5d5a2adec52e4f152ef2033324135ca967e53d8688",
            raw_log_topics: [
              "0x09ab241b20d83f346e9f8c568dce5b80bf52ff7d87038a8a9d7cc932c8828e84",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x0c58c2041da4cfccf5818bbe3b66dbc23b3902d9",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0x0c58c2041da4cfccf5818bbe3b66dbc23b3902d9.png",
            raw_log_data:
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf300000000000000000000000000000000000000000000000422e219ce221d0890",
            decoded: null,
          },
        ],
      },
      {
        block_signed_at: "2021-02-21T03:59:44Z",
        block_height: 263846,
        tx_hash:
          "0xe047b7ff881d5cd30c713368dc617264003cb01e8c166b2bb62df302e84fd609",
        tx_offset: 0,
        successful: true,
        from_address: "0x0cd4f5525b59df7cf2eed8e054403a093e62176a",
        from_address_label: null,
        to_address: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
        to_address_label: null,
        value: "379130000000000000",
        value_quote: 13.426318021965027,
        gas_offered: 21000,
        gas_spent: 21000,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 0.34953118686676027,
        gas_quote_rate: 35.41349411010742,
        log_events: [],
      },
      {
        block_signed_at: "2021-02-21T03:32:34Z",
        block_height: 263614,
        tx_hash:
          "0x15ca4a4312a072c4e02dc7f8ade1d38e322ff34449de0b0d17a5c91577324d6c",
        tx_offset: 0,
        successful: true,
        from_address: "0x8c14edcc7bfddb43a4d6cb36c25c3b4f30d8b121",
        from_address_label: null,
        to_address: "0x6460777cda22ad67bbb97536ffc446d65761197e",
        to_address_label: null,
        value: "0",
        value_quote: 0.0,
        gas_offered: 8000000,
        gas_spent: 80148,
        gas_price: 470000000000,
        fees_paid: null,
        gas_quote: 1.3340107411903381,
        gas_quote_rate: 35.41349411010742,
        log_events: [
          {
            block_signed_at: "2021-02-21T03:32:34Z",
            block_height: 263614,
            tx_offset: 0,
            log_offset: 1,
            tx_hash:
              "0x15ca4a4312a072c4e02dc7f8ade1d38e322ff34449de0b0d17a5c91577324d6c",
            raw_log_topics: [
              "0x803c5a12f6bde629cea32e63d4b92d1b560816a6fb72e939d3c89e1cab650417",
              "0x0000000000000000000000000000000000000000000000000000000000000001",
              "0x0000000000000000000000000000000000000000000000000000000000000e79",
              "0x0000000000000000000000000000000000000000000000000000000000000003",
            ],
            sender_contract_decimals: 0,
            sender_name: null,
            sender_contract_ticker_symbol: null,
            sender_address: "0x6460777cda22ad67bbb97536ffc446d65761197e",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0x6460777cda22ad67bbb97536ffc446d65761197e.png",
            raw_log_data:
              "0x00000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f98401ab7cdbff455225719cff1ca0fa09dba068af13ae56c7e80b8bde3b5953ac5764",
            decoded: {
              name: "ProposalEvent",
              signature:
                "ProposalEvent(indexed uint8 originChainID, indexed uint64 depositNonce, indexed uint8 status, bytes32 resourceID, bytes32 dataHash)",
              params: [
                {
                  name: "originChainID",
                  type: "uint8",
                  indexed: true,
                  decoded: true,
                  value: "1",
                },
                {
                  name: "depositNonce",
                  type: "uint64",
                  indexed: true,
                  decoded: true,
                  value: "3705",
                },
                {
                  name: "status",
                  type: "uint8",
                  indexed: true,
                  decoded: true,
                  value: "3",
                },
                {
                  name: "resourceID",
                  type: "bytes32",
                  indexed: false,
                  decoded: true,
                  value: "AAAAAAAAAAAAAAAfmECoXVr1vx0XYvklva3cQgH5hAE=",
                },
                {
                  name: "dataHash",
                  type: "bytes32",
                  indexed: false,
                  decoded: true,
                  value: "q3zb/0VSJXGc/xyg+gnboGivE65Wx+gLi947WVOsV2Q=",
                },
              ],
            },
          },
          {
            block_signed_at: "2021-02-21T03:32:34Z",
            block_height: 263614,
            tx_offset: 0,
            log_offset: 0,
            tx_hash:
              "0x15ca4a4312a072c4e02dc7f8ade1d38e322ff34449de0b0d17a5c91577324d6c",
            raw_log_topics: [
              "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
              "0x0000000000000000000000000000000000000000000000000000000000000000",
              "0x000000000000000000000000a79e63e78eec28741e711f89a672a4c40876ebf3",
            ],
            sender_contract_decimals: 18,
            sender_name: "Uniswap",
            sender_contract_ticker_symbol: "UNI",
            sender_address: "0xf39f9671906d8630812f9d9863bbef5d523c84ab",
            sender_address_label: null,
            sender_logo_url:
              "https://logos.covalenthq.com/tokens/43114/0xf39f9671906d8630812f9d9863bbef5d523c84ab.png",
            raw_log_data:
              "0x0000000000000000000000000000000000000000000000000de0b6b3a7640000",
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
                  value: "0x0000000000000000000000000000000000000000",
                },
                {
                  name: "to",
                  type: "address",
                  indexed: true,
                  decoded: true,
                  value: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
                },
                {
                  name: "value",
                  type: "uint256",
                  indexed: false,
                  decoded: true,
                  value: "1000000000000000000",
                },
              ],
            },
          },
        ],
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

export {
  accountAddress,
  startTime,
  endTime,
  chainId,
  response,
  getExpectedURL,
};
