import { ESDQLQueryReturn } from "@objects/enum/ESDQLQueryReturn.js";
import { ISDQLObjectSchema } from "@objects/interfaces/ISDQLObjectSchema.js";
import { ISDQLQueryConditions } from "@objects/interfaces/ISDQLQueryConditions.js";
import { ISDQLQueryContract } from "@objects/interfaces/ISDQLQueryContract.js";
import { ISDQLTimestampRange } from "@objects/interfaces/ISDQLTimestampRange.js";

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
  patternProperties?: Record<string, unknown>;
}
