import {
  ISDQLQueryClause,
  ISDQLQueryReturnEnum,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";
import { AST_Web3Query } from "@query-parser/interfaces/objects/AST_Web3Query.js";

export class AST_NftQuery extends AST_Web3Query {
  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ISDQLQueryReturnEnum.ARRAY,
    readonly type: "nft",
    public readonly schema: ISDQLQueryClause,
  ) {
    super(name, returnType, type, schema);
  }

  static fromWeb3Query(query: AST_Web3Query) {
    const { name, schema } = query;
    return new AST_NftQuery(name, ISDQLQueryReturnEnum.ARRAY, "nft", schema);
  }
  // abstract serialize (): JSON;
}
