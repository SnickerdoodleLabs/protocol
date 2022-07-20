import { ExprParser } from "businessObjects/SDQL/ExprParser";
import { Token, Tokenizer, TokenType } from "businessObjects/SDQL/Tokenizer";

describe("Postfix expressions", () => {

    test("$q1and$q2 -> $q1$q2and", () => {
        
        const tokenizer = new Tokenizer("$q1and$q2");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.query, "$q1", 0),
            new Token(TokenType.and, "and", 3),
            new Token(TokenType.query, "$q2", 6)
        ]

        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 0),
            new Token(TokenType.query, "$q2", 6),
            new Token(TokenType.and, "and", 3)
        ]

        // console.log("tokens", tokens);
        // console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });

    test("$q1and$q2or$q3 -> $q1$q2andq3or", () => {
        
        const tokenizer = new Tokenizer("$q1and$q2or$q3");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.query, "$q1", 0),
            new Token(TokenType.and, "and", 3),
            new Token(TokenType.query, "$q2", 6),
            new Token(TokenType.or, "or", 9),
            new Token(TokenType.query, "$q3", 11),
        ]

        console.log("tokens", tokens);
        
        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 0),
            new Token(TokenType.query, "$q2", 6),
            new Token(TokenType.and, "and", 3),
            new Token(TokenType.query, "$q3", 11),
            new Token(TokenType.or, "or", 9)
        ]

        console.log("expectedPostfixTokens", expectedPostfixTokens);
        console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });

    
    test("($q1and$q2or$q3) -> $q1$q2andq3or", () => {
        
        const tokenizer = new Tokenizer("($q1and$q2or$q3)");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.parenthesisOpen, "(", 0),
            new Token(TokenType.query, "$q1", 1),
            new Token(TokenType.and, "and", 4),
            new Token(TokenType.query, "$q2", 7),
            new Token(TokenType.or, "or", 10),
            new Token(TokenType.query, "$q3", 12),
            new Token(TokenType.parenthesisClose, ")", 15),
        ]

        console.log("tokens", tokens);
        
        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 1),
            new Token(TokenType.query, "$q2", 7),
            new Token(TokenType.and, "and", 4),
            new Token(TokenType.query, "$q3", 12),
            new Token(TokenType.or, "or", 10),
        ]

        console.log("expectedPostfixTokens", expectedPostfixTokens);
        console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });
});