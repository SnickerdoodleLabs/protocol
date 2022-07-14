import { IpfsCID, SDQL_Return } from "@objects/primitives";
import { AST } from "./AST";
import { Command_IF } from "./Command_IF";
import { AST_IFExpr } from "./AST_IFExpr";
import { AST_Query } from "./AST_Query";
import { Operator } from "./Operator";
import { TypeChecker } from "./TypeChecker";
import { AST_ConditionExpr } from "./condition/AST_ConditionExpr";
import { QueryRepository } from "./QueryRepository";
import { AST_Expr } from "./AST_Expr";
import { Brand, make } from "ts-brand";
import { AST_Return } from "./AST_Return";
import { AST_ReturnExpr } from "./AST_ReturnExpr";
import { ConditionAnd } from "./condition/ConditionAnd";

// TODO introduce dependency injection

type mappableType =  Brand<AST_Expr | AST_Query | Command_IF, "mappableType">;

export class AST_Evaluator {

    readonly queryRepository: QueryRepository = new QueryRepository();
    // readonly exprMap: Map<AST_Expr.name 
    //                     | typeof AST_Query 
    //                     | typeof Condition
    //                     | typeof Command_IF, 
    //                     Function> = new Map<AST_Expr.name 
    //                                     | typeof AST_Query 
    //                                     | typeof Condition
    //                                     | typeof Command_IF, 
    //                                     Function>();

    readonly operatorMap = new Map<any, Function>();


    constructor(
        readonly cid: IpfsCID,
        readonly ast: AST
    ) {
    //     this.exprMap.set(AST_Query, this.evalQuery);
    //     this.exprMap.set(Command_IF, this.evalIf);
    //     this.exprMap.set(AST_ConditionExpr, this.evalConditionExpr);
    //     this.exprMap.set(Condition, this.evalCondition);
        // console.log(this);
    }

    postConstructor() {
        /**
         * This function must be called after construction. Otherwise the object will not be initialized correctly.
         */
        // console.log(this.evalAnd);
        // console.log(this.evalAny);
        this.operatorMap.set(ConditionAnd, this.evalAnd)
    }

    public eval(): SDQL_Return {

        return SDQL_Return(0);
    }

    public evalAny(expr: any): SDQL_Return {
        if (TypeChecker.isValue(expr)) {
            return expr;
        } else {
            return this.evalExpr(expr)
        }
    }

    public evalExpr(expr: AST_Expr | Command_IF | Operator): SDQL_Return {
        /**
         * Based on different types of expressions, 
         * it calls the right function to evaluate one and return the value
         */

        // TODO replace with a map
        // Clean up parameters
        
        if (TypeChecker.isIfCommand(expr)) {

            return this.evalIf(expr as Command_IF);

        } else if (TypeChecker.isConditionExpr(expr)) {

            return this.evalConditionExpr(expr as AST_ConditionExpr);

        } else if (TypeChecker.isOperator(expr)) {

            return this.evalOperator(expr as Operator);

        } else if (TypeChecker.isReturnExpr(expr)) {

            return this.evalReturn((expr as AST_ReturnExpr).source);

        }

        return SDQL_Return(0);
    }

    public evalIf(eef: Command_IF): SDQL_Return {
        
        // 1. evaluate conditionExpr
        // 2. if true, evaluate TrueExpr
        // 3. if false, evaluate FalseExpr

        // 1. 
        const condResult = this.evalConditionExpr(eef.conditionExpr);

        if (condResult) {
            return this.evalExpr(eef.trueExpr)
        } else {

            return this.evalExpr(eef.falseExpr)
        }

    }

    public evalConditionExpr(expr: AST_ConditionExpr) {
        let condResult: SDQL_Return | null = null;
        if (TypeChecker.isQuery(expr.source)) {

            condResult = this.evalQuery(expr.source as AST_Query);

        } else if (TypeChecker.isOperator(expr.source)) {

            condResult = this.evalOperator(expr.source as Operator);

        } else {

            throw new TypeError("If condition has wrong type");

        }

        return condResult
    }

    public evalQuery(q: AST_Query): SDQL_Return {
        
        /**
         * It sends the query to the Query Repository
         */
        return this.queryRepository.get(this.cid, q);
    }

    //#region operator evaluation
    
    public evalOperator(op: Operator): SDQL_Return {
        
        console.log("Evaluating", op);

        // switch(op.constructor) {
        //     case ConditionAnd:
        //         console.log("it's an and");
        //         // const cond = op as ConditionAnd;
        //         // // return SDQL_Return(true);
        //         // const left = this.evalAny(cond.lval);
                
        //         // if (left == false) {
        //         //     return left;
        //         // }
                
        //         // const right = this.evalAny(cond.rval);

        //         // if (right == false) {
        //         //     return right;
        //         // }
                
        //         // console.log(`left is ${left} and right is ${right}`);
        //         // return left && right;
                


        // }

        const evaluator = this.operatorMap.get(op.constructor);
        if (evaluator) {
            return evaluator.apply(this, [op])
        } else {
            throw new Error("No operator evaluator defined for " + op.constructor);
        }

        return SDQL_Return(false);
        
    }

    public evalAnd(cond: ConditionAnd): SDQL_Return {

        // console.log(this);
        const left = this.evalAny(cond.lval);
        
        if (left == false) {
            return left;
        }
        
        const right = this.evalAny(cond.rval);

        if (right == false) {
            return right;
        }
        
        console.log('evalAnd', `left is ${left} and right is ${right}`);
        return left && right;
    }

    //#endregion

    public evalReturn(r: AST_Return): SDQL_Return {
        return SDQL_Return(r.message);
    }

}


