import { IpfsCID, SDQL_Return } from "@objects/primitives";
import { AST, AST_ConditionExpr, AST_Expr, AST_Query, AST_Return, AST_ReturnExpr, Command_IF, ConditionAnd, ConditionG, ConditionGE, ConditionIn, ConditionL, ConditionOr, EvalNotImplementedError, EvaluationError, Operator, TypeChecker } from "@objects/businessObjects";
import { QueryRepository } from "./QueryRepository";
import { PersistenceError } from "@snickerdoodlelabs/objects";
import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";

// TODO introduce dependency injection


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
        readonly ast: AST | null
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

    public eval(): ResultAsync<SDQL_Return, EvaluationError> {

        return errAsync(new EvaluationError("Not implemented"));
    }

    public evalAny(expr: any): ResultAsync<SDQL_Return, EvaluationError> {
        if (TypeChecker.isValue(expr)) {
            return expr;
        } else {
            return this.evalExpr(expr)
        }
    }

    public evalExpr(expr: AST_Expr | Command_IF | Operator): ResultAsync<SDQL_Return, EvaluationError> {
        /**
         * Based on different types of expressions, 
         * it calls the right function to evaluate one and return the value
         */

        if (TypeChecker.isPrimitiveExpr(expr)) {
            const val = SDQL_Return(((expr as AST_Expr).source) as SDQL_Return);
            return okAsync(val);
        } else {
            
            const evaluator = this.expMap.get(expr.constructor);
            if (evaluator) {
                const val = evaluator.apply(this, [expr]); // Sometimes returns ResultAsync, sometimes SDQL_Return
                return okAsync(val);
            } else {
                return errAsync(new EvalNotImplementedError(typeof expr));
            }
        
        }
        
    }

    public evalIf(eef: Command_IF): ResultAsync<SDQL_Return, EvaluationError> {
        
        // 1. evaluate conditionExpr
        // 2. if true, evaluate TrueExpr
        // 3. if false, evaluate FalseExpr

        // 1. we need the value here.
        const condResult = this.evalConditionExpr(eef.conditionExpr);
        return condResult.andThen((val):ResultAsync<SDQL_Return, EvaluationError> => {
            if (val == true) {
                return this.evalExpr(eef.trueExpr);
            } else {
                if (eef.falseExpr) {
                    return this.evalExpr(eef.falseExpr);
                }
                return errAsync(new EvaluationError(`if ${eef.name} do not have a falseExpr`))
            }
        });

        // condResult.then((x) => {
            
        //     if (x.isErr()) {
        //         throw new EvaluationError(`if ${eef.name} did not resolve to a value`);
        //         // return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));
        //     }
        //     // if (x.isErr()) {
        //     //     return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));
        //     // } else if (x.value) {
        //     //     return this.evalExpr(eef.trueExpr)
        //     // }

        // });

        // condResult.then((res: Result<SDQL_Return, Error>) => {
        //     if (res.isErr()) {
        //         return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));
        //     } else {
        //         return res;
        //     }
        // })

        // if (condResult) {
        //     return this.evalExpr(eef.trueExpr)
        // } else {

        //     if (eef.falseExpr)
        //         return this.evalExpr(eef.falseExpr)
            
        // }

        // return errAsync(new EvaluationError(`if ${eef.name} did not resolve to a value`));

    }

    public evalConditionExpr(expr: AST_ConditionExpr): ResultAsync<SDQL_Return, EvaluationError>{
        let condResult: ResultAsync<SDQL_Return, EvaluationError> | null = null;
        if (TypeChecker.isQuery(expr.source)) {
            // return this.evalQuery(expr.source as AST_Query).andThen(
            //     (val: ResultAsync<SDQL_Return, EvaluationError>) =>
            //     {
            //         return okAsync(val);
            //     }
            // );
            return this.evalQuery(expr.source as AST_Query);

        } else if (TypeChecker.isOperator(expr.source)) {

            return this.evalOperator(expr.source as Operator);
            // condResult = this.evalOperator(expr.source as Operator);
            // return okAsync(condResult);
            /*
            return this.evalOperator(expr.source as Operator).andThen(
                (val: ResultAsync<SDQL_Return, EvaluationError>) =>
                {
                    return okAsync(val);
                }
            );
            */

        } else {
            return errAsync<SDQL_Return, EvaluationError>(new TypeError("Condition has wrong type"));
            // throw new TypeError("If condition has wrong type");
        }

    }

    public evalQuery(q: AST_Query): ResultAsync<SDQL_Return, PersistenceError> {
        
        /**
         * It sends the query to the Query Repository
         */
        return this.queryRepository.get(this.cid, q);
    }

    //#region operator evaluation
    
    public evalOperator(op: Operator): ResultAsync<SDQL_Return, EvaluationError> {
        
        // console.log("Evaluating", op);

        const evaluator = this.operatorMap.get(op.constructor);
        if (evaluator) {
            return await evaluator.apply(this, [op])
        } else {
            throw new Error("No operator evaluator defined for " + op.constructor);
        }
        
    }

    public async evalAnd(cond: ConditionAnd): Promise<ResultAsync<SDQL_Return, EvaluationError>> {

        // console.log(this);
        const left = await this.evalAny(cond.lval);
        if (left.isErr()) {
            return errAsync(new EvaluationError(cond.name));
        }

        // left.andThen((lval): ResultAsync<SDQL_Return, EvaluationError> => {
        //     if (lval == false) {
        //         return okAsync(SDQL_Return(false));
        //     } else {
        //         const right = this.evalAny(cond.rval);
        //         return right.andThen((rval): ResultAsync<SDQL_Return, EvaluationError> => {

        //             if (rval == false) {
        //                 return okAsync(SDQL_Return(false));
        //             } else {
        //                 return okAsync(SDQL_Return(true)); 
        //             }
        //         });
        //     }
        // });
        
        if (left.value == false) {
            return left;
        }
        
        const right = await this.evalAny(cond.rval);
        if (right.isErr()) {
            return errAsync(new EvaluationError(cond.name));
        }

        if (right.value == false) {
            return right;
        }
        
        // console.log('evalAnd', `left is ${left} and right is ${right}`);
        return okAsync(SDQL_Return(left.value && right.value)) ;
    }

    public evalOr(cond: ConditionOr): ResultAsync<SDQL_Return, EvaluationError> {

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

    public evalIn(cond: ConditionIn): ResultAsync<SDQL_Return, EvaluationError> {

        const left = this.evalAny(cond.lval);
        
        const right = this.evalAny(cond.rvals) as Array<any>;

        console.log('left', left);
        console.log('right', right);

        return SDQL_Return(right.includes(left));

        
    }

    public evalGE(cond: ConditionGE): ResultAsync<SDQL_Return, EvaluationError> {
        const left = this.evalAny(cond.lval);
        const right = this.evalAny(cond.rval);
        console.log('left', left);
        console.log('right', right);
        return SDQL_Return(left >= right);
    }

    public evalG(cond: ConditionG): ResultAsync<SDQL_Return, EvaluationError> {
        const left = this.evalAny(cond.lval);
        const right = this.evalAny(cond.rval);
        console.log('left', left);
        console.log('right', right);
        return SDQL_Return(left >= right);
    }

    public evalL(cond: ConditionGE): ResultAsync<SDQL_Return, EvaluationError> {

        const left = this.evalAny(cond.lval);
        
        const right = this.evalAny(cond.rval);

        console.log('left', left);
        console.log('right', right);

        return SDQL_Return(left < right);

        
    }

    //#endregion

    public evalReturnExpr(expr: AST_ReturnExpr): ResultAsync<SDQL_Return, PersistenceError> {

        if (TypeChecker.isQuery(expr.source)) {
            //return this.evalQuery((expr.source) as AST_Query);
            return this.evalQuery(expr.source as AST_Query).andThen(
                (val: ResultAsync<SDQL_Return, EvaluationError>) =>
                {
                    return okAsync(val);
                }
            );
            
        }
        
        return okAsync(this.evalReturn(((expr as AST_ReturnExpr).source) as AST_Return));

    }
    public evalReturn(r: AST_Return): ResultAsync<SDQL_Return, EvaluationError> {
        return SDQL_Return(r.message);
    }

    public evalPrimitiveExpr(expr: AST_Expr): ResultAsync<SDQL_Return, EvaluationError> {

        return ((expr as AST_Expr).source) as SDQL_Return;

    }

}


