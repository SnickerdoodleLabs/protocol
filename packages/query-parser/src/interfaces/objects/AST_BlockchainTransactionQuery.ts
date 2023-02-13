import {
  EVMChainCode,
  ISDQLQueryClause,
  ISDQLQueryReturnEnum,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";

import { AST_Contract } from "@query-parser/interfaces/objects/AST_Contract.js";
import { AST_Web3Query } from "@query-parser/interfaces/objects/AST_Web3Query.js";

export class AST_BlockchainTransactionQuery extends AST_Web3Query {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   */
  constructor(
    name: SDQL_Name,
    readonly returnType: Exclude<
      ISDQLQueryReturnEnum,
      ISDQLQueryReturnEnum.ENUM | ISDQLQueryReturnEnum.LIST
    >,
    readonly type: "blockchain_transactions",
    public readonly schema: ISDQLQueryClause,
    readonly chain: EVMChainCode,
    readonly contract: AST_Contract,
  ) {
    super(name, returnType, type, schema);
  }

  static fromSchema(
    name: SDQL_Name,
    schema: any,
  ): AST_BlockchainTransactionQuery {
    // 1. make contract
    const contract = AST_Contract.fromSchema(schema.contract);

    return new AST_BlockchainTransactionQuery(
      name,
      schema.return,
      "blockchain_transactions",
      schema,
      EVMChainCode(schema.chain),
      contract,
    );
  }
}
