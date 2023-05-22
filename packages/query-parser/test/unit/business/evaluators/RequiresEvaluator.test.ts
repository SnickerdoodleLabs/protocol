import {
  ISDQLConditionString,
  ISDQLExpressionString,
  SDQL_Name,
  SDQL_OperatorName,
} from "@snickerdoodlelabs/objects";

import { RequiresEvaluator } from "@query-parser/implementations/business/evaluators/RequiresEvaluator.js";
import "reflect-metadata";
import {
  AST_ConditionExpr,
  AST_Expr,
  AST_Insight,
  AST_RequireExpr,
  ConditionAnd,
} from "@query-parser/interfaces";

class RequiresEvaluatorMocks {
  private availableMap = new Map<SDQL_Name, unknown>();
  constructor() {
    this.availableMap.set(SDQL_Name("i1"), 30);
    this.availableMap.set(SDQL_Name("i2"), { a: "a", b: "b", c: "c" });
    this.availableMap.set(SDQL_Name("i3"), null);
    this.availableMap.set(SDQL_Name("a1"), "0xasdfsad");
    this.availableMap.set(SDQL_Name("a2"), null);
  }

  public factory() {
    return new RequiresEvaluator(this.availableMap);
  }

  public getInsightAst(name: string): AST_Insight {
    return new AST_Insight(
      SDQL_Name(name),
      new AST_ConditionExpr(SDQL_Name("true"), true),
      ISDQLConditionString("true"),
      new AST_Expr(SDQL_Name("true"), true),
      ISDQLExpressionString("true"),
    );
  }

  //   public getRequiresExpression()
}

async function testRequiresAst(
  evaluator: RequiresEvaluator,
  astRequires: AST_RequireExpr,
  expectedValue: boolean,
) {
  // Act

  const result = await evaluator.eval(astRequires);

  // Assert
  expect(result.isOk()).toBeTruthy();
  const gotValue = result._unsafeUnwrap();
  expect(gotValue).toBe(expectedValue);
}

describe("RequiresEvaluator", () => {
  test("requires $i1 returns true", async () => {
    // Acquire
    const mocks = new RequiresEvaluatorMocks();
    const evaluator = mocks.factory();
    const astInsight = mocks.getInsightAst("i1");
    const astRequires = new AST_RequireExpr(SDQL_Name("c1"), astInsight);
    const expectedValue = true;

    await testRequiresAst(evaluator, astRequires, expectedValue);
  });
  test("requires $i3 (null) returns false", async () => {
    // Acquire
    const mocks = new RequiresEvaluatorMocks();
    const evaluator = mocks.factory();
    const astInsight = mocks.getInsightAst("i3");
    const astRequires = new AST_RequireExpr(SDQL_Name("c1"), astInsight);
    const expectedValue = false;

    await testRequiresAst(evaluator, astRequires, expectedValue);
  });

  test("requires $1 and $i2 returns true", async () => {
    // Acquire
    const mocks = new RequiresEvaluatorMocks();
    const evaluator = mocks.factory();
    const astInsight1 = mocks.getInsightAst("i1");
    const astInsight2 = mocks.getInsightAst("i2");

    const andCond = new ConditionAnd(
      SDQL_OperatorName("and1"),
      astInsight1,
      astInsight2,
    );
    const astRequires = new AST_RequireExpr(SDQL_Name("c1"), andCond);
    const expectedValue = true;

    await testRequiresAst(evaluator, astRequires, expectedValue);
  });
});
