import "reflect-metadata";

import { ISDQLExpressionString, SDQL_Name } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";

import { AST_Query } from "@query-parser/interfaces";
import { ExprParserMocks } from "@query-parser-test/mocks";

describe("Expression parser dependencies", () => {
  test("dependencies if($q1and$q2)then$c1 is q1, q2", async () => {
    const mocks = new ExprParserMocks();
    const exprParser = (await mocks.createExprParser(null))._unsafeUnwrap();
    const expr = ISDQLExpressionString("if($q1and$q2)then$c1");

    const dependencies = (
      await exprParser.getQueryDependencies(expr)
    )._unsafeUnwrap();

    expect(dependencies.length).toBe(2);
    const q1 = dependencies[0] as AST_Query;
    expect(q1.name).toBe(SDQL_Name("q1"));
    const q2 = dependencies[1] as AST_Query;
    expect(q2.name).toBe(SDQL_Name("q2"));
    return okAsync(undefined);
  });

  test("dependencies if($q1and$q2)or$q3then$c1else$c2 is q1, q2, q3", async () => {
    const mocks = new ExprParserMocks();
    const exprParser = (await mocks.createExprParser(null))._unsafeUnwrap();
    const expr = ISDQLExpressionString("if($q1and$q2)or$q3then$c1else$c2");

    const dependencies = (
      await exprParser.getQueryDependencies(expr)
    )._unsafeUnwrap();

    expect(dependencies.length).toBe(3);
    const q1 = dependencies[0] as AST_Query;
    expect(q1.name).toBe(SDQL_Name("q1"));
    const q2 = dependencies[1] as AST_Query;
    expect(q2.name).toBe(SDQL_Name("q2"));
    const q3 = dependencies[2] as AST_Query;
    expect(q3.name).toBe(SDQL_Name("q3"));
  });
});
