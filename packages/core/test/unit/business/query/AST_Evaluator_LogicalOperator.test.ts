import {
  SDQL_Name,
  SDQL_OperatorName,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_BoolExpr,
  Condition,
  ConditionAnd,
  ConditionOperandTypes,
  ConditionOr,
  Operator,
} from "@snickerdoodlelabs/query-parser";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/index.js";
import { ASTMocks } from "@core-tests/mock/mocks";

async function testLogicalOperands(
  astEvaluator: AST_Evaluator,
  operands: (ConditionOperandTypes | null)[],
  expected: (ConditionOperandTypes | null)[],
) {
  // Act
  const result = await astEvaluator.evalLogicalOperands(operands);

  // Assert
  expect(result.isOk()).toBeTruthy();
  const value = result._unsafeUnwrap();
  expect(value).toEqual(expected);
}

async function testCondition(
  astEvaluator: AST_Evaluator,
  opAst: Operator,
  expected: SDQL_Return,
) {
  // Act
  const result = await astEvaluator.evalOperator(opAst);

  // Assert
  expect(result.isOk()).toBeTruthy();
  const value = result._unsafeUnwrap();
  expect(value).toEqual(expected);
}

describe("Logical Operand tests", () => {
  test("true is true, false is false, null is false", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();
    const operands = [true, false, null];
    const expected = [
      SDQL_Return(true),
      SDQL_Return(false),
      SDQL_Return(false),
    ];

    await testLogicalOperands(astEvaluator, operands, expected);
  });

  test("SDQL_Return true is true, false is false, null is false, array is true", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();
    const operands = [
      SDQL_Return(true),
      SDQL_Return(false),
      SDQL_Return(null),
      SDQL_Return([]),
    ];
    const expected = [
      SDQL_Return(true),
      SDQL_Return(false),
      SDQL_Return(false),
      SDQL_Return(true),
    ];
    await testLogicalOperands(astEvaluator, operands, expected);
  });

  test("string is true, 0 is true, -1 is true, array is true", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();
    const operands = ["Hello", 0, -1, [1, 2, 3]];
    const expected = [
      SDQL_Return(true),
      SDQL_Return(true),
      SDQL_Return(true),
      SDQL_Return(true),
    ];

    await testLogicalOperands(astEvaluator, operands, expected);
  });

  test("SDQL_Return string is true, 0 is true, -1 is true, array is true", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();
    const operands = [
      SDQL_Return("Hello"),
      SDQL_Return(0),
      SDQL_Return(-1),
      SDQL_Return([1, 2, 3]),
    ];
    const expected = [
      SDQL_Return(true),
      SDQL_Return(true),
      SDQL_Return(true),
      SDQL_Return(true),
    ];

    await testLogicalOperands(astEvaluator, operands, expected);
  });
});

describe("Logical Operand tests", () => {
  describe("And tests", () => {
    test("true && true == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(SDQL_OperatorName("and"), true, true);
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("true && false == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(SDQL_OperatorName("and"), true, false);
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("true && null == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        true,
        SDQL_Return(null),
      );
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("null && false == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        SDQL_Return(null),
        false,
      );
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("null && null == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        SDQL_Return(null),
        SDQL_Return(null),
      );
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("true && string == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        true,
        SDQL_Return("Hello"),
      );
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("false && string == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        false,
        SDQL_Return("Hello"),
      );
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("array && string == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        SDQL_Return([]),
        SDQL_Return("Hello"),
      );
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("array && null == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionAnd(
        SDQL_OperatorName("and"),
        SDQL_Return([]),
        SDQL_Return(null),
      );
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });
  });
  describe("Or tests", () => {
    test("true or true == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(SDQL_OperatorName("and"), true, true);
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });
    test("true or false == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(SDQL_OperatorName("and"), true, false);
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("true or null == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("and"),
        true,
        SDQL_Return(null),
      );
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("null or false == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("and"),
        SDQL_Return(null),
        false,
      );
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("null or null == false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("and"),
        SDQL_Return(null),
        SDQL_Return(null),
      );
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("true or string == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("and"),
        true,
        SDQL_Return("Hello"),
      );
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("false or string == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("and"),
        false,
        SDQL_Return("Hello"),
      );
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("array or string == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("and"),
        SDQL_Return([]),
        SDQL_Return("Hello"),
      );
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });

    test("array or null == true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionOr(
        SDQL_OperatorName("and"),
        SDQL_Return([]),
        SDQL_Return(null),
      );
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });
  });
});
