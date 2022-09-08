import "reflect-metadata";
import { QueryObjectFactory } from "@core/implementations/business/index.js";
import { ConditionGE, SDQLSchema } from "@core/interfaces/objects/index.js";
import { IQueryObjectFactory } from "@core/interfaces/utilities/factory/index.js";
import { SDQLString, SDQL_Name } from "@snickerdoodlelabs/objects";
import { avalance3SchemaStr } from "./avalanche3.data";

const schema = SDQLSchema.fromString(SDQLString(avalance3SchemaStr));
class QueryObjectFactoryMocks {
  factory(): IQueryObjectFactory {
    return new QueryObjectFactory();
  }
}

describe("test balance query parsing", () => {
  const factory = new QueryObjectFactoryMocks().factory();
  test("q4 should have networkId 43114 and no conditions", () => {
    const name = "q4";
    const balanceSchemma = schema.getQuerySchema()[name];
    const query = factory.toBalanceQuery(SDQL_Name(name), balanceSchemma);
    // console.log(query);
    expect(query.networkId).toEqual(43114);
    expect(query.conditions.length).toEqual(0);
  });

  test("q5 should have networkId 1 and and one ge (10) condition ", () => {
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
    const name = "q6";
    const balanceSchemma = schema.getQuerySchema()[name];
    const query = factory.toBalanceQuery(SDQL_Name(name), balanceSchemma);
    // console.log(query);
    expect(query.networkId).toEqual(null);
    expect(query.conditions.length).toEqual(0);
  });
});
