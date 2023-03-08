import {
  ChainId,
  EWalletDataType,
  ESDQLQueryReturn,
  SDQL_Name,
  MissingWalletDataTypeError,
} from "@snickerdoodlelabs/objects";

import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import { Condition } from "@query-parser/interfaces/objects/condition/index.js";
import { ok, Result } from "neverthrow";

export class AST_BalanceQuery extends AST_Query {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   * @param networkId - null for wildcard, value for a single chain
   */
  constructor(
    name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn.Array,
    readonly networkId: ChainId | null,
    readonly conditions: Array<Condition>,
  ) {
    super(name, returnType);
  }

  getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    return ok(EWalletDataType.AccountBalances);
  }
}
