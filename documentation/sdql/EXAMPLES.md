# SDQL Examples

## Avalanche Transfer

This example queries transaction history on the Avalanche mainnet for an ERC-20 token. It also checks that the user's age is greater than or equal to 15. 

```
{
    "version": 0.1,
    "description": "Interactions with the Avalanche blockchain for 15-year and older individuals",
    "business": "Shrapnel",
    "queries": {
        "q1": {
            "name": "network",
            "return": "boolean",
            "chain": "AVAX",
            "contract": {
                "networkid": "43114",
                "address": "0x9366d30feba284e62900f6295bc28c9906f33172",
                "function": "Transfer",
                "direction": "from",
                "token": "ERC20",
                "blockrange": {
                    "start": 13001519,
                    "end": 14910334
                }
            }
        },
        "q2": {
            "name": "age",
            "return": "boolean",
            "conditions": {
                "ge": 15
            }
        },
        "q3":{
            "name": "location",
            "return": "integer"
        }
    },
    "returns": {
        "r1": {
            "name": "callback",
            "message": "qualified"
        },
        "r2": {
            "name": "callback",
            "message": "not qualified"
        },
        "r3":{
            "name": "query_response",
            "query": "q3"
        },
        "url": "https://418e-64-85-231-39.ngrok.io/insights"
    },
    "compensations":{
        "c1":{
            "description": "10% discount code for Starbucks",
            "callback": "https://418e-64-85-231-39.ngrok.io/starbucks"
        },
        "c2":{
            "description": "participate in the draw to win a CryptoPunk NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/cryptopunk"
        },
        "c3":{
            "description": "a free CrazyApesClub NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/crazyapesclub"
        }
    },
    "logic":{
        "returns": ["if($q1and$q2)then$r1else$r2", "$r3"],
        "compensations": ["if$q1then$c1","if$q2then$c2","if$q3then$c3"]
    }
}
```

## Ethereum NFT United States

This query determines if a US-based user has received and ERC-721 token on the Ethereum mainnet in a certain time-frame. 

```
{
    "version": 0.1,
    "description": "NFT received on the Ethereum blockchain by US residents",
    "business": "Shrapnel",
    "queries": {
        "q1": {
            "name": "network",
            "return": "boolean",
            "chain": "ETH",
            "contract": {
                "networkid": "1",
                "address": "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d",
                "function": "Transfer",
                "direction": "to",
                "token": "ERC721",
                "blockrange": {
                    "start": 14801177,
                    "end": 14801190
                }
            }
        },
        "q2": {
            "name": "location",
            "return": "boolean",
            "conditions": {
                "in": [
                    840
                ]
            }
        }
    },
    "returns": {
        "r1": {
            "name": "callback",
            "message": "qualified"
        },
        "r2": {
            "name": "callback",
            "message": "not qualified"
        },
        "url": "https://418e-64-85-231-39.ngrok.io/insights"
    },
    "compensations":{
        "c1":{
            "description": "10% discount code for Starbucks",
            "callback": "https://418e-64-85-231-39.ngrok.io/starbucks"
        },
        "c2":{
            "description": "participate in the draw to win a CryptoPunk NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/cryptopunkdraw"
        }
    },
    "logic":{
        "returns": ["if($q1and$q2)then$r1else$r2"],
        "compensations": ["if$q1then$c1", "if$q2then$c2"]
    }
}
```

## Solana Transfer

This query determines if a user, who is 15 years or older, has made a transfer of SOL on the Solana blockchain during a certain time period. 

```
{
    "version": 0.1,
    "description": "Interactions with the Solana blockchain for 15-year and older individuals",
    "business": "Shrapnel",
    "queries": {
        "q1": {
            "name": "network",
            "return": "boolean",
            "chain": "SOL",
            "contract": {
                "networkid": "1",
                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "function": "Transfer",
                "direction": "to",
                "token": "ERC721",
                "blockrange": {
                    "start": 14759310,
                    "end": 14759317
                }
            }
        },
        "q2": {
            "name": "age",
            "return": "boolean",
            "conditions": {
                "ge": 15
            }
        }
    },
    "returns": {
        "r1": {
            "name": "callback",
            "message": "qualified"
        },
        "r2": {
            "name": "callback",
            "message": "not qualified"
        },
        "url": "https://418e-64-85-231-39.ngrok.io/insights"
    },
    "compensations":{
        "c1":{
            "description": "10% discount code for Starbucks",
            "callback": "https://418e-64-85-231-39.ngrok.io/starbucks"
        },
        "c2":{
            "description": "participate in the draw to win a CryptoPunk NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/cryptopunkdraw"
        }
    },
    "logic":{
        "returns": ["if($q1and$q2)then$r1else$r2"],
        "compensations": ["if$q1then$c1","if$q2then$c2"]
    }
}
```