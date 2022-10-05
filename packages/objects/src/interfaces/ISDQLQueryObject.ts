// This is where Zara's definition will come in. This file should contain all the relevant
// interfaces from the JSON schema of the query
import {
  AccountAddress,
  ChainId,
  CompensationId,
  EVMContractAddress, URLString
} from "@objects/primitives";
import { ISO8601DateString } from "@objects/primitives/ISO8601DateString";
export interface ISDQLQueryObject {
  version: string;
  timestamp: ISO8601DateString;
  expiry: ISO8601DateString;
  description: string;
  business: string;
  queries: {
    [queryId: string]: ISDQLQueryClause;
  };
  returns: {
    [returnsObject: string]: ISDQLReturnProperties;
    // issue on why this is any, documented here
    //https://github.com/Microsoft/TypeScript/issues/10042
    url;
  };
  compensations: {
    [index: string | CompensationId]: ISDQLCompensationParameters | ISDQLCompensations;
    parameters: ISDQLCompensationParameters;
  };
  logic: ISDQLLogicObjects;
}
export interface ISDQLQueryClause {
  name: string;
  return: string;
  chain?: string;
  contract?: ISDQLQueryContract;
  conditions?: ISDQLQueryConditions;
  enum_keys?: string[];
  object_schema?: ISDQLObjectSchema;
}

export interface ISDQLObjectSchema {
  // These are both object types
  // They will be left as any because objects aren't defined
  properties;
  patternProperties;
}
export interface ISDQLQueryContract {
  address: EVMContractAddress;
  networkid: string;
  function: string;
  direction: string;
  token: string;
  blockrange: ISDQLBlockRange;
}

export interface ISDQLBlockRange {
  start: number;
  end: number;
}

export interface ISDQLQueryConditions {
  in: number[];
  ge: number;
  l: number;
  le: number;
  e: number;
  g: number;
  has: ISDQLHasObject;
}

export interface ISDQLHasObject {
  patternProperties: {
    [url: URLString]: number;
  };
}

export interface ISDQLReturnProperties {
  name: string;
  message?: string;
  query?: string;
}

export interface ISDQLCompensations {
  description: string;
  callback: string;
}

export interface ISDQLCompensationParameters {
  [paramName: string]: unknown & {
    type: unknown;
    required: boolean;
  } // composition with unknowns?

  recipientAddress: {
    type: AccountAddress;
    required: boolean;
    chainId: ChainId;
  }
  
}

export interface ISDQLLogicObjects {
  returns: string[];
  compensations: string[];
}
