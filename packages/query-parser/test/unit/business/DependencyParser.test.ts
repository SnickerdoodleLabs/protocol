import "reflect-metadata";

import { DependencyParser } from "@query-parser/implementations";
import {
  AST_SubQuery,
  ConditionAnd,
  ConditionOr,
} from "@query-parser/index.js";
import { AdKey, InsightKey, SDQL_Name } from "@snickerdoodlelabs/objects";
import { ExprParserMocks } from "@query-parser-test/mocks";

const InsightsAnswered = [
  InsightKey("i1"),
  InsightKey("i2"),
  InsightKey("i3"),
  InsightKey("i4"),
];
const exprParserMocks = new ExprParserMocks();
const adsAnswered = [AdKey("a1"), AdKey("a2"), AdKey("a3")];
const queries = [
  SDQL_Name("q1"),
  SDQL_Name("q2"),
  SDQL_Name("q3"),
  SDQL_Name("q4"),
];
const getKeys = (queries: Set<AST_SubQuery>): SDQL_Name[] => {
  const keys = [...queries.keys()].map((query) => query.name);
  keys.sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
  );
  return keys;
};
let dependencyParser: DependencyParser;
describe("Dependency Parser Test", () => {
  beforeEach(() => {
    dependencyParser = new DependencyParser();
  });

  test("i1, i1 answered, should get q1", async () => {
    const expr = exprParserMocks.createInsightAdRequires("i1");
    await dependencyParser
      .getQueryDependencies(expr, InsightsAnswered.slice(0, 1))
      .map((result) => {
        expect(getKeys(result)).toEqual(queries.slice(0, 1));
      })
      .mapErr((e) => {
        fail(e.message);
      });
  });

  test("true, should get empty array", async () => {
    const expr = exprParserMocks.createAstRequireExpr("true", true);
    await dependencyParser
      .getQueryDependencies(expr, [])
      .map((result) => {
        expect(getKeys(result)).toEqual([]);
      })
      .mapErr((e) => {
        fail(e.message);
      });
  });

  test("a1 or i2, a1 answered, should get q1", async () => {
    const expr = exprParserMocks.createInsightAdRequires("i1", [
      { lvalName: "a1", binaryOperation: ConditionOr, rvalName: "i2" },
    ]);
    await dependencyParser
      .getQueryDependencies(expr, adsAnswered.slice(0, 1))
      .map((result) => {
        expect(getKeys(result)).toEqual(queries.slice(0, 1));
      })
      .mapErr((e) => {
        fail(e.message);
      });
  });
  test("i1 or i2, i1 and i2 answered,  should get q1 and q2", async () => {
    const expr = exprParserMocks.createInsightAdRequires("i1", [
      { lvalName: "i1", binaryOperation: ConditionOr, rvalName: "i2" },
    ]);
    await dependencyParser
      .getQueryDependencies(expr, InsightsAnswered.slice(0, 2))
      .map((result) => {
        expect(getKeys(result)).toEqual(queries.slice(0, 2));
      })
      .mapErr((e) => {
        fail(e.message);
      });
  });

  test("i1 or i2 and a3, i1 and i2 and a3 answered should get q1, q2 , q3", async () => {
    const expr = exprParserMocks.createInsightAdRequires("i1", [
      { lvalName: "i1", binaryOperation: ConditionOr, rvalName: "i2" },
      { lvalName: "a3", binaryOperation: ConditionAnd },
    ]);
    await dependencyParser
      .getQueryDependencies(expr, [
        ...InsightsAnswered.slice(0, 2),
        ...adsAnswered.slice(2, 3),
      ])
      .map((result) => {
        expect(getKeys(result)).toEqual(queries.slice(0, 3));
      })
      .mapErr((e) => {
        fail(e.message);
      });
  });

  test("i1 and i2 and i3 and i4 a1 and a2 and a3, all answered should get q1, q2 , q3, q4", async () => {
    const expr = exprParserMocks.createInsightAdRequires("i1", [
      { lvalName: "i1", binaryOperation: ConditionAnd, rvalName: "i2" },
      { lvalName: "i3", binaryOperation: ConditionAnd },
      { lvalName: "i4", binaryOperation: ConditionAnd },
      { lvalName: "a1", binaryOperation: ConditionAnd },
      { lvalName: "a2", binaryOperation: ConditionAnd },
      { lvalName: "a3", binaryOperation: ConditionAnd },
    ]);
    await dependencyParser
      .getQueryDependencies(expr, [...InsightsAnswered, ...adsAnswered])
      .map((result) => {
        expect(getKeys(result)).toEqual(queries);
      })
      .mapErr((e) => {
        fail(e.message);
      });
  });
});
