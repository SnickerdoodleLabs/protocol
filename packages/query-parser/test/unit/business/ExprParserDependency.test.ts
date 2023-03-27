import "reflect-metadata";

import { SDQL_Name } from "@snickerdoodlelabs/objects";
import { okAsync } from "neverthrow";

import { AST_Query } from "@query-parser/interfaces";
import { ExprParserMocks } from "@query-parser-test/mocks";

describe("Expression parser dependencies", () => {
  test("dependencies if($q1and$q2)then$r1else$r2 is q1, q2", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser(null)
      .andThen((exprParser) => {
        const expr = "if($q1and$q2)then$r1else$r2";
        const dependencies = exprParser.getQueryDependencies(expr);
        // const expectedDependencies = ['q1', 'q2'];
        // console.log(dependencies)
        // expect(dependencies).toEqual(expectedDependencies);
        expect(dependencies.length).toBe(2);
        const q1 = dependencies[0] as AST_Query;
        expect(q1.name).toBe(SDQL_Name("q1"));
        const q2 = dependencies[1] as AST_Query;
        expect(q2.name).toBe(SDQL_Name("q2"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });

  test("dependencies if($q1and$q2)then$r1else$r3 is q1, q2, q3", () => {
    const mocks = new ExprParserMocks();
    mocks
      .createExprParser(null)
      .andThen((exprParser) => {
        const expr = "if($q1and$q2)then$r1else$r3";
        const dependencies = exprParser.getQueryDependencies(expr);
        // const expectedDependencies = ['q1', 'q2'];
        // console.log(dependencies)
        // expect(dependencies).toEqual(expectedDependencies);
        expect(dependencies.length).toBe(3);
        const q1 = dependencies[0] as AST_Query;
        expect(q1.name).toBe(SDQL_Name("q1"));
        const q2 = dependencies[1] as AST_Query;
        expect(q2.name).toBe(SDQL_Name("q2"));
        const q3 = dependencies[2] as AST_Query;
        expect(q3.name).toBe(SDQL_Name("q3"));
        return okAsync(undefined);
      })
      .mapErr((err) => {
        fail((err as Error).message);
      });
  });
});
