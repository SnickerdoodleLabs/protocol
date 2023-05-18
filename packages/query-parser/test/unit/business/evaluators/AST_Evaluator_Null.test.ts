import { SDQL_Name, SDQL_OperatorName } from "@snickerdoodlelabs/objects";
import {
  AST_BoolExpr,
  ConditionAnd,
  ConditionOr,
} from "@snickerdoodlelabs/query-parser";

import { ASTMocks } from "@core-tests/mock/mocks";

describe("Conditions", () => {
  test("boolean null is false", async () => {
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();

    const boolWithNullSource = new AST_BoolExpr(SDQL_Name("dummy"), null);

    // Act
    const result = await astEvaluator.evalExpr(boolWithNullSource);

    // Assert
    expect(result.isOk()).toBeTruthy();
    const value = result._unsafeUnwrap();
    expect(value).toBeFalsy();
  });

  describe("or tests", () => {
    test("boolean null or true is true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("or"),
        new AST_BoolExpr(SDQL_Name("dummy"), null),
        true,
      );

      // Act
      const result = await astEvaluator.evalOperator(cond);

      // Assert
      expect(result.isOk()).toBeTruthy();
      const value = result._unsafeUnwrap();
      expect(value).toBeTruthy();
    });

    test("boolean null or false is false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("or"),
        new AST_BoolExpr(SDQL_Name("dummy"), null),
        false,
      );

      // Act
      const result = await astEvaluator.evalOperator(cond);

      // Assert
      expect(result.isOk()).toBeTruthy();
      const value = result._unsafeUnwrap();
      expect(value).toBeFalsy();
    });

    test("boolean null or null is false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("or"),
        new AST_BoolExpr(SDQL_Name("dummy"), null),
        new AST_BoolExpr(SDQL_Name("dummy2"), null),
      );

      // Act
      const result = await astEvaluator.evalOperator(cond);

      // Assert
      expect(result.isOk()).toBeTruthy();
      const value = result._unsafeUnwrap();
      expect(value).toBeFalsy();
    });
  });

  describe("and tests", () => {
    test("boolean null and true is false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        new AST_BoolExpr(SDQL_Name("dummy"), null),
        true,
      );

      // Act
      const result = await astEvaluator.evalOperator(cond);

      // Assert
      expect(result.isOk()).toBeTruthy();
      const value = result._unsafeUnwrap();

      expect(value).toBeFalsy();
    });

    test("boolean true and null is false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        true,
        new AST_BoolExpr(SDQL_Name("dummy"), null),
      );

      // Act
      const result = await astEvaluator.evalOperator(cond);

      // Assert
      expect(result.isOk()).toBeTruthy();
      const value = result._unsafeUnwrap();

      expect(value).toBeFalsy();
    });

    test("boolean null and null is false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        new AST_BoolExpr(SDQL_Name("dummy"), null),
        new AST_BoolExpr(SDQL_Name("dummy2"), null),
      );

      // Act
      const result = await astEvaluator.evalOperator(cond);

      // Assert
      expect(result.isOk()).toBeTruthy();
      const value = result._unsafeUnwrap();
      expect(value).toBeFalsy();
    });
  });
});
