import "reflect-metadata";

import { ASTMocks } from "@core-tests/mock/mocks";
import {
  SDQL_Name,
  SDQL_OperatorName,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_ConditionExpr,
  AST_Expr,
  AST_Return,
  AST_ReturnExpr,
  Command_IF,
  ConditionAnd,
  ConditionE,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionOr,
} from "@snickerdoodlelabs/query-parser";

// #region Conditions
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

    const and = new ConditionAnd(
      SDQL_OperatorName("And1"),
      SDQL_Return(true),
      SDQL_Return(true),
    );

    // console.log("SDQL_Return type", typeof SDQL_Return(true));

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

  test("'AU' == 'AU'", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const cond = new ConditionE(
      SDQL_OperatorName("e1"),
      new AST_Expr(SDQL_Name("string"), "AU"),
      new AST_Expr(SDQL_Name("string"), "AU"),
    );

    // Act
    const result = await astEvaluator.evalOperator(cond);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeTruthy();
  });

  test("'US' != 'AU", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const cond = new ConditionE(
      SDQL_OperatorName("e1"),
      new AST_Expr(SDQL_Name("string"), "US"),
      new AST_Expr(SDQL_Name("string"), "AU"),
    );

    // Act
    const result = await astEvaluator.evalOperator(cond);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeFalsy();
  });
});

// #endregion

// #region IF Command
describe("IF Command: evalIf()", () => {
  // Arrange
  const mocks = new ASTMocks();
  const astEvaluator = mocks.factory();

  const r1 = new AST_ReturnExpr(
    SDQL_Name("r1"),
    new AST_Return(SDQL_Name("callback"), "qualified"),
  );
  const r2 = new AST_ReturnExpr(
    SDQL_Name("r2"),
    new AST_Return(SDQL_Name("callback"), "not qualified"),
  );

  test("true q1 and true q2, return r1", async () => {
    const and = new ConditionAnd(SDQL_OperatorName("And1"), true, true);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), and),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r1.source as AST_Return).message);
    }
  });
  test("false q1 and true q2, return r2", async () => {
    const and = new ConditionAnd(SDQL_OperatorName("And1"), false, true);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), and),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r2.source as AST_Return).message);
    }
  });
  test("true q1 and false q2, return r2", async () => {
    const and = new ConditionAnd(SDQL_OperatorName("And1"), true, false);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), and),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r2.source as AST_Return).message);
    }
  });
  test("false q1 and false q2, return r2", async () => {
    const and = new ConditionAnd(SDQL_OperatorName("And1"), false, false);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), and),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r2.source as AST_Return).message);
    }
  });

  test("true q1 or true q2, return r1", async () => {
    const or = new ConditionOr(SDQL_OperatorName("Or1"), true, true);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), or),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r1.source as AST_Return).message);
    }
  });

  test("false q1 or true q2, return r1", async () => {
    const or = new ConditionOr(SDQL_OperatorName("Or1"), false, true);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), or),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r1.source as AST_Return).message);
    }
  });

  test("true q1 or false q2, return r1", async () => {
    const or = new ConditionOr(SDQL_OperatorName("Or1"), true, false);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), or),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r1.source as AST_Return).message);
    }
  });

  test("false q1 or false q2, return r2", async () => {
    const or = new ConditionOr(SDQL_OperatorName("Or1"), false, false);

    const commandIf = new Command_IF(
      SDQL_Name("if1"),
      r1,
      r2,
      new AST_ConditionExpr(SDQL_Name("cond1"), or),
    );

    const result = await astEvaluator.evalIf(commandIf);
    expect(result.isOk()).toBeTruthy();
    if (result.isOk()) {
      expect(result.value).toEqual((r2.source as AST_Return).message);
    }
  });
});

// #endregion
