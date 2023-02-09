import { AST_BalanceQuery, AST_BlockchainTransactionQuery, AST_NftQuery, AST_PropertyQuery } from "@query-parser/interfaces/objects";
import { Condition } from "@query-parser/interfaces/objects/condition";
import { SDQL_Name } from "@snickerdoodlelabs/objects";

export interface IQueryObjectFactory {

  parseConditions(schema: any): Array<Condition>;
  toBlockchainTransactionQuery(name: SDQL_Name, schema: any): AST_BlockchainTransactionQuery;
  toNftQuery(name : SDQL_Name, schema: any) : AST_NftQuery;
  toPropertyQuery(name: SDQL_Name, schema: any): AST_PropertyQuery;
  toBalanceQuery(name: SDQL_Name, schema: any): AST_BalanceQuery;
  
}


export const IQueryObjectFactoryType = Symbol.for("IQueryObjectFactory");
