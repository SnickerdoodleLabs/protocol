import {
  ISDQLQueryClause,
  ISDQLQueryConditions,
  SDQL_Name,
  Web3QueryTypes,
} from "@snickerdoodlelabs/objects";

import {
  AST_BalanceQuery,
  AST_BlockchainTransactionQuery,
  AST_NftQuery,
  AST_PropertyQuery,
  AST_Web3AccountQuery,
  AST_Web3Query,
} from "@query-parser/interfaces/objects";
import { Condition } from "@query-parser/interfaces/objects/condition/index.js";

export interface IQueryObjectFactory {
  parseConditions(queryConditions: ISDQLQueryConditions): Array<Condition>;
  toWeb3Query(
    name: SDQL_Name,
    type: Web3QueryTypes,
    schema: ISDQLQueryClause,
  ): AST_Web3Query;
  toBlockchainTransactionQuery(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_BlockchainTransactionQuery;
  toNftQuery(name: SDQL_Name, schema: ISDQLQueryClause): AST_NftQuery;
  toPropertyQuery(name: SDQL_Name, schema: ISDQLQueryClause): AST_PropertyQuery;
  toBalanceQuery(name: SDQL_Name, schema: ISDQLQueryClause): AST_BalanceQuery;
  toWeb3AccountQuery(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_Web3AccountQuery;
}
export const IQueryObjectFactoryType = Symbol.for("IQueryObjectFactory");
