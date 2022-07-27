

import "reflect-metadata";

import { QueryRepository } from "@core/implementations/business/utilities";
import { QueryFactories } from "@core/implementations/utilities/factory";
import { AST_ConditionExpr, AST_Expr, AST_Return, AST_ReturnExpr, Command_IF, ConditionAnd, ConditionGE, ConditionIn, ConditionL, ConditionOr } from "@objects/businessObjects";
import { IpfsCID, SDQL_Name, SDQL_OperatorName, SDQL_Return } from "@objects/primitives";


// const ast = new AST(
//     Version("0.1"), 
//     "Interactions with the Avalanche blockchain for 15-year and older individuals",
//     "Shrapnel"
//     );
const queryRepository = new QueryRepository();
// const astEvaluator = AST_Factories.makeAST_Evaluator(IpfsCID("000"), null, queryRepository);
const queryFactories = new QueryFactories();
const astEvaluator = queryFactories.makeAstEvaluator(IpfsCID("000"), null, queryRepository);

// #region Conditions

describe("Conditions", () => {

    test("boolean true and true is true", async () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            true,
            true
        );

        const result = await astEvaluator.evalOperator(and);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(true);
        }
    })

    test("boolean true and false is false", async () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            true,
            false
        );

        const result = await astEvaluator.evalOperator(and);

        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(false);
        }
    })

    test("boolean false and true is false", async () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            false,
            true
        );

        const result = await astEvaluator.evalOperator(and);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(false);
        }
    })

    test("SDQL_Return true and true is true", async () => {
        const and = new ConditionAnd(
            SDQL_OperatorName("And1"),
            SDQL_Return(true),
            SDQL_Return(true)
        );

        // console.log("SDQL_Return type", typeof SDQL_Return(true));

        const result = await astEvaluator.evalOperator(and);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(true);
        }
    });


    test("1 is in [2, 1, 3]", async () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("number"),
                1
            ),
            [2, 1, 3]
        );
        const result = await astEvaluator.evalOperator(condIn);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(true);
        }
    });

    test("1 not in [2, 3]", async () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("number"),
                1
            ),
            [2, 3]
        );
        const result = await astEvaluator.evalOperator(condIn);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(false);
        }
    });

    test("apple is in ['apple', 'banana', 'orange']", async () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("string"),
                'apple'
            ),
            ['apple', 'banana', 'orange']
        );
        const result = await astEvaluator.evalOperator(condIn);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(true);
        }
    });

    test("apple not in ['banana', 'orange']", async () => {

        const condIn = new ConditionIn(
            SDQL_OperatorName("In1"),
            new AST_Expr(
                SDQL_Name("string"),
                'apple'
            ),
            ['banana', 'orange']
        );
        const result = await astEvaluator.evalOperator(condIn);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(false);
        }
    });

    
    test("1 < 2", async () => {

        const cond = new ConditionL(
            SDQL_OperatorName("In1"),
            1,
            new AST_Expr(
                SDQL_Name("number"),
                2
            )
            
        );
        const result = await astEvaluator.evalOperator(cond);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(true);
        }
    });
    
    test("3 >= 2", async () => {

        const cond = new ConditionGE(
            SDQL_OperatorName("In1"),
            3,
            new AST_Expr(
                SDQL_Name("number"),
                2
            )
            
        );
        const result = await astEvaluator.evalOperator(cond);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toBe(true);
        }
    });
    
    test("2 >= 2", async () => {

        const cond = new ConditionGE(
            SDQL_OperatorName("In1"),
            2,
            new AST_Expr(
                SDQL_Name("number"),
                2
            )
            
        );
        const result = await astEvaluator.evalOperator(cond);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            // console.log(result);
            // console.log(result.value);
            expect(result.value).toBe(true);
        }
    });
    
});

// #endregion

// #region IF Command
describe("IF Command: evalIf()",() => {

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

    test("true q1 and true q2, return r1",  async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r1.source) as AST_Return).message);
        }
    });
    test("false q1 and true q2, return r2", async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r2.source) as AST_Return).message);
        }

    });
    test("true q1 and false q2, return r2", async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r2.source) as AST_Return).message);
        }
    });
    test("false q1 and false q2, return r2", async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r2.source) as AST_Return).message);
        }
    });

    test("true q1 or true q2, return r1", async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r1.source) as AST_Return).message);
        }
    });

    test("false q1 or true q2, return r1", async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r1.source) as AST_Return).message);
        }
    });

    test("true q1 or false q2, return r1", async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r1.source) as AST_Return).message);
        }

    });

    test("false q1 or false q2, return r2", async () =>{

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

        const result = await astEvaluator.evalIf(commandIf);
        expect(result.isOk()).toBe(true);
        if (result.isOk()) {
            expect(result.value).toEqual(((r2.source) as AST_Return).message);
        }
    });

});

// #endregion

