import { AST_BoolExpr, ConditionAnd, ConditionOr, SDQLParser, SDQLSchema } from "businessObjects";
import { ExprParser } from "businessObjects/SDQL/ExprParser";
import { Token, Tokenizer, TokenType } from "businessObjects/SDQL/Tokenizer";
import { IpfsCID } from "primitives";
import { avalanceSchemaStr } from "./avalanche.data";

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
    test("($q1and($q2or$q3)) -> $q1,$q2,q3,or,and", () => {
        
        const tokenizer = new Tokenizer("($q1and($q2or$q3))");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.parenthesisOpen, "(", 0),
            new Token(TokenType.query, "$q1", 1),
            new Token(TokenType.and, "and", 4),
            new Token(TokenType.parenthesisOpen, "(", 7),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.or, "or", 11),
            new Token(TokenType.query, "$q3", 13),
            new Token(TokenType.parenthesisClose, ")", 16),
            new Token(TokenType.parenthesisClose, ")", 17)
        ]

        console.log("tokens", tokens);
        
        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 1),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.query, "$q3", 13),
            new Token(TokenType.or, "or", 11),
            new Token(TokenType.and, "and", 4),
        ]

        console.log("expectedPostfixTokens", expectedPostfixTokens);
        console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });

    test.skip("if$q1and$q2then$r1 -> $q1, $q2, and, if, r1, then", () => {
        // obsoleted
        
        const tokenizer = new Tokenizer("if$q1and$q2then$r1");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.if, "if", 0),
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.then, "then", 11),
            new Token(TokenType.return, "$r1", 15)
        ]

        console.log("tokens", tokens);
        
        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.if, "if", 0),
            new Token(TokenType.return, "$r1", 15),
            new Token(TokenType.then, "then", 11),
        ]

        console.log("expectedPostfixTokens", expectedPostfixTokens);
        console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });

    test("if$q1and$q2then$r1 -> $q1, $q2, and, r1, if", () => {
        
        const tokenizer = new Tokenizer("if$q1and$q2then$r1");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.if, "if", 0),
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.then, "then", 11),
            new Token(TokenType.return, "$r1", 15)
        ]

        console.log("tokens", tokens);
        
        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.return, "$r1", 15),
            new Token(TokenType.if, "if", 0),
        ]

        console.log("expectedPostfixTokens", expectedPostfixTokens);
        console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });


    test.skip("if$q1and$q2then$r1else$r2 -> $q1, $q2, and, if, $r1, then, $r2, else", () => {
        
        const tokenizer = new Tokenizer("if$q1and$q2then$r1else$r2");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.if, "if", 0),
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.then, "then", 11),
            new Token(TokenType.return, "$r1", 15),
            new Token(TokenType.else, "else", 18),
            new Token(TokenType.return, "$r2", 22),
        ]

        console.log("tokens", tokens);
        
        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.if, "if", 0),
            new Token(TokenType.return, "$r1", 15),
            new Token(TokenType.then, "then", 11),
            new Token(TokenType.return, "$r2", 22),
            new Token(TokenType.else, "else", 18),
        ]

        console.log("expectedPostfixTokens", expectedPostfixTokens);
        console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });


    test("if$q1and$q2then$r1else$r2 -> $q1, $q2, and, $r1, $r2, if", () => {
        
        const tokenizer = new Tokenizer("if$q1and$q2then$r1else$r2");
        const tokens = tokenizer.all();
        const expectedTokens = [
            new Token(TokenType.if, "if", 0),
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.then, "then", 11),
            new Token(TokenType.return, "$r1", 15),
            new Token(TokenType.else, "else", 18),
            new Token(TokenType.return, "$r2", 22),
        ]

        console.log("tokens", tokens);
        
        expect(tokens).toEqual(expectedTokens);

        const context: Map<string, any> = new Map();

        const exprParser = new ExprParser(context)

        const postfixTokens = exprParser.infixToPostFix(tokens);
        const expectedPostfixTokens = [
            new Token(TokenType.query, "$q1", 2),
            new Token(TokenType.query, "$q2", 8),
            new Token(TokenType.and, "and", 5),
            new Token(TokenType.return, "$r1", 15),
            new Token(TokenType.return, "$r2", 22),
            new Token(TokenType.if, "if", 0),
        ]

        console.log("expectedPostfixTokens", expectedPostfixTokens);
        console.log("postfixTokens", postfixTokens);

        expect(postfixTokens).toEqual(expectedPostfixTokens);

    });

});

describe("Postfix to AST", () => {
    
    const schema = SDQLSchema.fromString(avalanceSchemaStr);
    const parser = new SDQLParser(IpfsCID("0"), schema);
    parser.parse();
    const context = parser.context;
    
    test.only("$q1$q2andq3or to ast", () => {
        const postFix = [
            new Token(TokenType.query, "$q1", 0),
            new Token(TokenType.query, "$q2", 6),
            new Token(TokenType.and, "and", 3),
            new Token(TokenType.query, "$q3", 11),
            new Token(TokenType.or, "or", 9)
        ];

        console.log(context.keys());
        const exprParser = new ExprParser(context);

        const expr = exprParser.buildAstFromPostfix(postFix);
        console.log(expr);

        expect(expr.constructor).toBe(AST_BoolExpr);
        expect(expr.source.constructor).toBe(ConditionOr);
        const or = expr.source as ConditionOr;
        expect(or.lval.constructor).toBe(AST_BoolExpr);
        expect((or.lval as AST_BoolExpr).source.constructor).toBe(ConditionAnd);
        const and = (or.lval as AST_BoolExpr).source as ConditionAnd;

        expect(and.lval).toEqual(context.get('q1'));
        expect(and.rval).toEqual(context.get('q2'));
        expect(or.rval).toEqual(context.get('q3'));

    });

});