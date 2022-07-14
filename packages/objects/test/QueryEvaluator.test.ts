// 1. make a sample AST_PropertyQuery

import { AST_PropertyQuery } from "businessObjects/SDQL/AST_PropertyQuery"
import { ConditionAnd } from "businessObjects/SDQL/condition/ConditionAnd"
import { ConditionGE } from "businessObjects/SDQL/condition/ConditionGE"
import { QueryEvaluator } from "businessObjects/SDQL/QueryEvaluator"
import { SDQL_Name, SDQL_OperatorName, SDQL_Return } from "primitives"

// import { QueryEvaluator } from "businessObjects/SDQL";

const queryEvaluator = new QueryEvaluator()

const conditions = [
    new ConditionGE( SDQL_OperatorName('ge'), 20)
]

describe("QueryEvaluator", () => {

    test("AST_PropertyQuery: when age is >= 20, returns true", () => {
        const propertyQuery = new AST_PropertyQuery(
            SDQL_Name("q1"),
            "integer",
            "age",
            conditions
        )

        console.log("hello");
        console.log(propertyQuery);

        //  DO the mocks to get age

        const age = 25;
        // DO the rest
    })

})