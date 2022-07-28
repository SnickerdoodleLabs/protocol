import { AST_Compensation, AST_ConditionExpr, AST_Expr, AST_Query, AST_ReturnExpr, Command, Command_IF, ConditionAnd, ConditionOr } from "@core/interfaces/objects";
import { ParserError, SDQL_Name, SDQL_OperatorName } from "@snickerdoodlelabs/objects";
import { Token, Tokenizer, TokenType } from "./Tokenizer";
// import { AST_Compensation } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/AST_Compensation";
// import { AST_Expr } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/AST_Expr";
// import { AST_Query } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/AST_Query";
// import { AST_ReturnExpr } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/AST_ReturnExpr";
// import { Command } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/Command";
// import { Command_IF } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/Command_IF";
// import { AST_ConditionExpr, ConditionAnd, ConditionOr } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/condition";
// import { ParserError } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/exceptions";
// import { Token, Tokenizer, TokenType } from "@snickerdoodlelabs/objects/src/businessObjects/SDQL/Tokenizer";

export class ExprParser {
    /**
     * Grammar:
     * IF ::= "if" WS Condition "then" WS Expr
     * IF ::= "if" WS Condition "then" WS Expr "else" WS Expr
     */

    precedence: Map<TokenType, Array<TokenType>> = new Map();
    id: number = 0;
    tokenToExpMap: Map<TokenType, Function> = new Map();

    constructor(readonly context: Map<string, any>) {
        this.precedence.set(
            TokenType.parenthesisClose,
            [TokenType.and, TokenType.or, TokenType.if, TokenType.then, TokenType.else] // TODO everything up to a opening parenthesis
        );
        this.precedence.set(
            TokenType.and,
            [TokenType.and, TokenType.or]
        );
        this.precedence.set(
            TokenType.or,
            [TokenType.and, TokenType.or]
        );
        
        this.tokenToExpMap.set(TokenType.and, this.createAnd);
        this.tokenToExpMap.set(TokenType.or, this.createOr);
        this.tokenToExpMap.set(TokenType.if, this.createIf);

    }
    private getNextId(name: string) {
        this.id++;
        const nextId = `${name}${this.id}`
        return nextId;
    }

    parse(exprStr: string): AST_Expr | Command {
        const tokenizer = new Tokenizer(exprStr);
        const tokens = tokenizer.all();
        const ast = this.tokensToAst(tokens);
        return ast;
    }

    tokensToAst(tokens): AST_Expr | Command {
        const postFix: Array<Token> = this.infixToPostFix(tokens);
        const ast = this.buildAstFromPostfix(postFix);
        return ast;
    }
    // #region infix to postfix
    infixToPostFix(infix): Array<Token> {
        
        const stack: Array<Token> = [];
        const postFix: Array<Token> = [];
        for (const token of infix) {
            /**
             * if token is 
             */
            let popped: Array<Token> = [];

            // Conver to a Map later.

            switch (token.type) {
                // when token is a literal or a variable
                case TokenType.number:
                case TokenType.query:
                case TokenType.return:
                case TokenType.compensation:
                    postFix.push(token);
                    break;
                
                case TokenType.if:
                    stack.push(token);
                    break;

                case TokenType.and:
                case TokenType.or:
                    
                    // pop everything that has higher or equal precedence 

                    
                    popped = this.popHigherEqTypes(stack, token);
                    stack.push(token);
                    postFix.push(...popped);
                    break;
                
                case TokenType.parenthesisOpen:
                    stack.push(token);
                    break;
                case TokenType.parenthesisClose:
                    // pop up to the last open
                    // console.log("stack before", stack);
                    popped = this.popHigherEqTypes(stack, token);
                    postFix.push(...popped);
                    // console.log("popped", popped);
                    // assume next pop has a opening one
                    // TODO raise error if 
                    // console.log("stack after", stack);
                    const parenthesisOpen = stack.pop();
                    if (parenthesisOpen?.type != TokenType.parenthesisOpen) {
                        throw new ParserError(token.position, "No matching opening parenthesis for this")
                    }
                    break;

                case TokenType.then:
                case TokenType.else:
                    // pop until if
                    // console.log("stack before", stack);
                    // popped = this.popToType(stack, token, TokenType.if);
                    // console.log("popped", popped);
                    // console.log("stack after", stack);
                    // postFix.push(...popped);
                    // stack.push(token);
                    popped = this.popBefore(stack, token, TokenType.if); // condition output
                    postFix.push(...popped);

                    break;
                
                // case TokenType.else:
                //     console.log("stack before", stack);
                //     popped = this.popToType(stack, token, TokenType.then);
                //     console.log("popped", popped);
                //     console.log("stack after", stack);
                //     postFix.push(...popped);
                //     stack.push(token);
                //     break;


            }
        }

        // pop all and add to the postFix

        postFix.push(...stack.reverse());

        return postFix;
    }

    popHigherEqTypes(stack: Array<Token>, token: Token): Array<Token> {
        /**
         * it pops everything that has higher or equal precedence as the token
         */
        const popped: Array<Token> = new Array<Token>();

        const precedence = this.precedence.get(token.type);
        if (precedence) {
            // console.log("precedence", precedence);
            // let lastStackItem = stack[stack.length - 1];
            while (stack.length > 0 ) {

                // console.log("peeking", stack[stack.length - 1]);
                if (precedence.includes(stack[stack.length - 1].type)) {
                    let lastStackItem = stack.pop();
                    popped.push(lastStackItem as Token);
                } else {
                    break;
                }
            }
        }

        return popped;
    }

    popToType(stack: Array<Token>, token: Token, toType: TokenType): Array<Token> {
        /**
         * it pops everything that has higher or equal precedence as the token
         */
        const popped: Array<Token> = new Array<Token>();
        while (stack.length > 0 ) {

            let lastStackItem = stack.pop() as Token;
            popped.push(lastStackItem as Token);

            if (lastStackItem.type === toType) {
                return popped;
            }

        }

        throw new ParserError(token.position, `Missing matching ${toType} for ${token.type}`);
    }

    popBefore(stack: Array<Token>, token: Token, toType: TokenType): Array<Token> {
        /**
         * it pops everything that has higher or equal precedence as the token
         */
        const popped: Array<Token> = new Array<Token>();
        while (stack.length > 0 ) {

            let lastStackItem = stack.pop() as Token;

            if (lastStackItem.type === toType) {
                stack.push(lastStackItem)
                return popped;
            } else {
                popped.push(lastStackItem as Token);
            }

        }

        throw new ParserError(token.position, `Missing matching ${toType} for ${token.type}`);
    }
    // #endregion

    buildAstFromPostfix(postFix: Array<Token>): AST_Expr | Command {
        // exp1, exp2, op
        // exp1, exp2, if
        // exp1, exp2, exp3 if

        const exprTypes: Array<TokenType> = [TokenType.query, TokenType.return, TokenType.compensation, TokenType.number, TokenType.string]
        // const expList: Array<AST_Expr | AST_Query | AST_Compensation | AST_ReturnExpr> = [];
        let expList: Array<any> = [];

        for (let token of postFix) {

            if (exprTypes.includes(token.type)) {
                const executable = this.getExecutableFromContext(token);
                expList.push(executable);
            } else {
                // we have a operator type
                let newExp: any = this.createExp(expList, token);
                // switch(token.type) {
                //     case TokenType.and:
                //         newExp = this.createAnd(expList[0], expList[1], token);
                //         break;
                //     case TokenType.or:
                //         newExp = this.createOr(expList[0], expList[1], token);
                //         break;
                // }

                if (!newExp) {
                    throw new ParserError(token.position, `Could not convert to ast ${token.val}`)
                } else {
                    expList = [newExp];
                }
            }
        }

        return expList.pop()

        // throw new Error("Not implemented yet"); 
        
    }

    createExp(expList, token: Token): AST_Expr {
        
        const evaluator = this.tokenToExpMap.get(token.type);
        if (evaluator) {
            return evaluator.apply(this, [expList, token])
        } else {
            throw new Error("No constructor defined for " + token.type);
        }
    }

    getExecutableFromContext(token: Token): AST_Expr | AST_Query | AST_Compensation | AST_ReturnExpr {
        
        let nameStr = '';
        switch(token.type) {
            case TokenType.query:
            case TokenType.return:
            case TokenType.compensation:
                nameStr = token.val.substring(1);
                break;
            default:
                throw new ParserError(token.position, `invalid executable type for ${token.val}`)
                
        }

        const executable = this.context.get(nameStr);
        if (!executable) {
            throw new ParserError(token.position, `no executable for token ${token.val} in the context`)
        }

        return executable;
    }

    createAnd(expList: Array<any>, token: Token): AST_ConditionExpr {
        
        const id = this.getNextId(token.val);
        const condition = new ConditionAnd(
                            SDQL_OperatorName(id),
                            expList[0], 
                            expList[1]
        );
        return new AST_ConditionExpr(
            SDQL_Name(id),
            condition
        );

    }

    createOr(expList: Array<any>, token: Token): AST_ConditionExpr {
        
        const id = this.getNextId(token.val);
        const condition = new ConditionOr(
                            SDQL_OperatorName(id),
                            expList[0], 
                            expList[1]
                        );
        return new AST_ConditionExpr(
            SDQL_Name(id),
            condition
        );
    }

    createIf(expList: Array<any>, token: Token): Command_IF {

        let conditionExpr = expList[0];
        const trueExpr = expList[1];
        const falseExpr = (expList.length > 2) ? expList[2] : null;

        if (conditionExpr) {
            if (conditionExpr.constructor != AST_ConditionExpr) {
                conditionExpr = new AST_ConditionExpr(conditionExpr.name, conditionExpr);
            }
        }
        
        const id = this.getNextId(token.val);
        return new Command_IF(
            SDQL_Name(id),
            trueExpr,
            falseExpr,
            conditionExpr
        )
    }
}