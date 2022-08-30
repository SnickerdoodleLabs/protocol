import "reflect-metadata";

import {
  Age,
  CountryCode,
  IpfsCID,
  SDQL_Name,
  SDQL_OperatorName,
  SDQL_Return,
} from "@objects/primitives";
import { IDataWalletPersistence } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";
import td from "testdouble";

import {
  QueryEvaluator,
  QueryRepository,
} from "@core/implementations/business/utilities";
import { QueryFactories } from "@core/implementations/utilities/factory";
import {
  AST_ConditionExpr,
  AST_Expr,
  AST_Return,
  AST_ReturnExpr,
  Command_IF,
  ConditionAnd,
  ConditionGE,
  ConditionIn,
  ConditionL,
  ConditionOr,
} from "@core/interfaces/objects";
import { IQueryFactories, IQueryObjectFactory } from "@core/interfaces/utilities/factory";
import { IBalanceQueryEvaluator } from "@core/interfaces/business/utilities/query/IBalanceQueryEvaluator";
import { BalanceQueryEvaluator } from "@core/implementations/business/utilities/query/BalanceQueryEvaluator";

// const ast = new AST(
//     Version("0.1"),
//     "Interactions with the Avalanche blockchain for 15-year and older individuals",
//     "Shrapnel"
//     );

class ASTMocks {
  public persistenceRepo = td.object<IDataWalletPersistence>();
  public queryObjectFactory = td.object<IQueryObjectFactory>();

  public queryFactories: IQueryFactories;
  //   protected queryRepository = td.object<IQueryRepository>();
  public queryRepository: QueryRepository;
  public queryEvaluator: QueryEvaluator;
  public balanceQueryEvaluator: IBalanceQueryEvaluator;

  public constructor() {
    this.queryFactories = new QueryFactories(this.queryObjectFactory);
    this.balanceQueryEvaluator = new BalanceQueryEvaluator(this.persistenceRepo);

    td.when(this.persistenceRepo.getAge()).thenReturn(okAsync(Age(25)));
    td.when(this.persistenceRepo.getLocation()).thenReturn(
      okAsync(CountryCode("1")),
    );

    this.queryEvaluator = new QueryEvaluator(this.persistenceRepo, this.balanceQueryEvaluator);
    this.queryRepository = new QueryRepository(this.queryEvaluator);
  }

  public factory() {
    return this.queryFactories.makeAstEvaluator(
      IpfsCID("000"),
      null,
      this.queryRepository,
    );
  }
}

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
