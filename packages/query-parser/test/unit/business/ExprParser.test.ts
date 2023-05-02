import "reflect-metadata";

import { okAsync } from "neverthrow";

import { ExprParserMocks } from "@query-parser-test/mocks";
import { Token, TokenType } from "@query-parser/implementations";
import {
  AST_ConditionExpr,
  ConditionAnd,
  ConditionE,
  ConditionG,
  ConditionL,
  ConditionLE,
  ConditionOr,
} from "@query-parser/interfaces";

describe("Postfix to AST", () => {
  test("$q1$q2andq3or to ast", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser(null)
      .andThen((exprParser) => {
        const postFix = [
          new Token(TokenType.query, "$q1", 0),
          new Token(TokenType.query, "$q2", 6),
          new Token(TokenType.and, "and", 3),
          new Token(TokenType.query, "$q3", 11),
          new Token(TokenType.or, "or", 9),
        ];
        const expr = exprParser.buildAstFromPostfix(postFix) as AST_ConditionExpr;
        expect(expr.constructor).toBe(AST_ConditionExpr);
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
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();
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
  test("$q1 10 > to ast", async () => {
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();
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
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();
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
  test("$q1 $q2 < $q3 or to ast", async () => {
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();
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
  test("($q1and($q2orq3)) to ast", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();

    // Action
    const expr = (
      await parser.parse("($q1and($q2or$q3))")
    )._unsafeUnwrap() as AST_ConditionExpr;

    // Assert
    expect(expr.source!.constructor).toBe(ConditionAnd);
    const and = expr.source as ConditionAnd;
    expect(and.lval).toEqual(mocks.context!.get("q1"));

    expect(and.rval.constructor).toBe(AST_ConditionExpr);
    const orExpr = and.rval as AST_ConditionExpr;

    expect(orExpr.source.constructor).toBe(ConditionOr);
    const or = orExpr.source as ConditionOr;
    expect(or.lval).toEqual(mocks.context!.get("q2"));
    expect(or.rval).toEqual(mocks.context!.get("q3"));
  });
  test("$q1>35and$q2<40 to ast", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();

    // // Action
    const expr = (
      await parser.parse("$q1>35and$q2<40")
    )._unsafeUnwrap() as AST_ConditionExpr;

    // Assert
    expect(expr.source.constructor).toBe(ConditionAnd);
    const and = expr.source as ConditionAnd;

    expect(and.rval!.constructor).toBe(AST_ConditionExpr);
    expect(and.lval!.constructor).toBe(AST_ConditionExpr);

    const lval = and.lval as AST_ConditionExpr;
    expect(lval.source.constructor).toBe(ConditionG);
    const ls = lval.source as ConditionG;

    expect(ls.lval).toEqual(mocks.context!.get("q1"));
    expect(ls.rval).toEqual(35);

    const rval = and.rval as AST_ConditionExpr;
    expect(rval.source.constructor).toBe(ConditionL);
    const rs = rval.source as ConditionL;

    expect(rs.lval).toEqual(mocks.context!.get("q2"));
    expect(rs.rval).toEqual(40);
  });
  test("$q1>35and$q1<40and($q2or$q3) to ast", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();

    // Action
    const expr = (
      await parser.parse("$q1>35and$q1<40and($q2or$q3)")
    )._unsafeUnwrap() as AST_ConditionExpr;

    // Assert
    expect(expr.source.constructor).toBe(ConditionAnd);
    const mainAnd = expr.source as ConditionAnd;

    expect(mainAnd.lval!.constructor).toBe(AST_ConditionExpr);
    const mainAndLval = mainAnd.lval as AST_ConditionExpr;
    expect(mainAndLval.source.constructor).toBe(ConditionAnd);

    expect(mainAnd.rval.constructor).toBe(AST_ConditionExpr);
    const mainAndRval = mainAnd.rval as AST_ConditionExpr;
    expect(mainAndRval.source.constructor).toBe(ConditionOr);
    const or = mainAndRval.source as ConditionOr;

    expect(or.lval!).toEqual(mocks.context!.get("q2"));
    expect(or.rval).toEqual(mocks.context!.get("q3"));
  });

  test("True to ast", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();

    // // Action
    const expr = (await parser.parse("True"))._unsafeUnwrap() as AST_ConditionExpr;

    // Assert
    expect(expr.source).toBe(true);
  });

  test("True and True to ast", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();

    // // Action
    const expr = (
      await parser.parse("True and True")
    )._unsafeUnwrap() as AST_ConditionExpr;

    // Assert
    expect(expr.source.constructor).toBe(ConditionAnd);
    const mainAnd = expr.source as ConditionAnd;
    expect(mainAnd.lval!).toBe(true);
    expect(mainAnd.rval).toBe(true);
  });

  test("$q3 == 'US'", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();

    // // Action
    const expr = (
      await parser.parse("$q3 == 'US'")
    )._unsafeUnwrap() as AST_ConditionExpr;

    // Assert
    expect(expr.source.constructor).toBe(ConditionE);
    const cond = expr.source as ConditionE;
    expect(cond.lval!).toEqual(mocks.context!.get("q3"));
    expect(cond.rval).toBe("US");
  });

  test("$a1 and $i1<40 and ($a2or$a3) to ast", async () => {
    // Acquire
    const mocks = new ExprParserMocks();
    const parser = (await mocks.createExprParser(null))._unsafeUnwrap();

    // Action
    const expr = (
      await parser.parse("$a1 and $i1<40 and ($a2or$a3)")
    )._unsafeUnwrap() as AST_ConditionExpr;

    // Assert
    expect(expr.source.constructor).toBe(ConditionAnd);
    const mainAnd = expr.source as ConditionAnd;

    expect(mainAnd.lval!.constructor).toBe(AST_ConditionExpr);
    const mainAndLval = mainAnd.lval as AST_ConditionExpr;
    expect(mainAndLval.source.constructor).toBe(ConditionAnd);

    const leftAnd = mainAndLval.source as ConditionAnd;
    expect(leftAnd.lval!).toEqual(mocks.context!.get("a1"));

    expect(leftAnd.rval.constructor).toBe(AST_ConditionExpr);
    const leftAndRvalExpr = leftAnd.rval as AST_ConditionExpr;

    expect(leftAndRvalExpr.source.constructor).toBe(ConditionL);
    const insightComparison = leftAndRvalExpr.source as ConditionL;

    expect(insightComparison.lval).toEqual(mocks.context!.get("i1"));

    expect(mainAnd.rval.constructor).toBe(AST_ConditionExpr);
    const mainAndRval = mainAnd.rval as AST_ConditionExpr;
    expect(mainAndRval.source.constructor).toBe(ConditionOr);
    const or = mainAndRval.source as ConditionOr;

    expect(or.lval!).toEqual(mocks.context!.get("a2"));
    expect(or.rval).toEqual(mocks.context!.get("a3"));
  });
});
