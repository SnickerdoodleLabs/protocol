import { AST } from "businessObjects/SDQL/AST";
import { AST_Evaluator } from "businessObjects/SDQL/AST_Evaluator";
import { AST_Factories } from "businessObjects/SDQL/AST_Factories";
import { Command_IF } from "businessObjects/SDQL/Command_IF";
import { ConditionAnd } from "businessObjects/SDQL/condition/ConditionAnd";
import { IpfsCID, SDQL_Name, SDQL_OperatorName, SDQL_Return, Version } from "primitives";
import td from "testdouble";

const ast = new AST(
    Version("0.1"), 
    "Interactions with the Avalanche blockchain for 15-year and older individuals",
    "Shrapnel"
    );
const astEvaluator = AST_Factories.makeAST_Evaluator(IpfsCID("000"), ast)

// describe("Command if", () => {

//     // test("if true, return 1", () => {
//     //     const command = new Command_IF(
//     //         SDQL_Name("q1"),

//     //     )
//     // });

// })

describe("Conditions", () => {

    test("boolean true and true is true", () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            true,
            true
        );

        const result = astEvaluator.evalOperator(and);
        expect(result).toBe(true);
    })

    test("boolean true and false is false", () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            true,
            false
        );

        const result = astEvaluator.evalOperator(and);
        expect(result).toBe(false);
    })

    test("boolean false and true is false", () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            false,
            true
        );

        const result = astEvaluator.evalOperator(and);
        expect(result).toBe(false);
    })

    test("SDQL_Return true and true is true", () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            SDQL_Return(true),
            SDQL_Return(true)
        );

        console.log("SDQL_Return type", typeof SDQL_Return(true));

        const result = astEvaluator.evalOperator(and);
        expect(result).toBe(true);
    })
    
});

// describe("IF Command", () => {

//     test("true q1 and true q2, return r1") {

//     }

// });

