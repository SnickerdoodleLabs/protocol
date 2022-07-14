// 1. make a sample AST_PropertyQuery

import { AST_PropertyQuery } from "businessObjects/SDQL/AST_PropertyQuery"
import { QueryEvaluator } from "businessObjects/SDQL/QueryEvaluator"
import { SDQL_Name, SDQL_Return } from "primitives"

// import { QueryEvaluator } from "businessObjects/SDQL";

const queryEvaluator = new QueryEvaluator()
const propertyQuery = new AST_PropertyQuery(
    SDQL_Name("q1"),
    "integer",
    []
)

describe("QueryEvaluator", () => {

    test("first", () => {
        console.log("hello");
        console.log(propertyQuery);
    })

})