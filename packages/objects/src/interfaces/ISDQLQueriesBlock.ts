import { ISDQLQueryClause } from "@objects/interfaces/ISDQLQueryClause.js";

export interface ISDQLQueriesBlock {
  [queryId: string]: ISDQLQueryClause;
}
