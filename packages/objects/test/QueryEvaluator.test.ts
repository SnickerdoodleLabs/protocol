// 1. make a sample AST_PropertyQuery

import { AST_PropertyQuery } from "businessObjects/SDQL/AST_PropertyQuery"
import { AST_Query } from "@browser-extension/businessObjects/SDQL/AST_Query";
import { QueryEvaluator } from "businessObjects/SDQL/QueryEvaluator"
import { SDQL_Name, SDQL_OperatorName, SDQL_Return } from "primitives"
import td from "testdouble";
import { ConditionAnd } from "businessObjects/SDQL/condition/ConditionAnd"
import { ConditionGE } from "businessObjects/SDQL/condition/ConditionGE"
import { ConditionL } from "businessObjects/SDQL/condition/ConditionL"

// import { QueryEvaluator } from "businessObjects/SDQL";

const queryEvaluator = new QueryEvaluator()

const conditionsGE = [
    new ConditionGE(SDQL_OperatorName('ge'), 20)
];
const conditionsL = [
    new ConditionL(SDQL_OperatorName('l'), 30)
];
const conditionsGEandL = [
    new ConditionGE(SDQL_OperatorName('ge'), 20),
    new ConditionL(SDQL_OperatorName('l'), 30),
    new ConditionAnd(SDQL_OperatorName('and'), 
    new ConditionGE(SDQL_OperatorName('ge'), 20), 
    new ConditionL(SDQL_OperatorName('l'), 30))
];

const conditionsGEandL = [
    new ConditionGE(SDQL_OperatorName('ge'), 20),
    new ConditionAnd(SDQL_OperatorName('and'), 1),
    new ConditionL(SDQL_OperatorName('l'), 30)
]


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

        const mocks = new QueryEvaluatorMocks();
        const service = mocks.factory();
        const result = service.eval(propertyQuery);

        console.log(result)

        expect(result).toBeDefined();
        //expect(result.isErr()).toBeFalsy();



        //  DO the mocks to get age
        /*
            // Act
            // Assert
            // run the test - did it pass?
            mocks.contextProvider.assertEventCounts({ onQueryPosted: 1 });
        */


        const age = 25;
        // DO the rest
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