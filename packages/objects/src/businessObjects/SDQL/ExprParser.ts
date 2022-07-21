import { To } from "history";
import { AST_Expr } from "./AST_Expr";
import { ParserError } from "./exceptions";
import { Token, Tokenizer, TokenType } from "./Tokenizer";

export class ExprParser {
    /**
     * Grammar:
     * IF ::= "if" WS Condition "then" WS Expr
     * IF ::= "if" WS Condition "then" WS Expr "else" WS Expr
     */

    precedence: Map<TokenType, Array<TokenType>> = new Map();

    constructor(readonly context: Map<string, any>) {
        this.precedence.set(
            TokenType.parenthesisClose,
            [TokenType.and, TokenType.or, TokenType.if, TokenType.then, TokenType.else]
        );
        this.precedence.set(
            TokenType.and,
            [TokenType.and, TokenType.or]
        );
        this.precedence.set(
            TokenType.or,
            [TokenType.and, TokenType.or]
        );
        // this.precedence.set(
        //     TokenType.then,
        //     [TokenType.if, TokenType.or]
        // );
    }

    parse(exprStr: string): AST_Expr {
        const tokenizer = new Tokenizer(exprStr);
        const tokens = tokenizer.all();
        const ast = this.tokensToAst(tokens);
        return ast;
    }
    tokensToAst(tokens): AST_Expr {
        const postFix: Array<Token> = this.infixToPostFix(tokens);
        const ast = this.buildAstFromPostfix(postFix);
        return ast;
    }
    // 
    infixToPostFix(infix): Array<Token> {
        
        const stack: Array<Token> = [];
        const postFix: Array<Token | TokenType> = [];
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
                    // pop until if
                    console.log("stack before", stack);
                    popped = this.popToType(stack, token, TokenType.if);
                    console.log("popped", popped);
                    console.log("stack after", stack);
                    postFix.push(...popped);
                    stack.push(token);
                    break;
                
                case TokenType.else:
                    console.log("stack before", stack);
                    popped = this.popToType(stack, token, TokenType.then);
                    console.log("popped", popped);
                    console.log("stack after", stack);
                    postFix.push(...popped);
                    stack.push(token);
                    break;


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

        throw new ParserError(token.position, `Missing matching ${toType}`);
    }
    buildAstFromPostfix(postFix: Array<Token>): AST_Expr {
        // exp1, exp2, op
        // cond, if
        // exp1, then
        // else
        throw new Error("Not implemented yet"); 
        
    }
}