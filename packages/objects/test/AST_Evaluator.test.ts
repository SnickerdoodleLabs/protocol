import { ConditionGE, ConditionIn, ConditionL, ConditionOr } from "businessObjects";
import { AST } from "businessObjects/SDQL/AST";
import { AST_Evaluator } from "businessObjects/SDQL/AST_Evaluator";
import { AST_Expr } from "businessObjects/SDQL/AST_Expr";
import { AST_Factories } from "businessObjects/SDQL/AST_Factories";
import { AST_Return } from "businessObjects/SDQL/AST_Return";
import { AST_ReturnExpr } from "businessObjects/SDQL/AST_ReturnExpr";
import { Command_IF } from "businessObjects/SDQL/Command_IF";
import { AST_ConditionExpr } from "businessObjects/SDQL/condition/AST_ConditionExpr";
import { ConditionAnd } from "businessObjects/SDQL/condition/ConditionAnd";
import { IpfsCID, SDQL_Name, SDQL_OperatorName, SDQL_Return, Version } from "primitives";
import td from "testdouble";

const ast = new AST(
    Version("0.1"), 
    "Interactions with the Avalanche blockchain for 15-year and older individuals",
    "Shrapnel"
    );
const astEvaluator = AST_Factories.makeAST_Evaluator(IpfsCID("000"), ast)

// #region Conditions

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

        // console.log("SDQL_Return type", typeof SDQL_Return(true));

        const result = astEvaluator.evalOperator(and);
        expect(result).toBe(true);
    });


    test("1 is in [2, 1, 3]", () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("number"),
                1
            ),
            [2, 1, 3]
        );
        const result = astEvaluator.evalOperator(condIn);
        expect(result).toBe(true);
    });

    test("1 not in [2, 3]", () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("number"),
                1
            ),
            [2, 3]
        );
        const result = astEvaluator.evalOperator(condIn);
        expect(result).toBe(false);
    });

    test("apple is in ['apple', 'banana', 'orange']", () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("string"),
                'apple'
            ),
            ['apple', 'banana', 'orange']
        );
        const result = astEvaluator.evalOperator(condIn);
        expect(result).toBe(true);
    });

    test("apple not in ['banana', 'orange']", () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("string"),
                'apple'
            ),
            ['banana', 'orange']
        );
        const result = astEvaluator.evalOperator(condIn);
        expect(result).toBe(false);
    });

    
    test("1 < 2", () => {

        const cond = new ConditionL(
            SDQL_OperatorName("In1"),
            1,
            new AST_Expr(
                SDQL_Name("number"),
                2
            )
            
        );
        const result = astEvaluator.evalOperator(cond);
        expect(result).toBe(true);
    });
    
    test("3 >= 2", () => {

        const cond = new ConditionGE(
            SDQL_OperatorName("In1"),
            3,
            new AST_Expr(
                SDQL_Name("number"),
                2
            )
            
        );
        const result = astEvaluator.evalOperator(cond);
        expect(result).toBe(true);
    });
    
    test("2 >= 2", () => {

        const cond = new ConditionGE(
            SDQL_OperatorName("In1"),
            2,
            new AST_Expr(
                SDQL_Name("number"),
                2
            )
            
        );
        const result = astEvaluator.evalOperator(cond);
        expect(result).toBe(true);
    });
    
});

// #endregion

// #region IF Command
describe("IF Command: evalIf()", () => {

    const r1 = new AST_ReturnExpr(
        SDQL_Name("r1"),
        new AST_Return(
            SDQL_Name("callback"),
            "qualified"
        )
    )
    const r2 = new AST_ReturnExpr(
        SDQL_Name("r2"),
        new AST_Return(
            SDQL_Name("callback"),
            "not qualified"
        )
    )

    test("true q1 and true q2, return r1", () =>{

        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            true,
            true
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                and
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r1.source.message)
    });
    test("false q1 and true q2, return r2", () =>{

        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            false,
            true
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                and
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r2.source.message)
    });
    test("true q1 and false q2, return r1", () =>{

        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            true,
            false
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                and
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r2.source.message)
    });
    test("false q1 and false q2, return r1", () =>{

        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            false,
            false
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                and
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r2.source.message)
    });

    test("true q1 or true q2, return r1", () =>{

        const or = new ConditionOr(
            SDQL_OperatorName("Or1"),
            true,
            true
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                or
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r1.source.message)
    });

    test("false q1 or true q2, return r1", () =>{

        const or = new ConditionOr(
            SDQL_OperatorName("Or1"),
            false,
            true
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                or
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r1.source.message)
    });

    test("true q1 or false q2, return r1", () =>{

        const or = new ConditionOr(
            SDQL_OperatorName("Or1"),
            true,
            false
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                or
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r1.source.message)
    });

    test("false q1 or false q2, return r1", () =>{

        const or = new ConditionOr(
            SDQL_OperatorName("Or1"),
            false,
            false
        );

        const commandIf = new Command_IF(
            SDQL_Name("if1"),
            r1,
            r2,
            new AST_ConditionExpr(
                SDQL_Name("cond1"),
                or
            )
            
        )

        const result = astEvaluator.evalIf(commandIf);
        expect(result).toEqual(r2.source.message)
    });

});

// #endregion

