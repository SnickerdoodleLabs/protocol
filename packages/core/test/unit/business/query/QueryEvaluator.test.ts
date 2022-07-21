import "reflect-metadata";
import { AST_PropertyQuery, AST_BoolExpr, Condition, ConditionGE, ConditionIn, ConditionL, SDQL_OperatorName, SDQL_Name, ConditionAnd} from "@snickerdoodlelabs/objects";
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

const conditionsG = [
    new ConditionG(SDQL_OperatorName('g'), null, 25)
];
const conditionsE = [
    new ConditionE(SDQL_OperatorName('e'), null, 25)
];


const conditionsL = [
    new ConditionL(SDQL_OperatorName('l'), null, 30)
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

describe("QueryEvaluator checking age boolean", () => {
    test("EvalPropertyQuery: when age is >= 20, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log("Result: ", result);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    
    test("EvalPropertyQuery: when age is >= 25, returns true", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE2
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log("Result: ", result);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(true);
    })
    test("EvalPropertyQuery: when age 30 >= 25, returns false", async () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE3
        )
        const mocks = new QueryEvaluatorMocks();
        const repo = mocks.factory();
        const result = await repo.eval(propertyQuery);
        console.log("Result: ", result);
        expect(result).toBeDefined();
        expect(result["value"]).toBe(false);
    })
})
    /*
    test("EvalPropertyQuery: when age is > 24, returns false", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsG
        )
        console.log(propertyQuery);
        persistenceLayer.setAge(Age(24));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)
        const result = queryEvaluator.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result).toBe(false);
    })
    test("EvalPropertyQuery: when age is > 25, returns false", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsG
        )
        console.log(propertyQuery);
        persistenceLayer.setAge(Age(25));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)
        const result = queryEvaluator.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result).toBe(false);
    })
    test("EvalPropertyQuery: when age is > 26, returns true", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsG
        )
        console.log(propertyQuery);
        persistenceLayer.setAge(Age(25));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)
        const result = queryEvaluator.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result).toBe(true);
    })
    test("EvalPropertyQuery: when age is = 25, returns true", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsE
        )
        console.log(propertyQuery);
        persistenceLayer.setAge(Age(25));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)
        const result = queryEvaluator.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result).toBe(true);
    })
    test("EvalPropertyQuery: when age is = 26, returns false", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsE
        )
        console.log(propertyQuery);
        persistenceLayer.setAge(Age(26));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)
        const result = queryEvaluator.eval(propertyQuery);
        expect(result).toBeDefined();
        expect(result).toBe(false);
    })
    
})


describe("QueryEvaluator return integer values", () => {
    test("EvalPropertyQuery: return age", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "age",
            []
        )
        console.log(propertyQuery);
        persistenceLayer.setAge(Age(25));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)
        console.log("queryEvaluator is: ", queryEvaluator)
        const result = queryEvaluator.eval(propertyQuery);
        console.log("Result is: ", result)
        expect(result).toEqual(Age(25))
    })
    test("EvalPropertyQuery: return location", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "location",
            []
        )
        console.log(propertyQuery);
        persistenceLayer.setLocation(CountryCode(57));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)
        const result = queryEvaluator.eval(propertyQuery);
        console.log(result)
        expect(result).toEqual(SDQL_Return(CountryCode(57)))
    })
})


describe("QueryEvaluator checking location condition in", () => {
    test("EvalPropertyQuery: when location is in ConditionIn, return true", () => {
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
        //console.log(propertyQuery);
        //  DO the mocks to get age
        // DO the rest
        const mocks = new QueryEvaluatorMocks();
        const service = mocks.factory();
        const result = service.eval(propertyQuery);
        expect(result).toBe(true);
    })
    test("EvalPropertyQuery: when location is NOT in ConditionIn, return false", () => {
        const conditionsIn = new ConditionIn(
            SDQL_OperatorName('in'), 
            57, 
            [62, 85, 45])
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "location",
            [conditionsIn]
        )
        //console.log(propertyQuery);
        //  DO the mocks to get age
        // DO the rest
        const mocks = new QueryEvaluatorMocks();
        const service = mocks.factory();
        const result = service.eval(propertyQuery);
        expect(result).toBe(false);
    })

})
*/