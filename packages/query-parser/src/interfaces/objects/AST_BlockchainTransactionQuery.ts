import {
  EVMChainCode,
  EWalletDataType,
  ISDQLQueryClause,
  ESDQLQueryReturn,
  SDQL_Name,
  MissingWalletDataTypeError,
  DataPermissions,
  IpfsCID,
} from "@snickerdoodlelabs/objects";
import { ok, Result } from "neverthrow";

import { AST_Contract } from "@query-parser/interfaces/objects/AST_Contract.js";
import { AST_Web3Query } from "@query-parser/interfaces/objects/AST_Web3Query.js";

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
    readonly type: "network" | "chain_transactions",
    public readonly schema: ISDQLQueryClause,
    readonly chain?: EVMChainCode,
    readonly contract?: AST_Contract,
  ) {
    super(name, returnType, type);
  }

  getPermission(
    permissions: DataPermissions,
    dataType: EWalletDataType | IpfsCID,
  ): boolean {
    return permissions.checkPermission(dataType);
  }

  static fromSchema(
    name: SDQL_Name,
    schema: ISDQLQueryClause,
  ): AST_BlockchainTransactionQuery {
    const returnType = schema.return as Exclude<
      ESDQLQueryReturn,
      ESDQLQueryReturn.Enum | ESDQLQueryReturn.List
    >;
    if (schema.name === "chain_transactions") {
      return new AST_BlockchainTransactionQuery(
        name,
        returnType,
        "chain_transactions",
        schema,
      );
    } else {
      const contract = AST_Contract.fromSchema(schema.contract);
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
}
