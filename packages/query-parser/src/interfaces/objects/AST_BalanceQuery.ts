import {
  ChainId,
  ESDQLQueryReturn,
  EWalletDataType,
  MissingWalletDataTypeError,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { Result, ok } from "neverthrow";

import { Condition } from "@query-parser/interfaces/objects/condition/index.js";
import { AST_Web3Query } from "@query-parser/interfaces/objects/AST_Web3Query.js";

export class AST_BalanceQuery extends AST_Web3Query {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   * @param networkId - null for wildcard, value for a single chain
   */
  constructor(
    public name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn.Array,
    readonly type: "balance",
    readonly networkId: ChainId | null,
    readonly conditions: Array<Condition>,
  ) {
    super(name, returnType, type);
  }

  getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    return ok(EWalletDataType.AccountBalances);
  }
}
