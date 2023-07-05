import {
  EWalletDataType,
  ISDQLQueryClause,
  ESDQLQueryReturn,
  SDQL_Name,
  MissingWalletDataTypeError,
} from "@snickerdoodlelabs/objects";
import { AST_Web3Query } from "@query-parser/interfaces/objects/AST_Web3Query.js";
import { ok, Result } from "neverthrow";

export class AST_NftQuery extends AST_Web3Query {
  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn.Array,
    readonly type: "nft",
    public readonly schema: ISDQLQueryClause,
  ) {
    super(name, returnType, type);
  }

  static fromSchema(name: SDQL_Name, schema: ISDQLQueryClause): AST_NftQuery {
    return new AST_NftQuery(name, ESDQLQueryReturn.Array, "nft", schema);
  }

  getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    return ok(EWalletDataType.AccountNFTs);
  }
}
