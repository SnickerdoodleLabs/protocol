import "reflect-metadata";
import { AST_PropertyQuery, AST_BoolExpr, Condition, ConditionGE, ConditionIn, ConditionL, SDQL_OperatorName, SDQL_Name, ConditionAnd, ConditionLE} from "@snickerdoodlelabs/objects";
import { QueryEvaluator } from "@core/implementations/business/utilities/query/QueryEvaluator";
import { LocalStoragePersistence } from "@persistence/LocalStoragePersistence";
import { IDataWalletPersistence } from "@snickerdoodlelabs/objects";
import td from "testdouble";
import { Age } from "@snickerdoodlelabs/objects";
import { CountryCode } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import { SDQL_Return } from "@snickerdoodlelabs/objects";
import { ConditionG } from "@snickerdoodlelabs/objects";
import { ConditionE } from "@snickerdoodlelabs/objects";
// import { QueryEvaluator } from "businessObjects/SDQL";


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

    public constructor() {  
        this.dataWalletPersistence.setAge(Age(25));
        this.dataWalletPersistence.setLocation(CountryCode(57));
        td.when(this.dataWalletPersistence.getAge())
        .thenReturn(
            okAsync(Age(25)),
        );
        td.when(this.dataWalletPersistence.getLocation())
        .thenReturn(
            okAsync(CountryCode(57)),
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
            conditionsGE
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
            conditionsGE2
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
            conditionsGE3
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
            conditionsLE
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
            conditionsLE2
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
            conditionsLE3
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
            conditionsG
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
            conditionsG2
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
            conditionsG3
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
            conditionsL
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log(result["value"]);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
    
    test("EvalPropertyQuery: when age is 25 < 25, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsL2
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
            conditionsL3
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log(result["value"]);

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
            conditionsE
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
            conditionsE2
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
})

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
            [conditionsIn]
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
            [conditionsIn2]
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
describe("QueryEvaluator return integer values", () => {
    test("EvalPropertyQuery: return age", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "age",
            []
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log("Age is: ", result["value"]);
        expect(result["value"]).toEqual(Age(25))
    })
    test("EvalPropertyQuery: return location", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "location",
            []
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log("Location is: ", result["value"]);
        expect(result["value"]).toEqual(CountryCode(57))
    })
})
