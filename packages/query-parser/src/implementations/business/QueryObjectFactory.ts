import {
  ChainId,
  SDQL_Name,
  SDQL_OperatorName,
} from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import "reflect-metadata";

import {
  AST_BalanceQuery,
  AST_BlockchainTransactionQuery,
  AST_PropertyQuery,
  IQueryObjectFactory,
  Condition,
  ConditionG,
  ConditionGE,
  ConditionIn,
  ConditionL,
  AST_NftQuery,
} from "@query-parser/interfaces/index.js";

@injectable()
export class QueryObjectFactory implements IQueryObjectFactory {
  public toNftQuery(name: SDQL_Name, schema: any): AST_NftQuery {
    throw new Error("toNftQuery is not implemented");
  }
  public parseConditions(schema: any): Array<Condition> {
    const conditions = new Array<Condition>();

    for (const conditionName in schema) {
      const opName = SDQL_OperatorName(conditionName);
      const rightOperand = schema[conditionName];
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

  public toBlockchainTransactionQuery(
    name: SDQL_Name,
    schema: any,
  ): AST_BlockchainTransactionQuery {
    throw new Error("toBlockchainTransactionQuery is not implemented");
  }
  public toPropertyQuery(name: SDQL_Name, schema: any): AST_PropertyQuery {
    throw new Error("toPropertyQuery is not implemented");
  }

  public toBalanceQuery(name: SDQL_Name, schema: any): AST_BalanceQuery {
    let conditions = new Array<Condition>();
    if (schema.conditions) {
      conditions = this.parseConditions(schema.conditions);
    }

    let networkId: ChainId | null = null;
    if (schema.networkid != "*") {
      networkId = ChainId(parseInt(schema.networkid));
    }

    return new AST_BalanceQuery(name, schema.return, networkId, conditions);
  }
}
