import { To } from "history";
import { AST_Expr } from "./AST_Expr";
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
            [TokenType.and, TokenType.or]
        );
        this.precedence.set(
            TokenType.and,
            [TokenType.and, TokenType.or]
        );
        this.precedence.set(
            TokenType.or,
            [TokenType.and, TokenType.or]
        );
    }

    parse(exprStr: string): AST_Expr {
        const tokenizer = new Tokenizer(exprStr);
        const tokens = tokenizer.all();
        const ast = this.tokensToAst(tokens);
        return ast;
    }
    tokensToAst(tokens): AST_Expr {
        const postFix: Array<Token | TokenType> = this.infixToPostFix(tokens);
        throw new Error("Not implemented yet"); 
    }
    infixToPostFix(infix): Array<Token | TokenType> {
        
        const stack: Array<TokenType> = [];
        const postFix: Array<Token | TokenType> = [];
        for (const token of infix) {
            /**
             * if token is 
             */
            switch (token.type) {
                // when token is a literal or a variable
                case TokenType.number:
                case TokenType.query:
                case TokenType.return:
                case TokenType.compensation:
                    postFix.push(token);
                    break;
                
                case TokenType.and:
                    // pop everything that has higher or equal precedence 

                    
                    const precedence = this.precedence.get(token.type);
                    if (precedence) {
                        // let lastStackItem = stack[stack.length - 1];
                        while (stack.length > 0 ) {

                            if (precedence.includes(stack[stack.length - 1])) {
                                let lastStackItem = stack.pop()
                                postFix.push(lastStackItem as TokenType);
                            }
                        }
                    }
                    stack.push(token.type);



            }
        }

        return postFix;
    }
}