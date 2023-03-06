import "reflect-metadata";

import { IpfsCID, SDQL_Name } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import {
  ExprParser,
  QueryObjectFactory,
  SDQLParser,
  Token,
  Tokenizer,
  TokenType,
} from "@query-parser/implementations";
import {
  AST_ConditionExpr,
  AST_NetworkQuery,
  AST_PropertyQuery,
  AST_Query,
  AST_Return,
  AST_ReturnExpr,
  Command_IF,
  ConditionAnd,
  ConditionG,
  ConditionL,
  ConditionLE,
  ConditionOr,
  ParserContextDataTypes,
} from "@query-parser/interfaces";
import { avalanche1SchemaStr } from "@query-parser/sampleData/avalanche1.data";
import { SDQLQueryWrapperMocks } from "@query-parser-test/mocks";

class ExprParserMocks {
  public wrapperMocks = new SDQLQueryWrapperMocks();
  public schema = this.wrapperMocks.makeQueryWrapper(avalanche1SchemaStr);
  readonly parser = new SDQLParser(
    IpfsCID("0"),
    this.schema,
    new QueryObjectFactory(),
  );

  public context: Map<string, ParserContextDataTypes> | null = null;

  public createContext(): ResultAsync<void, Error> {
    return this.parser.buildAST().andThen((ast) => {
      this.context = this.parser.context;
      return okAsync(undefined);
    });
  }

  public createExprParser(): ResultAsync<ExprParser, Error> {
    return this.createContext().andThen(() => {
      return okAsync(new ExprParser(this.context!));
    });
  }
}

describe("Expressions to Postfix", () => {
  test("$r1 -> $r1", () => {
    const tokenizer = new Tokenizer("$r1");
    const tokens = tokenizer.all();
    const expectedTokens = [new Token(TokenType.return, "$r1", 0)];

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [new Token(TokenType.return, "$r1", 0)];

    // console.log("tokens", tokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("$q1and$q2 -> $q1$q2and", () => {
    const tokenizer = new Tokenizer("$q1and$q2");
    const tokens = tokenizer.all();
    const expectedTokens = [
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.and, "and", 3),
      new Token(TokenType.query, "$q2", 6),
    ];

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.query, "$q2", 6),
      new Token(TokenType.and, "and", 3),
    ];

    // console.log("tokens", tokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("$q1>$q2 -> $q1$q2>", () => {
    const tokens = new Tokenizer("$q1>$q2").all();
    expect(tokens).toEqual([
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.gt, ">", 3),
      new Token(TokenType.query, "$q2", 4),
    ]); // TODO, irfan needs to move it to the right place. This is the wrong place.

    const context: Map<string, ParserContextDataTypes> = new Map();
    const exprParser = new ExprParser(context);
    const postfixTokens = exprParser.infixToPostFix(tokens);

    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.query, "$q2", 4),
      new Token(TokenType.gt, ">", 3),
    ]);
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
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.query, "$q2", 6),
      new Token(TokenType.and, "and", 3),
      new Token(TokenType.query, "$q3", 11),
      new Token(TokenType.or, "or", 9),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("$q2<=$q3and$q1 -> $q2$q3<=$q1and", () => {
    const tokens = new Tokenizer("$q2<=$q3and$q1").all();
    expect(tokens).toEqual([
      new Token(TokenType.query, "$q2", 0),
      new Token(TokenType.lte, "<=", 3),
      new Token(TokenType.query, "$q3", 5),
      new Token(TokenType.and, "and", 8),
      new Token(TokenType.query, "$q1", 11),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);

    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q2", 0),
      new Token(TokenType.query, "$q3", 5),
      new Token(TokenType.lte, "<=", 3),
      new Token(TokenType.query, "$q1", 11),
      new Token(TokenType.and, "and", 8),
    ]);
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
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 7),
      new Token(TokenType.and, "and", 4),
      new Token(TokenType.query, "$q3", 12),
      new Token(TokenType.or, "or", 10),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

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
      new Token(TokenType.parenthesisClose, ")", 17),
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.or, "or", 11),
      new Token(TokenType.and, "and", 4),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("($q1and($q2==$q3)) -> $q1,$q2,q3,==,and", () => {
    const tokens = new Tokenizer("($q1and($q2==$q3))").all();
    expect(tokens).toEqual([
      new Token(TokenType.parenthesisOpen, "(", 0),
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.and, "and", 4),
      new Token(TokenType.parenthesisOpen, "(", 7),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.eq, "==", 11),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.parenthesisClose, ")", 16),
      new Token(TokenType.parenthesisClose, ")", 17),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.eq, "==", 11),
      new Token(TokenType.and, "and", 4),
    ]);
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
      new Token(TokenType.return, "$r1", 15),
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 2),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.and, "and", 5),
      new Token(TokenType.return, "$r1", 15),
      new Token(TokenType.if, "if", 0),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

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
    ];

    // console.log("tokens", tokens);

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, ParserContextDataTypes> = new Map();

    const exprParser = new ExprParser(context);

    const postfixTokens = exprParser.infixToPostFix(tokens);
    const expectedPostfixTokens = [
      new Token(TokenType.query, "$q1", 2),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.and, "and", 5),
      new Token(TokenType.return, "$r1", 15),
      new Token(TokenType.return, "$r2", 22),
      new Token(TokenType.if, "if", 0),
    ];

    // console.log("expectedPostfixTokens", expectedPostfixTokens);
    // console.log("postfixTokens", postfixTokens);

    expect(postfixTokens).toEqual(expectedPostfixTokens);
  });

  test("if($q1>30)and($q2<35)then$a1 -> $q1 30 > $q2 35 < and $a1 if", () => {
    const tokens = new Tokenizer("if($q1>30)and($q1<35)then$a1").all();
    expect(tokens).toEqual([
      new Token(TokenType.if, "if", 0),
      new Token(TokenType.parenthesisOpen, "(", 2),
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.parenthesisClose, ")", 9),
      new Token(TokenType.and, "and", 10),
      new Token(TokenType.parenthesisOpen, "(", 13),
      new Token(TokenType.query, "$q1", 14),
      new Token(TokenType.lt, "<", 17),
      new Token(TokenType.number, 35, 18),
      new Token(TokenType.parenthesisClose, ")", 20),
      new Token(TokenType.then, "then", 21),
      new Token(TokenType.ad, "$a1", 25),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.query, "$q1", 14),
      new Token(TokenType.number, 35, 18),
      new Token(TokenType.lt, "<", 17),
      new Token(TokenType.and, "and", 10),
      new Token(TokenType.ad, "$a1", 25),
      new Token(TokenType.if, "if", 0),
    ]);
  });

  test("if($q1>=30)and($q2<=35)then$a1 -> $q1 30 > $q2 35 < and $a1 if", () => {
    const tokens = new Tokenizer("if($q1>=30)and($q1<=35)then$a1").all();
    expect(tokens).toEqual([
      new Token(TokenType.if, "if", 0),
      new Token(TokenType.parenthesisOpen, "(", 2),
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.gte, ">=", 6),
      new Token(TokenType.number, 30, 8),
      new Token(TokenType.parenthesisClose, ")", 10),
      new Token(TokenType.and, "and", 11),
      new Token(TokenType.parenthesisOpen, "(", 14),
      new Token(TokenType.query, "$q1", 15),
      new Token(TokenType.lte, "<=", 18),
      new Token(TokenType.number, 35, 20),
      new Token(TokenType.parenthesisClose, ")", 22),
      new Token(TokenType.then, "then", 23),
      new Token(TokenType.ad, "$a1", 27),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.number, 30, 8),
      new Token(TokenType.gte, ">=", 6),
      new Token(TokenType.query, "$q1", 15),
      new Token(TokenType.number, 35, 20),
      new Token(TokenType.lte, "<=", 18),
      new Token(TokenType.and, "and", 11),
      new Token(TokenType.ad, "$a1", 27),
      new Token(TokenType.if, "if", 0),
    ]);
  });

  test("if($q1>30)==($q2<35)then$a1 -> $q1 30 > $q2 35 < == $a1 if", () => {
    const tokens = new Tokenizer("if($q1>30)==($q1<35)then$a1").all();
    expect(tokens).toEqual([
      new Token(TokenType.if, "if", 0),
      new Token(TokenType.parenthesisOpen, "(", 2),
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.parenthesisClose, ")", 9),
      new Token(TokenType.eq, "==", 10),
      new Token(TokenType.parenthesisOpen, "(", 12),
      new Token(TokenType.query, "$q1", 13),
      new Token(TokenType.lt, "<", 16),
      new Token(TokenType.number, 35, 17),
      new Token(TokenType.parenthesisClose, ")", 19),
      new Token(TokenType.then, "then", 20),
      new Token(TokenType.ad, "$a1", 24),
    ]);

    const context: Map<string, ParserContextDataTypes> = new Map();
    const postfixTokens = new ExprParser(context).infixToPostFix(tokens);
    expect(postfixTokens).toEqual([
      new Token(TokenType.query, "$q1", 3),
      new Token(TokenType.number, 30, 7),
      new Token(TokenType.gt, ">", 6),
      new Token(TokenType.query, "$q1", 13),
      new Token(TokenType.number, 35, 17),
      new Token(TokenType.lt, "<", 16),
      new Token(TokenType.eq, "==", 10),
      new Token(TokenType.ad, "$a1", 24),
      new Token(TokenType.if, "if", 0),
    ]);
  });
});

describe("Postfix to AST", () => {
  test("$r2", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser()
      .andThen((exprParser) => {
        const postFix = [new Token(TokenType.query, "$r2", 0)];
        const expr = exprParser.buildAstFromPostfix(postFix);
        // console.log(expr);
        expect(expr).toEqual(mocks.context!.get("r2"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });
  test("$q1$q2andq3or to ast", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser()
      .andThen((exprParser) => {
        const postFix = [
          new Token(TokenType.query, "$q1", 0),
          new Token(TokenType.query, "$q2", 6),
          new Token(TokenType.and, "and", 3),
          new Token(TokenType.query, "$q3", 11),
          new Token(TokenType.or, "or", 9),
        ];
        // console.log(context.keys());
        const expr = exprParser.buildAstFromPostfix(
          postFix,
        ) as AST_ConditionExpr;
        // console.log(expr);
        expect(expr.constructor).toBe(AST_ConditionExpr);
        // const cond = expr.source as ConditionOr;
        expect(expr.source.constructor).toBe(ConditionOr);
        const or = expr.source as ConditionOr;
        expect(or.lval!.constructor).toBe(AST_ConditionExpr);
        expect((or.lval as AST_ConditionExpr).source.constructor).toBe(
          ConditionAnd,
        );
        const and = (or.lval as AST_ConditionExpr).source as ConditionAnd;
        expect(and.lval).toEqual(mocks.context!.get("q1"));
        expect(and.rval).toEqual(mocks.context!.get("q2"));
        expect(or.rval).toEqual(mocks.context!.get("q3"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });
  test("$q2$q3<=$q1and to ast", async () => {
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser())._unsafeUnwrap();
    const expr = (await parser.buildAstFromPostfix([
      new Token(TokenType.query, "$q2", 0),
      new Token(TokenType.query, "$q3", 5),
      new Token(TokenType.lte, "<=", 3),
      new Token(TokenType.query, "$q1", 11),
      new Token(TokenType.and, "and", 8),
    ])) as AST_ConditionExpr;

    expect(expr.source.constructor).toBe(ConditionAnd);
    const and = expr.source as ConditionAnd;
    expect(and.rval).toEqual(mocks.context!.get("q1"));

    expect(and.lval!.constructor).toBe(AST_ConditionExpr);
    const lval = and.lval as AST_ConditionExpr;
    expect(lval.source.constructor).toBe(ConditionLE);
    const le = lval.source as ConditionLE;

    expect(le.lval).toEqual(mocks.context!.get("q2"));
    expect(le.rval).toEqual(mocks.context!.get("q3"));
  });
  test("$q1,$q2,q3,or,and to ast", async () => {
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser())._unsafeUnwrap();
    const expr = (await parser.buildAstFromPostfix([
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.or, "or", 11),
      new Token(TokenType.and, "and", 4),
    ])) as AST_ConditionExpr;

    console.log(JSON.stringify(expr.source)); // ????
    const andExpr = expr.source as ConditionAnd;
    console.log("lval: " + JSON.stringify(andExpr.lval)); // garbage
    console.log("rval: " + JSON.stringify(andExpr.rval)); // UNDEFINED
  });
  test("$q1 10 > to ast", async () => {
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser())._unsafeUnwrap();
    const expr = (await parser.buildAstFromPostfix([
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.number, 10, 4),
      new Token(TokenType.gt, ">", 3),
    ])) as AST_ConditionExpr;
    expect(expr.source.constructor).toBe(ConditionG);
    const g = expr.source as ConditionG;
    expect(g.lval).toEqual(mocks.context!.get("q1"));
    expect(g.rval).toEqual(10);
  });
  test("$q1 10 <= to ast", async () => {
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser())._unsafeUnwrap();
    const expr = (await parser.buildAstFromPostfix([
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.number, 10, 5),
      new Token(TokenType.lte, "<=", 3),
    ])) as AST_ConditionExpr;
    expect(expr.source.constructor).toBe(ConditionLE);
    const g = expr.source as ConditionLE;
    expect(g.lval).toEqual(mocks.context!.get("q1"));
    expect(g.rval).toEqual(10);
  });
  test("$q1, $r1, if", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser()
      .andThen((exprParser) => {
        const postFix = [
          new Token(TokenType.query, "$q1", 2),
          new Token(TokenType.return, "$r1", 15),
          new Token(TokenType.if, "if", 0),
        ];
        const expr = exprParser.buildAstFromPostfix(postFix);
        // console.log(expr);
        expect(expr.constructor).toBe(Command_IF);
        const ifCommand = expr as Command_IF;
        expect(ifCommand.conditionExpr.constructor).toBe(AST_ConditionExpr);
        expect(ifCommand.trueExpr.constructor).toBe(AST_ReturnExpr);
        expect(ifCommand.falseExpr).toBeNull();
        const rExp = ifCommand.trueExpr as AST_ReturnExpr;
        expect(rExp.source.constructor).toBe(AST_Return);
        expect(rExp).toEqual(mocks.context!.get("r1"));
        const condExp = ifCommand.conditionExpr as AST_ConditionExpr;
        expect(condExp.source.constructor).toBe(AST_NetworkQuery);
        expect(condExp.source).toEqual(mocks.context!.get("q1"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });
  test("$q1, $q2, and, $r1, if", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser()
      .andThen((exprParser) => {
        const postFix = [
          new Token(TokenType.query, "$q1", 2),
          new Token(TokenType.query, "$q2", 8),
          new Token(TokenType.and, "and", 5),
          new Token(TokenType.return, "$r1", 15),
          new Token(TokenType.if, "if", 0),
        ];
        const expr = exprParser.buildAstFromPostfix(postFix);
        // console.log(expr);
        expect(expr.constructor).toBe(Command_IF);
        const ifCommand = expr as Command_IF;
        expect(ifCommand.conditionExpr.constructor).toBe(AST_ConditionExpr);
        expect(ifCommand.trueExpr.constructor).toBe(AST_ReturnExpr);
        expect(ifCommand.falseExpr).toBeNull();
        const rExp = ifCommand.trueExpr as AST_ReturnExpr;
        expect(rExp.source.constructor).toBe(AST_Return);
        expect(rExp).toEqual(mocks.context!.get("r1"));
        const condExp = ifCommand.conditionExpr as AST_ConditionExpr;
        expect(condExp.source.constructor).toBe(ConditionAnd);
        const and = condExp.source as ConditionAnd;
        expect(and.lval).toEqual(mocks.context!.get("q1"));
        expect(and.rval).toEqual(mocks.context!.get("q2"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });
  test("$q1, $q2, and, $r1, $r3 if", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser()
      .andThen((exprParser) => {
        const postFix = [
          new Token(TokenType.query, "$q1", 2),
          new Token(TokenType.query, "$q2", 8),
          new Token(TokenType.and, "and", 5),
          new Token(TokenType.return, "$r1", 15),
          new Token(TokenType.return, "$r3", 22),
          new Token(TokenType.if, "if", 0),
        ];
        const expr = exprParser.buildAstFromPostfix(postFix);
        // console.log(expr);
        expect(expr.constructor).toBe(Command_IF);
        const ifCommand = expr as Command_IF;
        expect(ifCommand.conditionExpr.constructor).toBe(AST_ConditionExpr);
        expect(ifCommand.trueExpr.constructor).toBe(AST_ReturnExpr);
        expect(ifCommand.falseExpr?.constructor).toBe(AST_ReturnExpr);
        expect(ifCommand.trueExpr).toEqual(mocks.context!.get("r1"));
        expect(ifCommand.falseExpr).toEqual(mocks.context!.get("r3"));
        const rExp1 = ifCommand.trueExpr as AST_ReturnExpr;
        expect(rExp1.source.constructor).toBe(AST_Return);
        const rExp2 = ifCommand.falseExpr as AST_ReturnExpr;
        expect(rExp2.source.constructor).toBe(AST_PropertyQuery);
        expect(rExp2.source).toEqual(mocks.context!.get("q3"));
        const condExp = ifCommand.conditionExpr as AST_ConditionExpr;
        expect(condExp.source.constructor).toBe(ConditionAnd);
        const and = condExp.source as ConditionAnd;
        expect(and.lval).toEqual(mocks.context!.get("q1"));
        expect(and.rval).toEqual(mocks.context!.get("q2"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });
  test("$q1 $q2 < $q3 or to ast", async () => {
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser())._unsafeUnwrap();
    const expr = await parser.buildAstFromPostfix([
      new Token(TokenType.query, "$q1", 0),
      new Token(TokenType.query, "$q2", 4),
      new Token(TokenType.lt, "<", 3),
      new Token(TokenType.query, "$q3", 9),
      new Token(TokenType.or, "or", 7),
    ]);

    expect(expr.constructor).toBe(AST_ConditionExpr);
    const conditionExpr = expr as AST_ConditionExpr;

    expect(conditionExpr.source.constructor).toBe(ConditionOr);
    const src1 = conditionExpr.source as ConditionOr;

    expect(src1.rval).toEqual(mocks.context!.get("q3"));
    expect(src1.lval!.constructor).toBe(AST_ConditionExpr);

    const lval = src1.lval as AST_ConditionExpr;
    expect(lval.source.constructor).toBe(ConditionL);

    const lt = lval.source as ConditionL;
    expect(lt.lval).toEqual(mocks.context!.get("q1"));
    expect(lt.rval).toEqual(mocks.context!.get("q2"));
  });

  test.only("$q1>35and$q2<40 to ast", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser())._unsafeUnwrap();
    const postfix = [
      new Token(TokenType.query, "$q1", 1),
      new Token(TokenType.query, "$q2", 8),
      new Token(TokenType.query, "$q3", 13),
      new Token(TokenType.or, "or", 11),
      new Token(TokenType.and, "and", 4),
    ];

    // // Action
    const expr = (await parser.buildAstFromPostfix(
      postfix,
    )) as AST_ConditionExpr;
    console.log(expr);

    // Assert
    expect(expr.source.constructor).toBe(ConditionAnd);
    const and = expr.source as ConditionAnd;
    expect(and.lval).toEqual(mocks.context!.get("q1"));

    expect(and.rval.constructor).toBe(AST_ConditionExpr);
    const orExpr = and.rval as AST_ConditionExpr;
    expect(orExpr.source.constructor).toBe(ConditionOr);
    const or = orExpr.source as ConditionOr;
    // TODO
  });
  // test.only("$q1>35and$q2<40 to ast", async () => {
  //   // Acquire
  //   const mocks = new ExprParserMocks();
  //   const parser = (await mocks.createExprParser())._unsafeUnwrap();

  //   // // Action
  //   const expr = parser.parse("$q1>35and$q2<40") as AST_ConditionExpr;
  //   console.log(expr);

  //   // Assert
  //   expect(expr.source.constructor).toBe(ConditionAnd);
  //   const and = expr.source as ConditionAnd;
  //   expect(and.rval).toEqual(mocks.context!.get("q1"));

  //   expect(and.lval.constructor).toBe(AST_ConditionExpr);
  //   const lval = and.lval as AST_ConditionExpr;
  //   expect(lval.source.constructor).toBe(ConditionLE);
  //   const le = lval.source as ConditionLE;

  //   expect(le.lval).toEqual(mocks.context!.get("q2"));
  //   expect(le.rval).toEqual(mocks.context!.get("q3"));
  // });
});

describe("Expression parser dependencies", () => {
  test("dependencies if($q1and$q2)then$r1else$r2 is q1, q2", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser()
      .andThen((exprParser) => {
        const expr = "if($q1and$q2)then$r1else$r2";
        const dependencies = exprParser.getQueryDependencies(expr);
        // const expectedDependencies = ['q1', 'q2'];
        // console.log(dependencies)
        // expect(dependencies).toEqual(expectedDependencies);
        expect(dependencies.length).toBe(2);
        const q1 = dependencies[0] as AST_Query;
        expect(q1.name).toBe(SDQL_Name("q1"));
        const q2 = dependencies[1] as AST_Query;
        expect(q2.name).toBe(SDQL_Name("q2"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });

  test("dependencies if($q1and$q2)then$r1else$r3 is q1, q2, q3", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser()
      .andThen((exprParser) => {
        const expr = "if($q1and$q2)then$r1else$r3";
        const dependencies = exprParser.getQueryDependencies(expr);
        // const expectedDependencies = ['q1', 'q2'];
        // console.log(dependencies)
        // expect(dependencies).toEqual(expectedDependencies);
        expect(dependencies.length).toBe(3);
        const q1 = dependencies[0] as AST_Query;
        expect(q1.name).toBe(SDQL_Name("q1"));
        const q2 = dependencies[1] as AST_Query;
        expect(q2.name).toBe(SDQL_Name("q2"));
        const q3 = dependencies[2] as AST_Query;
        expect(q3.name).toBe(SDQL_Name("q3"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });
});
