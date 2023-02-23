import { SDQL_Name } from "@snickerdoodlelabs/objects";

import {
  AST_BalanceQuery,
  AST_NetworkQuery,
  AST_PropertyQuery,
} from "@query-parser/interfaces/objects";
import { Condition } from "@query-parser/interfaces/objects/condition";

export interface IQueryObjectFactory {
  parseConditions(schema: any): Array<Condition>;
  toNetworkQuery(name: SDQL_Name, schema: any): AST_NetworkQuery;
  toPropertyQuery(name: SDQL_Name, schema: any): AST_PropertyQuery;
  toBalanceQuery(name: SDQL_Name, schema: any): AST_BalanceQuery;
}

export const IQueryObjectFactoryType = Symbol.for("IQueryObjectFactory");
