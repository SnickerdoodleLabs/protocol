import { AST_Contract } from "@query-parser/interfaces/objects/AST_Contract.js";
import { AST_Web3Query } from "@query-parser/interfaces/objects/AST_Web3Query.js";
import {
  EVMChainCode,
  EWalletDataType,
  ISDQLQueryClause,
  ESDQLQueryReturn,
  SDQL_Name,
  MissingWalletDataTypeError,
} from "@snickerdoodlelabs/objects";
import { ok, Result } from "neverthrow";

export class AST_BlockchainTransactionQuery extends AST_Web3Query {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   */
  constructor(
    name: SDQL_Name,
    readonly returnType: Exclude<
      ESDQLQueryReturn,
      ESDQLQueryReturn.Enum | ESDQLQueryReturn.List
    >,
    readonly type: "network",
    public readonly schema: ISDQLQueryClause,
    readonly chain: EVMChainCode,
    readonly contract: AST_Contract,
  ) {
    super(name, returnType, type);
  }

  getPermission(): Result<EWalletDataType, MissingWalletDataTypeError> {
    return ok(EWalletDataType.EVMTransactions);
  }

  static fromSchema(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_BlockchainTransactionQuery {
    // 1. make contract
    const contract = AST_Contract.fromSchema(schema.contract);
    const returnType = schema.return as Exclude<
      ESDQLQueryReturn,
      ESDQLQueryReturn.Enum | ESDQLQueryReturn.List
    >;
    return new AST_BlockchainTransactionQuery(
      name,
      returnType,
      "network",
      schema,
      EVMChainCode(schema.chain ?? "1"),
      contract,
    );
  }
}
