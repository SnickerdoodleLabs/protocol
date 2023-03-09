// This is where Zara's definition will come in. This file should contain all the relevant
// interfaces from the JSON schema of the query
import { AdContent } from "@objects/businessObjects";
import { ESDQLQueryReturn } from "@objects/enum";
import {
  AccountAddress,
  ChainId,
  CompensationId,
  EVMContractAddress,
  IpfsCID,
  URLString,
  AdKey,
  UnixTimestamp,
  EAdDisplayType,
  ISO8601DateString,
  QueryTypes,
} from "@objects/primitives";

export interface ISDQLQueryObject {
  version: string;
  timestamp: ISO8601DateString;
  expiry: ISO8601DateString;
  description: string;
  business: string;
  ads: ISDQLAdsBlock;
  queries: {
    [queryId: string]: ISDQLQueryClause;
  };
  returns: {
    [returnsObject: string]: ISDQLReturnProperties;
    // issue on why this is any, documented here
    //https://github.com/Microsoft/TypeScript/issues/10042
    url;
  };
  compensations: ISDQLCompensationBlock;
  logic: ISDQLLogicObjects;
}
export interface ISDQLQueryClause {
  name: string;
  return: ESDQLQueryReturn;
  chain?: string;
  networkid?: string | string[];
  address?: string | string[];
  timestampRange?: ISDQLTimestampRange;
  contract?: ISDQLQueryContract;
  conditions?: ISDQLQueryConditions;
  enum_keys?: string[];
  object_schema?: ISDQLObjectSchema;
  patternProperties ?: Record<string, unknown>;
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
  timestampRange: ISDQLTimestampRange;
}

export interface ISDQLTimestampRange {
  start: number | string;
  end: number | string;
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

export interface ISDQLAdsBlock {
  [index: AdKey]: ISDQLAd;
}

export interface ISDQLAd {
  name: string;
  content: AdContent;
  text: string | null;
  displayType: EAdDisplayType;
  weight: number;
  expiry: UnixTimestamp;
  keywords: string[];
}

export interface ISDQLCompensationBlock {
  [index: CompensationId]: ISDQLCompensationParameters | ISDQLCompensations;
  parameters: ISDQLCompensationParameters;
}

export interface ISDQLCompensations {
  name: string;
  image: IpfsCID | URLString | null;
  description: string;
  chainId: ChainId;
  callback: ISDQLCallback;
  alternatives?: CompensationId[];
}

export interface ISDQLCallback {
  parameters: string[];
  data: Record<string, unknown>;
}

export interface ISDQLCompensationParameters {
  [paramName: string]: unknown & {
    //a param can have other properties that we don't know of
    type: unknown;
    required: boolean;
    values?: unknown[];
  }; // TODO composition with unknowns?

  recipientAddress: {
    type: AccountAddress;
    required: boolean;
  };
}

export interface ISDQLLogicObjects {
  returns: string[];
  ads: string[];
  compensations: string[];
}
