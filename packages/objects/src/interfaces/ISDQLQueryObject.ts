// TODO: This is where Zara's definition will come in. This file should contain all the relevant
// interfaces from the JSON schema of the query

import { UnixTimestamp } from "@objects/primitives";

export interface ISDQLQueryObject {
  timestamp: UnixTimestamp;
  queries: Array<ISDQLClause>;
}

export interface ISDQLClause {}
