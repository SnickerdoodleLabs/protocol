import { AST_SubQuery } from "@query-parser/interfaces/objects/AST_SubQuery.js";
import { Condition } from "@query-parser/interfaces/objects/condition/index.js";
import {
  ChainId,
  ESDQLQueryReturn,
  EWalletDataType,
  MissingWalletDataTypeError,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { Result, ok } from "neverthrow";

export class AST_BalanceQuery extends AST_SubQuery {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   * @param networkId - null for wildcard, value for a single chain
   */
  constructor(
    public name: SDQL_Name,
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
