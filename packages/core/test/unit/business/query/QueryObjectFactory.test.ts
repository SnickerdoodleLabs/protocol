import "reflect-metadata";
import { SDQL_Name } from "@snickerdoodlelabs/objects";
import { ConditionGE } from "@snickerdoodlelabs/query-parser";

import { QueryObjectFactoryMocks } from "@core-tests/mock/mocks/QueryObjectFactoryMocks.js";

describe("test balance query parsing", () => {
  test("q4 should have networkId 43114 and no conditions", () => {
    const mocks = new QueryObjectFactoryMocks();
    const factory = mocks.factory();
    const schema = mocks.schema;

    const name = "q4";
    const balanceSchemma = schema.getQuerySchema()[name];
    const query = factory.toBalanceQuery(SDQL_Name(name), balanceSchemma);
    // console.log(query);
    expect(query.networkId).toEqual(43114);
    expect(query.conditions.length).toEqual(0);
  });

  test("q5 should have networkId 1 and and one ge (10) condition ", () => {
    const mocks = new QueryObjectFactoryMocks();
    const factory = mocks.factory();
    const schema = mocks.schema;

    const name = "q5";
    const balanceSchemma = schema.getQuerySchema()[name];
    const query = factory.toBalanceQuery(SDQL_Name(name), balanceSchemma);
    // console.log(query);
    expect(query.networkId).toEqual(1);
    expect(query.conditions.length).toEqual(1);

    const cond = query.conditions[0];

    expect(cond.constructor).toBe(ConditionGE);
    expect((cond as ConditionGE).rval).toBe(10);
  });

  test("q6 should have networkId null and no conditions", () => {
    const mocks = new QueryObjectFactoryMocks();
    const factory = mocks.factory();
    const schema = mocks.schema;

    const name = "q6";
    const balanceSchemma = schema.getQuerySchema()[name];
    const query = factory.toBalanceQuery(SDQL_Name(name), balanceSchemma);
    // console.log(query);
    expect(query.networkId).toEqual(null);
    expect(query.conditions.length).toEqual(0);
  });
});
