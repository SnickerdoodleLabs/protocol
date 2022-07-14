/*
Andrew Strimaitis
Unit Testing for Query Service - Pull and Parse JSON
*/
import "reflect-metadata";
import td from "testdouble";

import { ContextProviderMock } from "../mock/utilities";
import { QueryService } from "@core/implementations/business";
import { IQueryService } from "@core/interfaces/business";
import { Err, okAsync } from "neverthrow";
import { dataWalletAddress } from "@core-tests/mock/mocks";
import { CID } from "ipfs-http-client";
import { IPFSHTTPClient } from "ipfs-http-client/types/src/types";
import { IIPFSProvider } from "@core/interfaces/data/IIPFSProvider";
import { SDQLQueryRepository } from "@core/implementations/data/SDQLQueryRepository";
import { IContextProvider } from "@core/interfaces/utilities";
import { IConfigProvider } from "@core/interfaces/utilities";
import { EligibleReward, EVMTransaction, ISDQLQueryObject, QueryFormatError, URLString } from "@snickerdoodlelabs/objects";
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
import { QueryParsingEngine } from "@core/implementations/business/utilities";


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

import { IDataWalletPersistenceType } from "@snickerdoodlelabs/objects";
import { IDataWalletPersistence } from "@snickerdoodlelabs/objects";
import { ConsentConditions } from "@snickerdoodlelabs/objects";
import { reject } from "postmate";

// convert sdqlquerystring into an sdqlqueryobject

class QueryParsingEngineMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  public consentConditions = td.object<ConsentConditions>();
  protected insightsMap: Insight[] = [];
  protected rewardsMap: EligibleReward[] = [];
  protected transactions: EVMTransaction[] = [];


  public constructor() {

    let subQuery = (obj["queries"]["q1"]) as Object;
    td.when(this.persistenceRepo.getEVMTransactions(
        subQuery["contract"]["address"],
        subQuery["contract"]["blockrange"]["start"],
        subQuery["contract"]["blockrange"]["end"]))
    .thenReturn(
        okAsync(this.transactions),
    );

  }

  public factoryRepository(): IQueryParsingEngine {
    return new QueryParsingEngine(
      this.persistenceRepo,
      this.consentConditions,
    );
  }
}


describe("Query Parsing Engine tests", () => {
    test("Test Bad Requirements Functionality", async () => {
        const mocks = new QueryParsingEngineMocks();
        const repo = mocks.factoryRepository();

        const BadQueryObject = new SDQLQuery(cidString_test1, SDQLString(bad_requirements));
        const bad_obj = JSON.parse(BadQueryObject.query) as ISDQLQueryObject;
        const queryResult = await repo.handleQuery(bad_obj, cidString);
        expect(queryResult).toBeDefined();
        expect(queryResult).toBeInstanceOf(Err);

    });
    test("Test Handle Query Functionality", async () => {
            const mocks = new QueryParsingEngineMocks();
            const repo = mocks.factoryRepository();
    
            const obj = JSON.parse(SDQLQueryObject.query) as ISDQLQueryObject;
    
            td.when(repo.readLogicEntry(obj, obj["logic"]["returns"][0])).thenReturn(
                okAsync([1])
            )
            td.when(repo.readLogicEntry(obj, obj["logic"]["returns"][1])).thenReturn(
                okAsync([0])
            )
            /*
            td.when(repo.generateInsight(obj, cidString, 0)).thenReturn(
                okAsync(new Insight(cidString, obj["returns"]["url"] as URLString, [0]))
                //return okAsync(new Insight(cid, obj["returns"]["url"] as URLString, data));
            )
            td.when(repo.generateInsight(obj, cidString, 1)).thenReturn(
                okAsync(new Insight(cidString, obj["returns"]["url"] as URLString, [1]))
                //return okAsync(new Insight(cid, obj["returns"]["url"] as URLString, data));
            )
            */

    
            
            const queryResult = await repo.handleQuery(obj, cidString);
            console.log(queryResult);
    
            expect(queryResult).toBeDefined();
            /*
            expect(queryResult["value"][0]).toEqual(expect.arrayContaining(Insight[2]))
            expect(queryResult["value"][1]).toEqual(expect.arrayContaining([[EligibleReward], [EligibleReward], [EligibleReward], [EligibleReward]]))
            */

            //expect(queryResult[1]).toEqual(expect.arrayContaining([[EligibleReward], [EligibleReward], [EligibleReward], [EligibleReward]]))
            console.log(queryResult["value"][0]);
            console.log(queryResult["value"][1]);

        
        
    });

    /*
    test("Test Read Logic Entry Functionality", async () => {
        const mocks = new QueryParsingEngineMocks();
        const repo = mocks.factoryRepository();
        
        let obj = new SDQLQuery(cidString_test2, SDQLString(testing_schema));
        const queryContent = JSON.parse(obj.query) as ISDQLQueryObject;
        const queryResult = await repo.handleQuery(queryContent, cidString_test2);

        expect(queryContent).toBeDefined();
        console.log(queryResult);
        expect(queryResult).toBeDefined();
        //expect(queryResult["value"]).toEqual(expect.arrayContaining([[], []]))
    });
    */

});
