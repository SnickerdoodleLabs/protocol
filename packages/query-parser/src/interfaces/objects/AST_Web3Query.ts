import {
  ESDQLQueryReturn,
  SDQL_Name,
  Web3QueryTypes,
  web3QueryTypes,
} from "@snickerdoodlelabs/objects";
import { AST_SubQuery } from "@query-parser/index.js";

export abstract class AST_Web3Query extends AST_SubQuery {
  constructor(
    readonly name: SDQL_Name,
    readonly returnType: ESDQLQueryReturn,
    public readonly type: Web3QueryTypes,
  ) {
    super(name, returnType);
  }

  static getWeb3QueryTypeIfValidQueryType(
    queryType: string,
  ): Web3QueryTypes | undefined {
    return web3QueryTypes.find((validType) => {
      return validType === queryType;
    });
  }

  // abstract serialize (): JSON;
}
