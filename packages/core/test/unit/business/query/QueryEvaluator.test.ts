// 1. make a sample AST_PropertyQuery

// import { QueryEvaluator } from "businessObjects/SDQL/QueryEvaluator";

import { AST_PropertyQuery, AST_BoolExpr, Condition, ConditionGE, ConditionIn, ConditionL, SDQL_OperatorName, SDQL_Name, ConditionAnd} from "@snickerdoodlelabs/objects";
import { QueryEvaluator } from "@core/implementations/business/utilities/query/QueryEvaluator";

// import { QueryEvaluator } from "businessObjects/SDQL";

const queryEvaluator = new QueryEvaluator()

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




class QueryEvaluatorMocks {
  
    public constructor() {  
    }
  
    public factory() {
      return new QueryEvaluator();
    }
  }

describe("QueryEvaluator", () => {

    test("AST_PropertyQuery: when age is >= 20, returns true", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "boolean",
            "age",
            conditionsGE
        )
        console.log("hello");
        console.log(propertyQuery);

        //expect(result.isErr()).toBeFalsy();
        /*
            mocks.contextProvider.assertEventCounts({ onQueryPosted: 1 });
        */
        const age = 25;
        // DO the rest

        const mocks = new QueryEvaluatorMocks();
        const service = mocks.factory();
        const result = service.eval(propertyQuery);

        console.log(result)

        expect(result).toBeDefined();
        
    })

    test("AST_PropertyQuery: when age is < 30, returns true", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "age",
            conditionsL
        )
        console.log("hello");
        console.log(propertyQuery);
        //  DO the mocks to get age
        const age = 25;
        // DO the rest
    })

    test("AST_PropertyQuery: when 20 <= age < 30, returns true", () => {

        const conditionsGE = new ConditionGE(SDQL_OperatorName('ge'), null, 20)
        const conditionsL = new ConditionL(SDQL_OperatorName('l'), null, 30)


        const conditionsGEandL = [
            new ConditionAnd(
                SDQL_OperatorName('and'), 
                conditionsL.rval as AST_BoolExpr, 
                conditionsGE.rval as AST_BoolExpr)
                ,
        ]

        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "age",
            conditionsGEandL
        )
        console.log("hello");
        console.log(propertyQuery);
        //  DO the mocks to get age
        const age = 25;
        // DO the rest
    })





})