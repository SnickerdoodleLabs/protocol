import "reflect-metadata";

import { IpfsCID, SDQL_Name } from "@snickerdoodlelabs/objects";
import { okAsync, ResultAsync } from "neverthrow";

import { SDQLQueryWrapperMocks } from "@query-parser-test/mocks";
import { avalanche1SchemaStr } from "@query-parser/sampleData/avalanche1.data";
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
  ConditionOr,
  ParserContextDataTypes,
  SDQLQueryWrapper,
} from "@query-parser/interfaces";

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

describe("Postfix expressions", () => {
  test("$r1 -> $r1", () => {
    const tokenizer = new Tokenizer("$r1");
    const tokens = tokenizer.all();
    const expectedTokens = [new Token(TokenType.return, "$r1", 0)];

    expect(tokens).toEqual(expectedTokens);

    const context: Map<string, any> = new Map();

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

    const context: Map<string, any> = new Map();

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

    const context: Map<string, any> = new Map();

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

    const context: Map<string, any> = new Map();

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

    const context: Map<string, any> = new Map();

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

    const context: Map<string, any> = new Map();

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

    const context: Map<string, any> = new Map();

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
        expect(or.lval.constructor).toBe(AST_ConditionExpr);
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
