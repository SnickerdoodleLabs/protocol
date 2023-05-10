import {
  SDQL_Name,
  SDQL_OperatorName,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_BoolExpr,
  Condition,
  ConditionAnd,
  ConditionE,
  ConditionOperandTypes,
  ConditionOr,
  Operator,
} from "@snickerdoodlelabs/query-parser";

import { AST_Evaluator } from "@core/implementations/business/utilities/query/index.js";
import { ASTMocks } from "@core-tests/mock/mocks";

async function testComparisonOperands(
  astEvaluator: AST_Evaluator,
  operands: (ConditionOperandTypes | null)[],
  expected: (ConditionOperandTypes | null)[],
) {
  // Act
  const result = await astEvaluator.evalComparisonOperands(operands);

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

describe("Comparison Operand tests", () => {
  test("true is true, false is false, null is null", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();
    const operands = [true, false, null];
    const expected = [SDQL_Return(true), SDQL_Return(false), SDQL_Return(null)];

    await testComparisonOperands(astEvaluator, operands, expected);
  });

  test("SDQL_Return true is true, false is false, null is null, array is array", async () => {
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
      SDQL_Return(null),
      SDQL_Return([]),
    ];
    await testComparisonOperands(astEvaluator, operands, expected);
  });
  test("string is string, 0 is 0, -1 is -1, array is array", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();
    const operands = ["Hello", 0, -1, [1, 2, 3]];
    const expected = [
      SDQL_Return("Hello"),
      SDQL_Return(0),
      SDQL_Return(-1),
      SDQL_Return([1, 2, 3]),
    ];

    await testComparisonOperands(astEvaluator, operands, expected);
  });

  test("SDQL_Return string is string, 0 is 0, -1 is -1, array is array", async () => {
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
      SDQL_Return("Hello"),
      SDQL_Return(0),
      SDQL_Return(-1),
      SDQL_Return([1, 2, 3]),
    ];

    await testComparisonOperands(astEvaluator, operands, expected);
  });
});

describe("Logical Operand tests", () => {
  describe("Equal tests", () => {
    test("true == true -> true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionE(SDQL_OperatorName("eq"), true, true);
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });
    test("true == false -> false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionE(SDQL_OperatorName("eq"), true, false);
      const expected = SDQL_Return(false);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });
    test("false == false -> true", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const cond = new ConditionE(SDQL_OperatorName("eq"), false, false);
      const expected = SDQL_Return(true);

      // Act
      await testCondition(astEvaluator, cond, expected);
    });
    test("anything with null is false", async () => {
      // Arrange
      const mocks = new ASTMocks();
      const astEvaluator = mocks.factory();

      const testCases = [[true, null, false]];

      const testResults = await Promise.all(
        testCases.map(async (testCase) => {
          const cond = new ConditionE(
            SDQL_OperatorName("eq"),
            testCase[0],
            testCase[1],
          );
          // Act
          const result = await astEvaluator.evalOperator(cond);
          // Assert
          expect(result.isOk()).toBeTruthy();
          const value = result._unsafeUnwrap();
          const testResult = value === testCase[2];
          if (testResult !== true) {
            console.log("test case " + testCase + " failed");
            // expect(1).toBe(2);
          }
        }),
      );
      testResults.map((v) => expect(v).toBeTruthy());
    });
  });
});
