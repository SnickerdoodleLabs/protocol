import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";
import {
  Web3QueryTypes,
  web3QueryTypes,
} from "@query-parser/interfaces/objects/query-types/index.js";
import {
  EWalletDataType,
  ISDQLQueryClause,
  ESDQLQueryReturn,
  MissingWalletDataTypeError,
  SDQL_Name,
} from "@snickerdoodlelabs/objects";

export abstract class AST_Web3Query extends AST_Query {
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
