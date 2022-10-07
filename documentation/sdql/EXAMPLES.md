# SDQL Examples
**For an update list of queries, please, [check here](https://github.com/SnickerdoodleLabs/protocol/tree/develop/packages/contracts/etc/data/queries).**

## Query Target 15 and Older Users About Avalanche Transfer, Location, Age, Gender, URLs Visited, And Chain Transaction Count

This example checks if the user's age is greater than or equal to 15. It also queries transaction history on the Avalanche mainnet for an ERC-20 token, checks the user's location, gender, urls visited and chain transaction count. 

```
{
    "version": 0.1,
    "timestamp": "2021-11-13T20:20:39",
    "expiry" : "2022-11-13T20:20:39",
    "description": "For 15-year and older individuals, querying intractions with the Avalanche blockchain, location, gender, urls visited and chain transaction count",
    "business": "Shrapnel",
    "queries": {
        "q1": {
            "name": "network",
            "return": "object",
            "object_schema": {
                "properties": {
                    "networkid": {
                        "type": "integer"
                    },
                    "address": {
                        "type": "string",
                        "pattern": "^0x[a-fA-F0-9]{40}$"
                    },
                    "return": {
                        "type": "boolean"
                    }
                },
                "required": [
                    "networkid",
                    "address",
                    "return"
                ]
            },   
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
        "q3": {
            "name": "location",
            "return": "string",
            "string_pattern": "^([A-Z]){2}$"
        },
        "q4": {
            "name": "gender",
            "return": "enum",
            "enum_keys": [
                    "female",
                    "male",
                    "nonbinary",
                    "unknown"
                ]
        },
        "q5": {
            "name": "url_visited_count",
            "return": "object",
            "object_schema":{
                "patternProperties":{
                    "^http(s)?:\/\/[\\-a-zA-Z0-9]*.[a-zA-Z0-9]*.[a-zA-Z]*\/[a-zA-Z0-9]*$": {
                        "type": "integer"
                    } 
                }
            }
        },
        "q6": {
            "name": "chain_transactions",
            "return": "array",
            "array_items": {
                "type": "object",
                "object_schema": {
                    "properties": {
                        "tickerSymbol": {
                            "type": "string"
                        },
                        "incomingValue": {
                            "type": "number"
                        },
                        "incomingCount": {
                            "type": "integer"
                        },
                        "outgoingValue": {
                            "type": "number"
                        },
                        "outgoingCount": {
                            "type": "integer"
                        }
                    },
                    "required": [
                        "networkId",
                        "incomingValue",
                        "incomingCount",
                        "outgoingValue",
                        "outgoingCount"                        
                    ]
                }
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
        "r3": {
            "name": "query_response",
            "query": "q3"
        },
        "r4": {
            "name": "query_response",
            "query": "q4"
        },
        "r5": {
            "name": "query_response",
            "query": "q5"
        },
        "r6": {
            "name": "query_response",
            "query": "q6"
        },
        "r7": {
            "name": "query_response",
            "query": "q1"
        },
        "url": "https://418e-64-85-231-39.ngrok.io/insights"
    },
    "compensations": {
        "c1": {
            "description": "10% discount code for Starbucks",
            "callback": "https://418e-64-85-231-39.ngrok.io/starbucks"
        },
        "c2": {
            "description": "participate in the draw to win a CryptoPunk NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/cryptopunk"
        },
        "c3": {
            "description": "a free CrazyApesClub NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/crazyapesclub"
        }
    },
    "logic": {
        "returns": [
            "if$q2then$r1else$r2",
            "$r3",
            "$r4",
            "$r5", 
            "$r6",
            "$r7"
        ],
        "compensations": [
            "if$q1then$c1",
            "if$q2then$c2",
            "if$q3then$c3",
            "if$q4then$c2",
            "if$q5then$c2",
            "if$q6then$c2"
        ]
    }
}
```

## Target US-Based Users Who Received An Ethereum NFT And Visited Uniswap and Crabada

This query determines if a US-based user has received an ERC-721 token on the Ethereum mainnet in a certain time-frame and have visited Uniswap and Crabada. 

```
{
    "version": 0.1,
    "timestamp": "2021-11-13T20:20:39",
    "expiry": "2022-11-13T20:20:39",
    "description": "Target US residents who received an NFT on the Ethereum blockchain and visted Uniswap and Crabada",
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
                    "US"
                ]
            }
        },
        "q3": {
            "name": "browsing_history",
            "return": "boolean",
            "conditions": {
                "has": {
                    "https://www.crabada.com": 30,
                    "https://www.uniswap.org": 5
                }
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
    "compensations": {
        "c1": {
            "description": "10% discount code for Starbucks",
            "callback": "https://418e-64-85-231-39.ngrok.io/starbucks"
        },
        "c2": {
            "description": "participate in the draw to win a CryptoPunk NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/cryptopunkdraw"
        }
    },
    "logic": {
        "returns": [
            "if($q1and$q2and$q3)then$r1else$r2"
        ],
        "compensations": [
            "if$q1then$c1",
            "if$q2then$c2",
            "if$q3then$c2"
        ]
    }
}
```
