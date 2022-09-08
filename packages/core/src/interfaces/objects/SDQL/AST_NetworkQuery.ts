import { EVMChainCode, SDQL_Name } from "@snickerdoodlelabs/objects";

import { AST_Contract } from "./AST_Contract.js";
import { AST_Query } from "./AST_Query.js";

export class AST_NetworkQuery extends AST_Query {
  /**
   * @param name - the key of the query from schema, e.g., q1, q2, a3 ...
   */
  constructor(
    name: SDQL_Name,
    readonly returnType: "string" | "boolean" | "integer" | "number" | "array" | "object",
    readonly chain: EVMChainCode,
    readonly contract: AST_Contract,
  ) {
    super(name, returnType);
  }

  static fromSchema(name: SDQL_Name, schema: any): AST_NetworkQuery {
    // 1. make contract
    const contract = AST_Contract.fromSchema(schema.contract);

    return new AST_NetworkQuery(
      name,
      schema.return,
      EVMChainCode(schema.chain),
      contract,
    );
  }
}
