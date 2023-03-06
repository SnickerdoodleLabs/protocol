import "reflect-metadata";

import { okAsync } from "neverthrow";

import { Token, TokenType } from "@query-parser/implementations";
import {
  AST_ConditionExpr,
  AST_NetworkQuery,
  AST_PropertyQuery,
  AST_Return,
  AST_ReturnExpr,
  Command_IF,
  ConditionAnd,
  ConditionG,
  ConditionL,
  ConditionLE,
  ConditionOr,
} from "@query-parser/interfaces";
import { ExprParserMocks } from "@query-parser-test/mocks";

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

  test.only("($q1and($q2orq3)) to ast", async () => {
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
    console.log(orExpr);
    expect(orExpr.source.constructor).toBe(ConditionOr);
    const or = orExpr.source as ConditionOr;
    expect(or.lval).toEqual(mocks.context!.get("q2"));
    expect(or.rval).toEqual(mocks.context!.get("q3"));
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
