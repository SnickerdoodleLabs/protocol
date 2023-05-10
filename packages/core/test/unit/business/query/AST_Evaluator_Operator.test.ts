import {
  SDQL_Name,
  SDQL_OperatorName,
  SDQL_Return,
} from "@snickerdoodlelabs/objects";
import {
  AST_BoolExpr,
  ConditionAnd,
  ConditionOperandTypes,
  ConditionOr,
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

  test("SDQL_Return true is true, false is false, null is false", async () => {
    // Arrange
    const mocks = new ASTMocks();
    const astEvaluator = mocks.factory();
    const operands = [SDQL_Return(true), SDQL_Return(false), SDQL_Return(null)];
    const expected = [
      SDQL_Return(true),
      SDQL_Return(false),
      SDQL_Return(false),
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
      SDQL_Return(true),
    ];

    await testLogicalOperands(astEvaluator, operands, expected);
  });
});
