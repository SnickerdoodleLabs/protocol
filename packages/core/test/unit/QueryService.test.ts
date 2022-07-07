/*
Andrew Strimaitis
Unit Testing for Query Service - Pull and Parse JSON
*/
import "reflect-metadata";
import {
    EVMAccountAddress,
    EVMContractAddress,
    Insight,
    IpfsCID,
    ISDQLClause,
    SDQLQuery,
    SDQLString,
} from "@snickerdoodlelabs/objects";
import td from "testdouble";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import {
    IConsentContractRepository,
    IInsightPlatformRepository,
    ISDQLQueryRepository,
} from "@core/interfaces/data";

import { ContextProviderMock } from "../mock/utilities";
import { QueryService } from "@core/implementations/business";
import { IQueryService } from "@core/interfaces/business";
import { okAsync } from "neverthrow";
import { dataWalletAddress, dataWalletKey } from "@core-tests/mock/mocks";
import { IPFSError } from "@snickerdoodlelabs/objects";
import { CID } from "ipfs-http-client";
import { IPFSHTTPClient } from "ipfs-http-client/types/src/types";
import { errAsync } from "neverthrow";
import { IIPFSProvider } from "@core/interfaces/data/IIPFSProvider";
import { SDQLQueryRepository } from "@core/implementations/data/SDQLQueryRepository";

import { IContextProvider } from "@core/interfaces/utilities";
import { IConfigProvider } from "@core/interfaces/utilities";
import { ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { query } from "express";

const consentContractAddress = EVMContractAddress("Phoebe");
const queryId = IpfsCID("Beep");
const queryContent = SDQLString("Hello world!");
const sdqlQuery = new SDQLQuery(queryId, queryContent);
const textToAdd = "Phoebe";
const cidString = IpfsCID("QmeFACA648aPXQp4sP5R6sgJon4wggUhatY61Ras2WWJLF");
const insights: Insight[] = [];

const schema_doc = JSON.stringify({
    "type": "object",
    "properties": {
        "version": {
            "type": "number",
            "minimum": 0
        },
        "description": {
            "type": "string",
            "minLength": 5,
            "maxLength": 300
        },
        "business": {
            "type": "string",
            "minLength": 2,
            "maxLength": 50
        },
        "queries": {
            "type": "object",
            "patternProperties": {
                "^q[0-9]$": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "enum": [
                                "network",
                                "age",
                                "location"
                            ]
                        },
                        "return": {
                            "type": "string",
                            "enum": [
                                "boolean",
                                "integer"
                            ]
                        },
                        "chain": {
                            "type": "string",
                            "enum": [
                                "ETH",
                                "AVAX"
                            ]
                        },
                        "contract": {
                            "type": "object",
                            "properties": {
                                "address": {
                                    "type": "string",
                                    "pattern": "^0x[a-fA-F0-9]{40}$"
                                },
                                "networkid": {
                                    "type": "string",
                                    "enum": [
                                        "1",
                                        "4",
                                        "43114",
                                        "43113"
                                    ]
                                },
                                "function": {
                                    "type": "string",
                                    "enum": [
                                        "Transfer"
                                    ]
                                },
                                "direction": {
                                    "type": "string",
                                    "enum": [
                                        "from",
                                        "to"
                                    ]
                                },
                                "token": {
                                    "type": "string",
                                    "enum": [
                                        "ERC20",
                                        "ERC721"
                                    ]
                                },
                                "blockrange": {
                                    "type": "object",
                                    "properties": {
                                        "start": {
                                            "type": "integer"
                                        },
                                        "end": {
                                            "type": "integer"
                                        }
                                    },
                                    "required": [
                                        "start",
                                        "end"
                                    ]
                                }
                            },
                            "required": [
                                "address",
                                "networkid",
                                "function",
                                "direction",
                                "token",
                                "blockrange"
                            ]
                        },
                        "conditions": {
                            "type": "object",
                            "properties": {
                                "in": {
                                    "type": "array",
                                    "items": {
                                        "type": "integer"
                                    }
                                },
                                "ge": {
                                    "type": "integer"
                                },
                                "l": {
                                    "type": "integer"
                                },
                                "le": {
                                    "type": "integer"
                                },
                                "e": {
                                    "type": "integer"
                                },
                                "g": {
                                    "type": "integer"
                                }
                            }
                        }
                    },
                    "required": [
                        "name",
                        "return"
                    ],
                    "anyOf": [
                        {
                            "properties": {
                                "name": {
                                    "const": "network"
                                }
                            },
                            "required": [
                                "chain",
                                "contract"
                            ]
                        },
                        {
                            "properties": {
                                "return": {
                                    "const": "boolean"
                                },
                                "name": {
                                    "anyOf": [
                                        {
                                            "const": "age"
                                        },
                                        {
                                            "const": "location"
                                        }
                                    ]
                                }
                            },
                            "required": [
                                "conditions"
                            ]
                        },
                        {
                            "properties": {
                                "name": {
                                    "anyOf": [
                                        {
                                            "const": "age"
                                        },
                                        {
                                            "const": "location"
                                        }
                                    ]
                                },
                                "return": {
                                    "const": "integer"
                                }
                            }
                        }
                    ]
                }
            }
        },
        "returns": {
            "type": "object",
            "patternProperties": {
                "^r[0-9]$": {
                    "type": "object",
                    "properties": {
                        "name": {
                            "type": "string",
                            "enum": [
                                "callback",
                                "query_response"
                            ]
                        },
                        "message": {
                            "type": "string"
                        },
                        "query": {
                            "type": "string",
                            "pattern": "^q[0-9]$"
                        }
                    },
                    "required": [
                        "name"
                    ],
                    "anyOf": [
                        {
                            "properties": {
                                "name": {
                                    "const": "callback"
                                }
                            },
                            "required": [
                                "message"
                            ]
                        },
                        {
                            "properties": {
                                "name": {
                                    "const": "query_response"
                                }
                            },
                            "required": [
                                "query"
                            ]
                        }
                    ]
                }
            },
            "properties": {
                "url": {
                    "type": "string",
                    "pattern": "^http(s)?:\/\/[\\-a-zA-Z0-9]*.[a-zA-Z0-9]*.[a-zA-Z]*\/[a-zA-Z0-9]*$"
                }
            },
            "required": [
                "url"
            ]
        },
        "compensations": {
            "type": "object",
            "patternProperties": {
                "^c[0-9]$": {
                    "type": "object",
                    "properties": {
                        "description": {
                            "type": "string",
                            "minLength": 5,
                            "maxLength": 300
                        },
                        "callback": {
                            "type": "string",
                            "pattern": "^http(s)?:\/\/[\\-a-zA-Z0-9]*.[a-zA-Z0-9]*.[a-zA-Z]*\/[a-zA-Z0-9]*$"
                        }
                    },
                    "required": [
                        "description",
                        "callback"
                    ]
                }
            }
        },
        "logic": {
            "type": "object",
            "properties": {
                "returns": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                },
                "compensations": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            },
            "required": [
                "returns",
                "compensations"
            ]
        }
    },
    "required": [
        "version",
        "description",
        "business",
        "queries",
        "compensations",
        "returns",
        "logic"
    ]
});

const testing_schema = JSON.stringify({
    "version": 0.1,
    "description": "ETH sent on the Ethereum blockchain by north american millenials",
    "business": "Shrapnel",
    "queries": {
        "q1": {
            "name": "network",
            "return": "boolean",
            "chain": "ETH",
            "contract": {
                "networkid": "1",
                "address": "0xdac17f958d2ee523a2206206994597c13d831ec7",
                "function": "Transfer",
                "direction": "from",
                "token": "ERC20",
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
                "ge": 23,
                "l": 38
            }
        },
        "q3": {
            "name": "location",
            "return": "boolean",
            "conditions": {
                "in": [
                    840,
                    484,
                    124,
                    304
                ]
            }
        },
        "q4": {
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
        "r3": {
            "name": "query_response",
            "query": "q4"
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
        },
        "c3": {
            "description": "a free CrazyApesClub NFT",
            "callback": "https://418e-64-85-231-39.ngrok.io/crazyapesclub"
        }
    },
    "logic": {
        "returns": ["if($q1and$q2and$q3)then$r1else$r2", "$r3"],
        "compensations": ["if$q1then$c1", "if$q2then$c2", "if$q3then$c2", "if$q4then$c3"]
    }
}
);

// convert sdqlquerystring into an sdqlqueryobject
const obj = new SDQLQuery(cidString, SDQLString(testing_schema));
const queryContent2 = JSON.parse(obj.query) as ISDQLQueryObject;

class QueryServiceMocks {
    public queryParsingEngine: IQueryParsingEngine;
    public sdqlQueryRepo: ISDQLQueryRepository;
    public insightPlatformRepo: IInsightPlatformRepository;
    public consentContractRepo: IConsentContractRepository;
    public contextProvider: ContextProviderMock;

    public constructor() {
        this.queryParsingEngine = td.object<IQueryParsingEngine>();
        this.sdqlQueryRepo = td.object<ISDQLQueryRepository>();
        this.insightPlatformRepo = td.object<IInsightPlatformRepository>();
        this.consentContractRepo = td.object<IConsentContractRepository>();
        this.contextProvider = new ContextProviderMock();


        td.when(this.queryParsingEngine.handleQuery(queryContent2, queryId)).thenReturn(okAsync(insights))

        td.when(this.sdqlQueryRepo.getByCID(queryId)).thenReturn(okAsync(sdqlQuery));

        td.when(this.consentContractRepo
            .isAddressOptedIn(
                consentContractAddress,
                EVMAccountAddress(dataWalletAddress),
            )).thenReturn(okAsync(true));

        //td.when(this.queryParsingEngine.handleQuery())
    }

    public factory(): IQueryService {
        return new QueryService(
            this.queryParsingEngine,
            this.sdqlQueryRepo,
            this.insightPlatformRepo,
            this.consentContractRepo,
            this.contextProvider,
        );
    }
}

class SDQLQueryRepositoryMocks {
    public ipfsClient = td.object<IPFSHTTPClient>();
    public ipfsProvider = td.object<IIPFSProvider>();
    public contextProvider = td.object<IContextProvider>();
    public configProvider = td.object<IConfigProvider>();

    public cid = td.object<CID>();

    constructor() {
        td.when(this.ipfsProvider.getIFPSClient()).thenReturn(
            okAsync(this.ipfsClient),
        );

        td.when(
            this.ipfsClient.add(textToAdd, td.matchers.contains({ pin: true })),
        ).thenResolve({
            cid: this.cid,
        });

        let called = false;
        const asyncIterable = {
            [Symbol.asyncIterator]() {
                return {
                    next() {
                        const enc = new TextEncoder(); // always utf-8

                        if (called) {
                            return Promise.resolve({
                                value: Uint8Array.from([]),
                                done: true,
                            });
                        }
                        called = true;
                        return Promise.resolve({
                            value: enc.encode(textToAdd),
                            done: false,
                        });
                    },
                };
            },
        };

        td.when(this.ipfsClient.cat(cidString)).thenReturn(asyncIterable);

        this.cid.toString = () => {
            return cidString;
        };
    }

    public factoryRepository(): ISDQLQueryRepository {
        return new SDQLQueryRepository(this.configProvider, this.contextProvider, this.ipfsProvider);
    }
}

describe("Query Service tests", () => {
    test("onQueryPosted() golden path", async () => {
        // Arrange
        const mocks = new QueryServiceMocks();
        const service = mocks.factory();
        // Act
        const result = await service.onQueryPosted(consentContractAddress, queryId);
        // Assert
        // run the test - did it pass?
        expect(result).toBeDefined();
        expect(result.isErr()).toBeFalsy();
        mocks.contextProvider.assertEventCounts({ onQueryPosted: 1 });
    });

    test("Parse JSON data from IPFS", async () => {
        const SDQLRepoMocks = new SDQLQueryRepositoryMocks();
        const ServiceMocks = new QueryServiceMocks();

        const QueryRepo = SDQLRepoMocks.factoryRepository();
        const ServiceRepo = ServiceMocks.factory();

        /* Call SDQLQuery to check for proper Query/JSON return value */
        // Act
        const CIDResult = await QueryRepo.getByCID(cidString);
        // Assert
        expect(CIDResult).toBeDefined();
        expect(CIDResult.isErr()).toBeFalsy();
        const val = CIDResult._unsafeUnwrap();
        expect(val).toBeInstanceOf(SDQLQuery);
        expect(val).toMatchObject(new SDQLQuery(cidString, SDQLString(textToAdd)));
        // Test to parse the SDQLQueryObject

        // convert sdqlquerystring into an sdqlqueryobject
        let obj = new SDQLQuery(cidString, SDQLString(testing_schema));
        const queryContent = JSON.parse(obj.query) as ISDQLQueryObject;
        /*
                console.log(queryContent.returns);
                console.log(JSON.stringify(queryContent.returns, null, 4));
                console.log(queryContent.returns["url"]);
                console.log(queryContent.returns.url);
        */
        // Act

        console.log(queryContent.logic.returns);
        console.log(queryContent.logic.returns[0]);

        let splitInput = queryContent.logic.returns[0].split('then'); //this will output ["1234", "56789"]
        console.log(splitInput)
        console.log(splitInput[0])
        console.log(splitInput[1])


        splitInput = queryContent.logic.returns[0].split('then'); //this will output ["1234", "56789"]
        let queries = splitInput[0];

        queries = queries.replace('if', '');
        console.log(queries);
        queries = queries.replace('(', '');
        console.log(queries);
        queries = queries.replace(')', '');
        console.log(queries);

        let splitQueries = queries.split('and');
        console.log(splitQueries);

        splitQueries.forEach(element => {
            console.log(element.split('$')[1]);
            console.log(queryContent.queries[element.split('$')[1]]);
        });


        console.log(queryContent.queries["q3"]["conditions"]["in"]);


        /*
        queries = splitInput[1];
        queries = queries.replace('if', '');
        console.log(queries);
        queries = queries.replace('(', '');
        console.log(queries);
        queries = queries.replace(')', '');
        console.log(queries);
        */





        const queryResult = await ServiceMocks.queryParsingEngine.handleQuery(queryContent2, queryId);

        // Assert
        // run the test - did it pass?
        expect(queryResult).toBeDefined();
        expect(queryResult.isErr()).toBeFalsy();
        //ServiceMocks.contextProvider.assertEventCounts({ onQueryPosted: 1 });


    });
});
