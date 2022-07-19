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
// import { QueryEvaluator } from "businessObjects/SDQL";


const conditionsGE = [
    new ConditionGE(SDQL_OperatorName('ge'), null, 20)
];
const conditionsL = [
    new ConditionL(SDQL_OperatorName('l'), null, 30)
];
const conditionsGEandL = [
    new ConditionGE(SDQL_OperatorName('ge'), null, 20),
    new ConditionL(SDQL_OperatorName('l'), null, 30)
];

const persistenceLayer = new LocalStoragePersistence();

class QueryEvaluatorMocks {

    public dataWalletPersistence = td.object<IDataWalletPersistence>();

    public constructor() {  
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
      return new QueryEvaluator(persistenceLayer);
    }
  }

describe("QueryEvaluator", () => {

    test("EvalPropertyQuery: when age is >= 20, returns true", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE
        )
        console.log("hello");
        console.log(propertyQuery);

        persistenceLayer.setAge(Age(25));
        persistenceLayer.setLocation(CountryCode(57));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)

        const age = persistenceLayer.getAge();
        const location = persistenceLayer.getLocation();
        console.log("Age is: ", age);
        console.log("Location is: ", location);

        const result2 = queryEvaluator.eval(propertyQuery);
        expect(result2).toBeDefined();
        expect(result2).toBe(true);
    })

    test("EvalPropertyQuery: return age", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "age",
            []
        )
        console.log(propertyQuery);
        persistenceLayer.setAge(Age(25));
        persistenceLayer.setLocation(CountryCode(57));
        const queryEvaluator = new QueryEvaluator(persistenceLayer)

        const result = queryEvaluator.eval(propertyQuery);
        console.log(result)
        expect(result).toEqual(SDQL_Return(Age(25)))
    })

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