
import "reflect-metadata";

import { QueryEvaluator } from "@core/implementations/business/utilities/query/QueryEvaluator";
import { Age, ChainId, CountryCode, EVMAccountAddress, EVMBlockNumber, EVMBlockRange, EVMChainCode, EVMContractAddress, EVMContractDirection, EVMContractFunction, EVMToken, Gender, SDQL_Name, SDQL_OperatorName, UnixTimestamp, URLString } from "@objects/primitives";
import { EVMTransaction, EVMTransactionFilter, IDataWalletPersistence } from "@snickerdoodlelabs/objects";
import { 
    AST_NetworkQuery,
    AST_PropertyQuery, 
    ConditionE, 
    ConditionG, 
    ConditionGE, 
    ConditionIn, 
    ConditionL, 
    ConditionLE
} from "@core/interfaces/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";
import { AST_Contract } from "@core/interfaces/objects/SDQL/AST_Contract";


const conditionsGE = [
    new ConditionGE(SDQL_OperatorName('ge'), null, 20)
];
const conditionsGE2 = [
    new ConditionGE(SDQL_OperatorName('ge'), null, 25)
];
const conditionsGE3 = [
    new ConditionGE(SDQL_OperatorName('ge'), null, 30)
];

const conditionsLE = [
    new ConditionLE(SDQL_OperatorName('le'), null, 20)
];
const conditionsLE2 = [
    new ConditionLE(SDQL_OperatorName('le'), null, 25)
];
const conditionsLE3 = [
    new ConditionLE(SDQL_OperatorName('le'), null, 30)
];

const conditionsG = [
    new ConditionG(SDQL_OperatorName('g'), null, 24)
];
const conditionsG2 = [
    new ConditionG(SDQL_OperatorName('g'), null, 25)
];
const conditionsG3 = [
    new ConditionG(SDQL_OperatorName('g'), null, 26)
];
const conditionsL = [
    new ConditionL(SDQL_OperatorName('l'), null, 24)
];
const conditionsL2 = [
    new ConditionL(SDQL_OperatorName('l'), null, 25)
];
const conditionsL3 = [
    new ConditionL(SDQL_OperatorName('l'), null, 26)
];

const conditionsE = [
    new ConditionE(SDQL_OperatorName('e'), null, 25)
];
const conditionsE2 = [
    new ConditionE(SDQL_OperatorName('e'), null, 26)
];

const conditionsGEandL = [
    new ConditionGE(SDQL_OperatorName('ge'), null, 20),
    new ConditionL(SDQL_OperatorName('l'), null, 30)
];


class QueryEvaluatorMocks {

    public dataWalletPersistence = td.object<IDataWalletPersistence>();

    public URLmap = new Map<URLString, number>([
        [URLString("www.snickerdoodlelabs.io"), 10]
    ]);

    public transactionsMap = new Map<ChainId, number>([
        [ChainId(1), 10]
    ]);



    public constructor() {  
        this.dataWalletPersistence.setAge(Age(25));
        //this.dataWalletPersistence.setLocation(CountryCode("US"));
        td.when(this.dataWalletPersistence.getAge())
        .thenReturn(
            okAsync(Age(25)),
        );
        /*
        td.when(this.dataWalletPersistence.getLocation())
        .thenReturn(
            okAsync(CountryCode("US")),
        );
        */
        td.when(this.dataWalletPersistence.getGender())
        .thenReturn(
            okAsync(Gender("male")),
        );

        td.when(this.dataWalletPersistence.getSiteVisitsMap())
        .thenReturn(
            okAsync(this.URLmap),
        );
        td.when(this.dataWalletPersistence.getTransactionsMap())
        .thenReturn(
            okAsync(this.transactionsMap),
        );

        
    }
    
    public factory() {
      return new QueryEvaluator(this.dataWalletPersistence);
    }
  }
  

describe("QueryEvaluator checking age boolean: GE", () => {
    test("EvalPropertyQuery: when age is 25 >= 20, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    
    test("EvalPropertyQuery: when age is 25 >= 25, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE2,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    test("EvalPropertyQuery: when age 25 >= 30, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE3,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
})

describe("QueryEvaluator checking age boolean: LE", () => {
    test("EvalPropertyQuery: when age is 25 <= 20, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsLE,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
    test("EvalPropertyQuery: when age is 25 <= 25, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsLE2,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    test("EvalPropertyQuery: when age 25 <= 30, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsLE3,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
})

describe("QueryEvaluator checking age boolean: G", () => {
    test("EvalPropertyQuery: when age is 25 > 24, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsG,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    
    test("EvalPropertyQuery: when age is 25 > 25, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsG2,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
    
    test("EvalPropertyQuery: when age is 25 > 26, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsG3,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
})

describe("QueryEvaluator checking age boolean: L", () => {
    test("EvalPropertyQuery: when age is 25 < 24, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsL,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        // console.log(result["value"]);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
    
    test("EvalPropertyQuery: when age is 25 < 25, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsL2,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
    
    test("EvalPropertyQuery: when age is 25 < 26, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsL3,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        // console.log(result["value"]);

        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
})

describe("QueryEvaluator checking age boolean: E", () => {
    test("EvalPropertyQuery: when age is 25 == 25, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsE,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    test("EvalPropertyQuery: when age is 25 == 26, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsE2,
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
})
/*
describe("QueryEvaluator checking location condition in", () => {
    test("EvalPropertyQuery: when location is in ConditionIn, return true", async () => {
        const conditionsIn = new ConditionIn(
            SDQL_OperatorName('in'), 
            57, 
            [62, 85, 57, 45])
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "location",
            [conditionsIn],
            []
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    test("EvalPropertyQuery: when location is NOT in ConditionIn, return false", async () => {
        const conditionsIn2 = new ConditionIn(
            SDQL_OperatorName('in'), 
            57, 
            [62, 85, 45])
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "location",
            [conditionsIn2],
            []
        )
        //console.log(propertyQuery);
        //  DO the mocks to get age
        // DO the rest
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    });
})
*/
describe("QueryEvaluator return integer values", () => {
    test("EvalPropertyQuery: return age", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "age",
            [],
            [],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        // console.log("Age is: ", result["value"]);
        expect(result["value"]).toEqual(Age(25))
    })
    /*
    test("EvalPropertyQuery: return location", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "location",
            [],
            []
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        // console.log("Location is: ", result["value"]);
        expect(result["value"]).toEqual(CountryCode(57))
    })
    */

    test("EvalPropertyQuery: return gender as male", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "enum",
            "gender",
            [], 
            ["male", "female", "non-binary", "unknown"],
            {}

        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        // console.log("Gender is: ", result["value"]);
        expect(result["value"]).toEqual(Gender("male"))
    })
})

describe("QueryEvaluator: ", () => {
    test("Network Query: Return True", async () => {
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();

        const networkQuery = new AST_NetworkQuery(
            SDQL_Name("q1"),
            "boolean",
            EVMChainCode("AVAX"),
            new AST_Contract(
                ChainId(43114),
                EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
                EVMContractFunction("Transfer"),
                EVMContractDirection.From,
                EVMToken("ERC20"),
                new EVMBlockRange(
                    UnixTimestamp(13001519),
                    UnixTimestamp(14910334)
                )
            )
        )
        let chainId = networkQuery.contract.networkId;
        let address = networkQuery.contract.address as EVMAccountAddress;
        let hash = "";
        let startTime = networkQuery.contract.blockrange.start;
        let endTime = networkQuery.contract.blockrange.end;
        console.log("Address: ", address)
        console.log("Start Time: ", startTime)
        console.log("End Time: ", endTime)
        let filter = new EVMTransactionFilter(
            [chainId],
            [address],
            [hash],
            startTime,
            endTime
        );
        td.when(mocks.dataWalletPersistence.getEVMTransactions(filter)).thenReturn(
            okAsync([new EVMTransaction(
                ChainId(43114),
                "",
                UnixTimestamp(13001519),
                null,
                null,
                EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
                null,
                null,
                null,
                null,
                null
            )])
        )
        const result = await repo.eval(networkQuery);
        // console.log("Age is: ", result["value"]);
        console.log(result)
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })

    test("Network Query", async () => {
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();

        const networkQuery = new AST_NetworkQuery(
            SDQL_Name("q1"),
            "boolean",
            EVMChainCode("AVAX"),
            new AST_Contract(
                ChainId(43114),
                EVMAccountAddress("0x9366d30feba284e62900f6295bc28c9906f33172"),
                EVMContractFunction("Transfer"),
                EVMContractDirection.From,
                EVMToken("ERC20"),
                new EVMBlockRange(
                    UnixTimestamp(13001519),
                    UnixTimestamp(14910334)
                )
            )
        )
        let chainId = networkQuery.contract.networkId;
        let address = networkQuery.contract.address as EVMAccountAddress;
        let hash = "";
        let startTime = networkQuery.contract.blockrange.start;
        let endTime = networkQuery.contract.blockrange.end;
        console.log("Address: ", address)
        console.log("Start Time: ", startTime)
        console.log("End Time: ", endTime)
        let filter = new EVMTransactionFilter(
            [chainId],
            [address],
            [hash],
            startTime,
            endTime
        );
        td.when(mocks.dataWalletPersistence.getEVMTransactions(filter)).thenReturn(
            okAsync([])
        )
        const result = await repo.eval(networkQuery);
        // console.log("Age is: ", result["value"]);
        console.log(result)
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
})


describe("Return URLs Map", () => {
    test("EvalPropertyQuery: return URLs count", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "object",
            "url_visited_count",
            [],
            [],
            {}
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log("URLs is: ", result["value"]);
        expect(result["value"]).toEqual(
            new Map<URLString, number>([
                [URLString("www.snickerdoodlelabs.io"), 10]
            ])
        )
    })
})

describe("Return Chain Transaction Count", () => {
    test("EvalPropertyQuery: return chain transaction count", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "object",
            "chain_transaction_count",
            [],
            [],
            {
                "^ETH|AVAX|SOL$": {
                    "type": "integer"
                }
            }
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log("URLs is: ", result["value"]);
        expect(result["value"]).toEqual(            
        new Map<ChainId, number>([
            [ChainId(1), 10]
        ])
        )
    })
})
