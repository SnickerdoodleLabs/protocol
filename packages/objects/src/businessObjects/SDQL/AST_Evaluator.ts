import { IpfsCID, SDQL_Return } from "@objects/primitives";
import { AST } from "./AST";
import { Command_IF } from "./Command_IF";
import { AST_Query } from "./AST_Query";
import { Operator } from "./Operator";
import { TypeChecker } from "./TypeChecker";
import { AST_ConditionExpr } from "./condition/AST_ConditionExpr";
import { QueryRepository } from "./QueryRepository";
import { AST_Expr } from "./AST_Expr";
import { Brand, make } from "ts-brand";
import { AST_Return } from "./AST_Return";
import { AST_ReturnExpr } from "./AST_ReturnExpr";
// import { ConditionAnd } from "./condition/ConditionAnd";
import { ConditionAnd, ConditionGE, ConditionIn, ConditionL, ConditionOr } from "./condition";
import { EvalNotImplementedError } from "./exceptions";

// TODO introduce dependency injection

type mappableType =  Brand<AST_Expr | AST_Query | Command_IF, "mappableType">;

export class AST_Evaluator {
    /**
     * @remarks This class should not be instantiated directly. Use the AST_Factories instead.
     */

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
    readonly expMap = new Map<any, Function>();


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
        this.operatorMap.set(ConditionAnd, this.evalAnd)
        this.operatorMap.set(ConditionOr, this.evalOr)
        this.operatorMap.set(ConditionIn, this.evalIn)
        this.operatorMap.set(ConditionGE, this.evalGE)
        this.operatorMap.set(ConditionL, this.evalL)

        this.expMap.set(Command_IF, this.evalIf);
        this.expMap.set(AST_ConditionExpr, this.evalConditionExpr);
        this.expMap.set(AST_ReturnExpr, this.evalReturnExpr); 
        this.expMap.set(Operator, this.evalOperator);
        // this.expMap.set(isPrimitiveExpr, this.evalPrimitiveExpr);
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

        if (TypeChecker.isPrimitiveExpr(expr)) {
            return ((expr as AST_Expr).source) as SDQL_Return;
        } else {
            
            const evaluator = this.expMap.get(expr.constructor);
            if (evaluator) {
                return evaluator.apply(this, [expr])
            } else {
                throw new EvalNotImplementedError(typeof expr);
            }
        
        }
        
        // if (TypeChecker.isIfCommand(expr)) {

        //     return this.evalIf(expr as Command_IF);

        // } else if (TypeChecker.isConditionExpr(expr)) {

        //     return this.evalConditionExpr(expr as AST_ConditionExpr);

        // } else if (TypeChecker.isOperator(expr)) {

        //     return this.evalOperator(expr as Operator);

        // } else if (TypeChecker.isReturnExpr(expr)) {

        //     return this.evalReturn((expr as AST_ReturnExpr).source);

        // } else if (TypeChecker.isPrimitiveExpr(expr)) {
        //     return ((expr as AST_Expr).source) as SDQL_Return;
        // }

        // throw new EvalNotImplementedError(typeof expr);
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
        
        // console.log("Evaluating", op);

        const evaluator = this.operatorMap.get(op.constructor);
        if (evaluator) {
            return evaluator.apply(this, [op])
        } else {
            throw new Error("No operator evaluator defined for " + op.constructor);
        }
        
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
        
        // console.log('evalAnd', `left is ${left} and right is ${right}`);
        return left && right;
    }

    public evalOr(cond: ConditionOr): SDQL_Return {

        const left = this.evalAny(cond.lval);
        
        if (left == true) {
            return left;
        }
        
        const right = this.evalAny(cond.rval);

        if (right == true) {
            return right;
        }
        
        // console.log('evalAnd', `left is ${left} and right is ${right}`);
        return SDQL_Return(false);
        
    }

    public evalIn(cond: ConditionIn): SDQL_Return {

        const left = this.evalAny(cond.lval);
        
        const right = this.evalAny(cond.rvals) as Array<any>;

        console.log('left', left);
        console.log('right', right);

        return SDQL_Return(right.includes(left));

        
    }

    public evalGE(cond: ConditionGE): SDQL_Return {

        const left = this.evalAny(cond.lval);
        
        const right = this.evalAny(cond.rval);

        console.log('left', left);
        console.log('right', right);

        return SDQL_Return(left >= right);

        
    }

    public evalL(cond: ConditionGE): SDQL_Return {

        const left = this.evalAny(cond.lval);
        
        const right = this.evalAny(cond.rval);

        console.log('left', left);
        console.log('right', right);

        return SDQL_Return(left < right);

        
    }

    //#endregion

    public evalReturnExpr(expr: AST_ReturnExpr): SDQL_Return {

        return this.evalReturn((expr as AST_ReturnExpr).source);

    }
    public evalReturn(r: AST_Return): SDQL_Return {
        return SDQL_Return(r.message);
    }

    public evalPrimitiveExpr(expr: AST_Expr): SDQL_Return {

        return ((expr as AST_Expr).source) as SDQL_Return;

    }

}


