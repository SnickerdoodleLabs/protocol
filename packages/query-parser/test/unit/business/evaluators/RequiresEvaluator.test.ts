import {
  AdContent,
  EAdContentType,
  EAdDisplayType,
  IpfsCID,
  ISDQLConditionString,
  ISDQLExpressionString,
  SDQL_Name,
  SDQL_OperatorName,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";

import { RequiresEvaluator } from "@query-parser/implementations/business/evaluators/RequiresEvaluator.js";
import "reflect-metadata";
import {
  AST_Ad,
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

  public getAdAst(name: string): AST_Ad {
    //   constructor(
    //     readonly key: SDQL_Name,
    //     readonly name: SDQL_Name,
    //     readonly content: AdContent,
    //     readonly text: string | null,
    //     readonly displayType: EAdDisplayType,
    //     readonly weight: number,
    //     readonly expiry: UnixTimestamp,
    //     readonly keywords: string[],
    //     readonly target: AST_ConditionExpr,
    //     readonly targetRaw: ISDQLConditionString,
    //   ) {}

    return new AST_Ad(
      SDQL_Name(name),
      SDQL_Name(name),
      new AdContent(EAdContentType.IMAGE, IpfsCID("")),
      null,
      EAdDisplayType.POPUP,
      1,
      UnixTimestamp(0),
      [],
      new AST_ConditionExpr(SDQL_Name("true"), true),
      ISDQLConditionString("true"),
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
  //   console.log("testRequiresAst", result._unsafeUnwrapErr());
  expect(result.isOk()).toBeTruthy();
  const gotValue = result._unsafeUnwrap();
  expect(gotValue).toBe(expectedValue);
}

describe("RequiresEvaluator with pre-built insight asts", () => {
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

  test("requires $1 and $i3 returns false", async () => {
    // Acquire
    const mocks = new RequiresEvaluatorMocks();
    const evaluator = mocks.factory();
    const astInsight1 = mocks.getInsightAst("i1");
    const astInsight2 = mocks.getInsightAst("i3");

    const andCond = new ConditionAnd(
      SDQL_OperatorName("and1"),
      astInsight1,
      astInsight2,
    );

    const astRequires = new AST_RequireExpr(SDQL_Name("c1"), andCond);
    const expectedValue = false;

    await testRequiresAst(evaluator, astRequires, expectedValue);
  });

  test("requires $i3 and $i1  returns false", async () => {
    // Acquire
    const mocks = new RequiresEvaluatorMocks();
    const evaluator = mocks.factory();
    const astInsight1 = mocks.getInsightAst("i1");
    const astInsight2 = mocks.getInsightAst("i3");

    const andCond = new ConditionAnd(
      SDQL_OperatorName("and1"),
      astInsight2,
      astInsight1,
    );

    const astRequires = new AST_RequireExpr(SDQL_Name("c1"), andCond);
    const expectedValue = false;

    await testRequiresAst(evaluator, astRequires, expectedValue);
  });

  test("requires $1 or $i3 returns true", async () => {
    // Acquire
    const mocks = new RequiresEvaluatorMocks();
    const evaluator = mocks.factory();
    const astInsight1 = mocks.getInsightAst("i1");
    const astInsight2 = mocks.getInsightAst("i3");

    const andCond = new ConditionAnd(
      SDQL_OperatorName("and1"),
      astInsight1,
      astInsight2,
    );

    const astRequires = new AST_RequireExpr(SDQL_Name("c1"), andCond);
    const expectedValue = true;

    await testRequiresAst(evaluator, astRequires, expectedValue);
  });

  test("requires $i3 or $i1 returns true", async () => {
    // Acquire
    const mocks = new RequiresEvaluatorMocks();
    const evaluator = mocks.factory();
    const astInsight1 = mocks.getInsightAst("i1");
    const astInsight2 = mocks.getInsightAst("i3");

    const andCond = new ConditionAnd(
      SDQL_OperatorName("and1"),
      astInsight2,
      astInsight1,
    );

    const astRequires = new AST_RequireExpr(SDQL_Name("c1"), andCond);
    const expectedValue = true;

    await testRequiresAst(evaluator, astRequires, expectedValue);
  });
});
