import {
  EWalletDataType,
  ISDQLQueryClause,
  ESDQLQueryReturn,
  SDQL_Name,
  MissingWalletDataTypeError,
} from "@snickerdoodlelabs/objects";
import { ok, Result } from "neverthrow";

import { AST_Web3Query } from "@query-parser/interfaces/objects/AST_Web3Query.js";

export class AST_Web3AccountQuery extends AST_Web3Query {
  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn.Object,
    readonly type: "web3_account",
    public readonly schema: ISDQLQueryClause,
  ) {
    super(name, returnType, type);
  }

  getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    return ok(EWalletDataType.AccountSize);
  }
}
