import { ChainId, EVMAccountAddress } from "@snickerdoodlelabs/objects";

const accountAddress: EVMAccountAddress = EVMAccountAddress(
  "0x38779ede53ab96451772b79cb08a91677442a40b",
);
const chainId: ChainId = ChainId(1);

function getExpectedURL(apiKey: string): string {
    return `https://api.covalenthq.com/v1/${chainId.toString()}/address/${accountAddress.toString()}/balances_v2/?key=${apiKey}`;
}

const response = {
    "data": {
        "address": "0x38779ede53ab96451772b79cb08a91677442a40b",
        "updated_at": "2022-07-21T17:53:53.264646166Z",
        "next_update_at": "2022-07-21T17:58:53.264646226Z",
        "quote_currency": "USD",
        "chain_id": 1,
        "items": [
            {
                "contract_decimals": 18,
                "contract_name": "Ether",
                "contract_ticker_symbol": "ETH",
                "contract_address": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                "supports_erc": null,
                "logo_url": "https://www.covalenthq.com/static/images/icons/display-icons/ethereum-eth-logo.png",
                "last_transferred_at": null,
                "type": "cryptocurrency",
                "balance": "167797384036290090",
                "balance_24h": "167797384036290090",
                "quote_rate": 1556.9363,
                "quote_rate_24h": 1531.8086,
                "quote": 261.24985,
                "quote_24h": 257.03348,
                "nft_data": null
            },
            {
                "contract_decimals": 18,
                "contract_name": "Matic Token",
                "contract_ticker_symbol": "MATIC",
                "contract_address": "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
                "supports_erc": [
                    "erc20"
                ],
                "logo_url": "https://logos.covalenthq.com/tokens/1/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png",
                "last_transferred_at": "2022-03-18T01:26:21Z",
                "type": "cryptocurrency",
                "balance": "96473847641257037802",
                "balance_24h": "96473847641257037802",
                "quote_rate": 0.9117491,
                "quote_rate_24h": 0.8363016,
                "quote": 87.959946,
                "quote_24h": 80.68124,
                "nft_data": null
            },
            {
                "contract_decimals": 18,
                "contract_name": "Audius",
                "contract_ticker_symbol": "AUDIO",
                "contract_address": "0x18aaa7115705e8be94bffebde57af9bfc265b998",
                "supports_erc": [
                    "erc20"
                ],
                "logo_url": "https://logos.covalenthq.com/tokens/1/0x18aaa7115705e8be94bffebde57af9bfc265b998.png",
                "last_transferred_at": "2022-03-18T01:59:02Z",
                "type": "cryptocurrency",
                "balance": "200000000000000001211",
                "balance_24h": "200000000000000001211",
                "quote_rate": 0.39499155,
                "quote_rate_24h": 0.38648865,
                "quote": 78.99831,
                "quote_24h": 77.29773,
                "nft_data": null
            }
        ],
        "pagination": null
    },
    "error": false,
    "error_message": null,
    "error_code": null
}

export {accountAddress, chainId, response, getExpectedURL}