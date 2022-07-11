/*
Andrew Strimaitis
Unit Testing for Query Service - Pull and Parse JSON
*/
import "reflect-metadata";
import td from "testdouble";

import { ContextProviderMock } from "../mock/utilities";
import { QueryService } from "@core/implementations/business";
import { IQueryService } from "@core/interfaces/business";
import { okAsync } from "neverthrow";
import { dataWalletAddress } from "@core-tests/mock/mocks";
import { CID } from "ipfs-http-client";
import { IPFSHTTPClient } from "ipfs-http-client/types/src/types";
import { IIPFSProvider } from "@core/interfaces/data/IIPFSProvider";
import { SDQLQueryRepository } from "@core/implementations/data/SDQLQueryRepository";
import { IContextProvider } from "@core/interfaces/utilities";
import { IConfigProvider } from "@core/interfaces/utilities";
import { EligibleReward, ISDQLQueryObject, URLString } from "@snickerdoodlelabs/objects";
import { IQueryParsingEngine } from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IInsightPlatformRepository,
  ISDQLQueryRepository,
} from "@core/interfaces/data";
import { 
    EVMContractAddress, 
    IpfsCID, 
    SDQLString,
    SDQLQuery,
    Insight,
    EVMAccountAddress
} from "@snickerdoodlelabs/objects";
import { QueryParsingEngine } from "@browser-extension/implementations/business/utilities";


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

const bad_requirements = JSON.stringify({
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
        "returns": ["$r3"],
        "compensations": ["if$q1then$c1"]
    }
}
);

const cidString = IpfsCID("QmeFACA648aPXQp4sP5R6sgJon4wggUhatY61Ras2WWJLF");
const cidString_test1 = IpfsCID("Test1STring");
const cidString_test2 = IpfsCID("Test2String");

const queryId = IpfsCID("Beep");
const SDQLQueryObject = new SDQLQuery(cidString_test1, SDQLString(testing_schema));
const obj = JSON.parse(SDQLQueryObject.query) as ISDQLQueryObject;


const insightsMap : Insight[] = [];
const rewardsMap : EligibleReward[] = [];


// convert sdqlquerystring into an sdqlqueryobject

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

    
    td.when(this.queryParsingEngine.handleQuery(obj, cidString_test1)).thenReturn(
      okAsync([insightsMap, rewardsMap])
    );

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

describe("Query Parsing Engine tests", () => {
    
    test("Test Handle Query Functionality", async () => {
        const ServiceMocks = new QueryServiceMocks();
        let obj = new SDQLQuery(cidString_test1, SDQLString(testing_schema));
        const queryContent = JSON.parse(obj.query) as ISDQLQueryObject;
        const queryResult = await ServiceMocks.queryParsingEngine.handleQuery(queryContent, cidString_test1);

        expect(queryContent).toBeDefined();
        expect(queryResult["value"]).toBeDefined();
        expect(queryResult["value"]).toEqual(expect.arrayContaining([[], []]))
        console.log(queryResult);
    });
    /*

    test("Test Read Logic Entry Functionality", async () => {
        const ServiceMocks = new QueryServiceMocks();
        let obj = new SDQLQuery(cidString_test2, SDQLString(testing_schema));
        const queryContent = JSON.parse(obj.query) as ISDQLQueryObject;
        const queryResult = await ServiceMocks.queryParsingEngine.handleQuery(queryContent, cidString_test2);

        expect(queryContent).toBeDefined();
        console.log(queryResult);
        expect(queryResult).toBeDefined();
        //expect(queryResult["value"]).toEqual(expect.arrayContaining([[], []]))
    });
    */


    /*
            
        // number | number[] | boolean, never | PersistenceError
        ServiceMocks.queryParsingEngine.readLogicEntry(queryContent, cidString, true)

        // number | PersistenceError
        ServiceMocks.queryParsingEngine.readQueryEntry(queryContent, cidString, true)

        // number | boolean, PersistenceError
        ServiceMocks.queryParsingEngine.readReturnEntry(queryContent, cidString, true)

        // EligibleReward, never | PersistenceError
        ServiceMocks.queryParsingEngine.readLogicCompEntry(queryContent, cidString, true)
        // EligibleReward, PersistenceError
        ServiceMocks.queryParsingEngine.readReturnEntry(queryContent, cidString, true)
        // Assert
        // run the test - did it pass?
        expect(queryResult).toBeDefined();
        //expect(queryResult.isErr()).toBeFalsy();

        */

    
});
