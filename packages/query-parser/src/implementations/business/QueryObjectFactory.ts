import {
  ChainId,
  ESDQLQueryReturn,
  ISDQLQueryClause,
  ISDQLQueryConditions,
  SDQL_Name,
  SDQL_OperatorName,
  Web3QueryTypes,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import "reflect-metadata";

import {
  AST_BalanceQuery,
  AST_BlockchainTransactionQuery,
  AST_NftQuery,
  AST_PropertyQuery,
  Condition,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  IQueryObjectFactory,
} from "@query-parser/interfaces/index.js";

@injectable()
export class QueryObjectFactory implements IQueryObjectFactory {
  public parseConditions(
    queryConditions: ISDQLQueryConditions,
  ): Array<Condition> {
    const conditions = new Array<Condition>();

    for (const conditionName in queryConditions) {
      const opName = SDQL_OperatorName(conditionName);
      const rightOperand = queryConditions[conditionName];
      switch (conditionName) {
        case "ge":
          conditions.push(new ConditionGE(opName, null, Number(rightOperand)));
          break;
        case "l":
          conditions.push(new ConditionL(opName, null, Number(rightOperand)));
          break;
        case "in":
          conditions.push(
            new ConditionIn(opName, null, rightOperand as Array<any>),
          );
          break;
        case "g":
          conditions.push(new ConditionG(opName, null, Number(rightOperand)));
          break;
      }
    }

    return conditions;
  }

  public toWeb3Query(
    name: SDQL_Name,
    type: Web3QueryTypes,
    schema: ISDQLQueryClause,
  ): AST_NftQuery | AST_BlockchainTransactionQuery {
    switch (type) {
      case "network":
        return this.toBlockchainTransactionQuery(name, schema);
      case "nft":
        return this.toNftQuery(name, schema);
    }
  }

  public toNftQuery(name: SDQL_Name, schema: ISDQLQueryClause): AST_NftQuery {
    return AST_NftQuery.fromSchema(name, schema);
  }

  public toBlockchainTransactionQuery(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_BlockchainTransactionQuery {
    return AST_BlockchainTransactionQuery.fromSchema(name, schema);
  }
  public toPropertyQuery(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_PropertyQuery {
    throw new Error("toPropertyQuery is not implemented");
  }

  public toBalanceQuery(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_BalanceQuery {
    let conditions = new Array<Condition>();
    if (schema.conditions) {
      conditions = this.parseConditions(schema.conditions);
    }

    let networkId: ChainId | null = null;
    if (
      schema.networkid &&
      schema.networkid != "*" &&
      !Array.isArray(schema.networkid)
    ) {
      networkId = ChainId(parseInt(schema.networkid));
    }

    return new AST_BalanceQuery(
      name,
      ESDQLQueryReturn.Array,
      networkId,
      conditions,
    );
  }
}
