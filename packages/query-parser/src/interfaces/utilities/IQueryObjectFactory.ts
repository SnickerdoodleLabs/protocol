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
} from "@query-parser/interfaces/objects";
import { Condition } from "@query-parser/interfaces/objects/condition/index.js";

export interface IQueryObjectFactory {
  parseConditions(queryConditions: ISDQLQueryConditions): Array<Condition>;
  toWeb3Query(
    name: SDQL_Name,
    type: Web3QueryTypes,
    schema: ISDQLQueryClause,
  ): AST_BlockchainTransactionQuery | AST_NftQuery;
  toBlockchainTransactionQuery(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_BlockchainTransactionQuery;
  toNftQuery(name: SDQL_Name, schema: ISDQLQueryClause): AST_NftQuery;
  toPropertyQuery(name: SDQL_Name, schema: ISDQLQueryClause): AST_PropertyQuery;
  toBalanceQuery(name: SDQL_Name, schema: ISDQLQueryClause): AST_BalanceQuery;
}
export const IQueryObjectFactoryType = Symbol.for("IQueryObjectFactory");
