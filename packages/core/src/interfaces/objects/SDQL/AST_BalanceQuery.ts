import { ChainId, EVMChainCode, SDQL_Name } from "@snickerdoodlelabs/objects";

import { Condition, ConditionG, ConditionGE, ConditionIn, ConditionL } from "@core/interfaces/objects/SDQL/condition";
import { AST_Contract } from "./AST_Contract";
import { AST_Query } from "./AST_Query";

export class AST_BalanceQuery extends AST_Query {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   * @param networkId - null for wildcard, value for a single chain
   */
  constructor(
    name: SDQL_Name,
    readonly returnType: "array",
    readonly networkId: ChainId | null,
    readonly conditions: Array<Condition>,
  ) {
    super(name, returnType);
  }
}
