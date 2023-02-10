import { EWalletDataType, ISDQLQueryClause, ISDQLQueryContract, MissingWalletDataTypeError, SDQL_Name } from "@snickerdoodlelabs/objects";
import { AST_Query } from "@query-parser/interfaces/objects/AST_Query.js";




export  class AST_Web3Query extends AST_Query{

  constructor(
    readonly name: SDQL_Name,
    readonly returnType:
      | "string"
      | "boolean"
      | "integer"
      | "number"
      | "list"
      | "array"
      | "object"
      | "enum",
      public readonly type:Web3QueryTypes,
      public readonly schema : ISDQLQueryClause,
      
  ) {
    super(name , returnType);
  }

  static checkWeb3Query(queryType : string) : Web3QueryTypes | undefined{
    return web3QueryTypes.find( (validType) => { return validType === queryType } )
  }

  static fromSchema(name: SDQL_Name, schema: ISDQLQueryClause, type : Web3QueryTypes){
    return new AST_Web3Query(name , schema.return , type ,schema);  
  }

  // TODO , all permissions should have a separate logic
  static getPermission(type : Web3QueryTypes) :  EWalletDataType{
    switch (type) {
      case "nft":
        return EWalletDataType.AccountNFTs;
      case "blockchain_transactions":
        return EWalletDataType.EVMTransactions;
      default:
        break;
    }
   
    throw new MissingWalletDataTypeError(`unrecognized web3 query :${type}`); 
    
  }

  // abstract serialize (): JSON;
}

const web3QueryTypes = ['nft', 'blockchain_transactions'] as const;
type Web3QueryTypes = typeof web3QueryTypes[number];