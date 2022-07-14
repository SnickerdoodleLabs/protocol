import { AST } from "businessObjects/SDQL/AST";
import { AST_Evaluator } from "businessObjects/SDQL/AST_Evaluator";
import { Command_IF } from "businessObjects/SDQL/Command_IF";
import { ConditionAnd } from "businessObjects/SDQL/condition/ConditionAnd";
import { IpfsCID, SDQL_Name, SDQL_OperatorName, Version } from "primitives";

const ast = new AST(
    Version("0.1"), 
    "Interactions with the Avalanche blockchain for 15-year and older individuals",
    "Shrapnel"
    );
const astEvaluator = new AST_Evaluator(IpfsCID("cid-0"), ast);

// describe("Command if", () => {

//     // test("if true, return 1", () => {
//     //     const command = new Command_IF(
//     //         SDQL_Name("q1"),

//     //     )
//     // });

// })

describe("Conditions", () => {

    test("true and true is true", () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            true,
            true
        );

        const result = astEvaluator.evalOperator(and);
        expect(result).toBe(true);
    })
});