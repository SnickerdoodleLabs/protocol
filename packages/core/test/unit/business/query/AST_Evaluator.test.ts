import "reflect-metadata";

import {
  AdContent,
  EAdContentType,
  EAdDisplayType,
  ESDQLQueryReturn,
  ISDQLConditionString,
  ISDQLExpressionString,
  IpfsCID,
  SDQL_Name,
  SDQL_OperatorName,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  AST_Ad,
  AST_ConditionExpr,
  AST_Expr,
  AST_Insight,
  AST_PropertyQuery,
  AST_RequiresExpr,
  AST_ReturnsExpr,
  Command_IF,
  ConditionAnd,
  ConditionE,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionOr,
} from "@snickerdoodlelabs/query-parser";

import { ASTMocks } from "@core-tests/mock/mocks";
import { ResultUtils } from "neverthrow-result-utils";

describe("IF Command: evalIf()", () => {
  // Arrange
  const mocks = new ASTMocks();
  const astEvaluator = mocks.factory();

  test("true q1 and true q2, return r1", async () => {
    const and = new ConditionAnd(SDQL_OperatorName("And1"), true, true);
    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      new AST_ConditionExpr(SDQL_Name("1"), true),
      new AST_ConditionExpr(SDQL_Name("2"), false),
      new AST_ConditionExpr(SDQL_Name("cond1"), and),
    );

    const result = await astEvaluator.evalIf(commandIf);

    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(true);
  });
  test("false q1 and true q2, return r2", async () => {
    const and = new ConditionAnd(SDQL_OperatorName("And1"), false, true);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      new AST_ConditionExpr(SDQL_Name("1"), true),
      new AST_ConditionExpr(SDQL_Name("2"), false),
      new AST_ConditionExpr(SDQL_Name("cond1"), and),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(false);
  });
  test("false q1 and false q2, return r2", async () => {
    const and = new ConditionAnd(SDQL_OperatorName("And1"), false, false);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      new AST_ConditionExpr(SDQL_Name("1"), true),
      new AST_ConditionExpr(SDQL_Name("2"), false),
      new AST_ConditionExpr(SDQL_Name("cond1"), and),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(false);
  });

  test("true q1 or true q2, return r1", async () => {
    const or = new ConditionOr(SDQL_OperatorName("Or1"), true, true);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      new AST_ConditionExpr(SDQL_Name("1"), true),
      new AST_ConditionExpr(SDQL_Name("2"), false),
      new AST_ConditionExpr(SDQL_Name("cond1"), or),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(true);
  });

  test("false q1 or false q2, return r2", async () => {
    const or = new ConditionOr(SDQL_OperatorName("Or1"), false, false);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      new AST_ConditionExpr(SDQL_Name("1"), true),
      new AST_ConditionExpr(SDQL_Name("2"), false),
      new AST_ConditionExpr(SDQL_Name("cond1"), or),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    expect(result._unsafeUnwrap()).toEqual(false);
  });
});

describe("Conditions", () => {
  test("boolean true and true is true", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const and = new ConditionAnd(SDQL_OperatorName("And1"), true, true);

    // Act
    const result = await astEvaluator.evalOperator(and);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeTruthy();
  });

  test("boolean true and false is false", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const and = new ConditionAnd(SDQL_OperatorName("And1"), true, false);

    // Act
    const result = await astEvaluator.evalOperator(and);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeFalsy();
  });

  test("boolean false and true is false", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const and = new ConditionAnd(SDQL_OperatorName("And1"), false, true);

    // Act
    const result = await astEvaluator.evalOperator(and);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeFalsy();
  });

  test("SDQL_Return true and true is true", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const and = new ConditionAnd(SDQL_OperatorName("And1"), true, true);

    // Act
    const result = await astEvaluator.evalOperator(and);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeTruthy();
  });

  test("1 is in [2, 1, 3]", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const condIn = new ConditionIn(
      SDQL_OperatorName("In1"),
      new AST_Expr(SDQL_Name("number"), 1),
      [2, 1, 3],
    );

    // Act
    const result = await astEvaluator.evalOperator(condIn);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeTruthy();
  });

  test("1 not in [2, 3]", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const condIn = new ConditionIn(
      SDQL_OperatorName("In1"),
      new AST_Expr(SDQL_Name("number"), 1),
      [2, 3],
    );

    // Act
    const result = await astEvaluator.evalOperator(condIn);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeFalsy();
  });

  test("apple is in ['apple', 'banana', 'orange']", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const condIn = new ConditionIn(
      SDQL_OperatorName("In1"),
      new AST_Expr(SDQL_Name("string"), "apple"),
      ["apple", "banana", "orange"],
    );

    // Act
    const result = await astEvaluator.evalOperator(condIn);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeTruthy();
  });

  test("apple not in ['banana', 'orange']", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const condIn = new ConditionIn(
      SDQL_OperatorName("In1"),
      new AST_Expr(SDQL_Name("string"), "apple"),
      ["banana", "orange"],
    );

    // Act
    const result = await astEvaluator.evalOperator(condIn);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeFalsy();
  });

  test("1 < 2", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const cond = new ConditionL(
      SDQL_OperatorName("In1"),
      1,
      new AST_Expr(SDQL_Name("number"), 2),
    );

    // Act
    const result = await astEvaluator.evalOperator(cond);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();

    expect(value).toBeTruthy();
  });

  test("3 >= 2", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const cond = new ConditionGE(
      SDQL_OperatorName("In1"),
      3,
      new AST_Expr(SDQL_Name("number"), 2),
    );

    // Act
    const result = await astEvaluator.evalOperator(cond);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeTruthy();
  });

  test("2 >= 2", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const cond = new ConditionGE(
      SDQL_OperatorName("In1"),
      2,
      new AST_Expr(SDQL_Name("number"), 2),
    );

    // Act
    const result = await astEvaluator.evalOperator(cond);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeTruthy();
  });
});

describe("AST_ReturnsExpr", () => {
  let astEvaluator;
  beforeAll(() => {
    astEvaluator = new ASTMocks().factory();
  });

  test("Source: primitive", async () => {
    const returns = [
      new AST_ReturnsExpr(SDQL_Name("complex"), true),
      new AST_ReturnsExpr(SDQL_Name("complex"), false),
      new AST_ReturnsExpr(SDQL_Name("complex"), 10),
      new AST_ReturnsExpr(SDQL_Name("complex"), "not qualified"),
      new AST_ReturnsExpr(SDQL_Name("complex"), null),
    ];

    const result = await ResultUtils.combine(
      returns.map((ret) => astEvaluator.evalAny(ret)),
    );
    expect(result.isOk()).toBeTruthy();

    const value = result._unsafeUnwrap();
    expect(value.includes(true)).toBe(true);
    expect(value.filter((val) => val == false).length == 2).toBe(true);
    expect(value.includes(10)).toBe(true);
    expect(value.includes("not qualified")).toBe(true);
  });

  test("Source: operator", async () => {
    const returns = new AST_ReturnsExpr(
      SDQL_Name("complex"),
      new ConditionE(
        SDQL_OperatorName("==1"),
        new AST_PropertyQuery(
          SDQL_Name("q2"),
          ESDQLQueryReturn.String,
          "gender",
          [],
        ),
        "nonbinary",
      ),
    );

    const result = await astEvaluator.evalAny(returns);
    expect(result.isOk()).toBeTruthy();

    const value = result._unsafeUnwrap();
    expect(value).toBe(false);
  });

  // Returning raw queries is not a good idea, but ...
  test("Source: subquery", async () => {
    const returns = new AST_ReturnsExpr(
      SDQL_Name("complex"),
      new AST_PropertyQuery(
        SDQL_Name("q2"),
        ESDQLQueryReturn.Enum,
        "gender",
        [],
        ["male", "female", "nonbinary"],
      ),
    );

    const result = await astEvaluator.evalAny(returns);
    expect(result.isOk()).toBeTruthy();

    const value = result._unsafeUnwrap();
    expect(value).toBe("female");
  });
});

describe("AST_RequiresExpr", () => {
  let astEvaluator;
  beforeAll(() => {
    astEvaluator = new ASTMocks().factory();
  });

  describe("AST_RequiresExpr with Insights", () => {
    test("1", async () => {
      const insight = new AST_RequiresExpr(
        SDQL_Name("c1"),
        new AST_Insight(
          SDQL_Name("i1"),
          new AST_ConditionExpr(
            SDQL_Name(">1"),
            new ConditionG(
              SDQL_OperatorName(">1"),
              new AST_PropertyQuery(
                SDQL_Name("q1"),
                ESDQLQueryReturn.Integer,
                "age",
                [],
              ),
              35,
            ),
          ),
          ISDQLConditionString("$q1>35"),
          new AST_ReturnsExpr(
            SDQL_Name("complex"),
            new ConditionE(
              SDQL_OperatorName("==1"),
              new AST_PropertyQuery(
                SDQL_Name("q2"),
                ESDQLQueryReturn.String,
                "gender",
                [],
              ),
              "nonbinary",
            ),
          ),
          ISDQLExpressionString("$q2 == 'nonbinary'"),
        ),
      );

      const result = await astEvaluator.evalAny(insight);
      expect(result.isOk()).toBeTruthy();

      const value = result._unsafeUnwrap();
      expect(value).toBe(null);
    });

    test("2", async () => {
      const insight = new AST_RequiresExpr(
        SDQL_Name("c1"),
        new AST_Insight(
          SDQL_Name("i1"),
          new AST_ConditionExpr(
            SDQL_Name(">1"),
            new ConditionG(
              SDQL_OperatorName(">1"),
              new AST_PropertyQuery(
                SDQL_Name("q1"),
                ESDQLQueryReturn.Integer,
                "age",
                [],
              ),
              15,
            ),
          ),
          ISDQLConditionString("$q1>35"),
          new AST_ReturnsExpr(
            SDQL_Name("complex"),
            new ConditionE(
              SDQL_OperatorName("==1"),
              new AST_PropertyQuery(
                SDQL_Name("q2"),
                ESDQLQueryReturn.Enum,
                "gender",
                [],
                ["male", "female", "nonbinary"],
              ),
              "female",
            ),
          ),
          ISDQLExpressionString("$q2 == 'male'"),
        ),
      );

      const result = await astEvaluator.evalAny(insight);
      expect(result.isOk()).toBeTruthy();

      const value = result._unsafeUnwrap();
      expect(value).toBe(true);
    });

    test("3", async () => {
      const insight = new AST_RequiresExpr(
        SDQL_Name("c1"),
        new AST_Insight(
          SDQL_Name("i1"),
          new AST_ConditionExpr(
            SDQL_Name(">1"),
            new ConditionG(
              SDQL_OperatorName(">1"),
              new AST_PropertyQuery(
                SDQL_Name("q1"),
                ESDQLQueryReturn.Integer,
                "age",
                [],
              ),
              15,
            ),
          ),
          ISDQLConditionString("$q1>35"),
          new AST_ReturnsExpr(
            SDQL_Name("complex"),
            new AST_PropertyQuery(
              SDQL_Name("q2"),
              ESDQLQueryReturn.Enum,
              "gender",
              [],
              ["male", "female", "nonbinary"],
            ),
          ),
          ISDQLExpressionString("$q2"),
        ),
      );

      const result = await astEvaluator.evalAny(insight);
      expect(result.isOk()).toBeTruthy();

      const value = result._unsafeUnwrap();
      expect(value).toBe("female");
    });
  });

  describe("AST_RequiresExpr with ads", () => {
    test("With a WATCHED ad", async () => {
      const insight = new AST_RequiresExpr(
        SDQL_Name("c1"),
        new AST_Ad(
          SDQL_Name("a1"),
          SDQL_Name("a1"),
          new AdContent(EAdContentType.IMAGE, IpfsCID("Is life a theatre?")),
          "ads",
          EAdDisplayType.BANNER,
          15,
          UnixTimestamp(123),
          [],
          new AST_ConditionExpr(
            SDQL_Name(">1"),
            new ConditionG(
              SDQL_OperatorName(">1"),
              new AST_PropertyQuery(
                SDQL_Name("q1"),
                ESDQLQueryReturn.Integer,
                "age",
                [],
              ),
              35,
            ),
          ),
          ISDQLConditionString("$q1>35"),
        ),
      );

      const result = await astEvaluator.evalAny(insight);
      expect(result.isOk()).toBeTruthy();

      const value = result._unsafeUnwrap();
      expect(value).toBe(null);
    });
  });
});
