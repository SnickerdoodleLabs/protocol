// TODO: This is where Zara's definition will come in. This file should contain all the relevant
// interfaces from the JSON schema of the query

import { URLString } from "..";

export interface ISDQLQueryObject {
  "version": string;
  "description": string;
  "business": string;
  "queries": ISDQLClause;
  "returns": ISDQLClause;
  "compensations": ISDQLClause;
  "logic": ISDQLClause;

  /*
   "queries": Object;
   "returns": Object;
   "compensations": Object;
   "logic": Object;
   */
}

export interface ISDQLClause {
  "r1": Object;
  "r2": Object;
  "r3": Object;
  "url": string;

  // queries
  "name": string;
  "return": string;
  "chain": string;
  "contract": Object;
  "conditions": Object;

  // returns
  "message": string;
  "query": string;

  // compensations
  "description": string;
  "callback": URLString;

}

/*
  required: Array<String>;
  queries: Array<ISDQLClause>;
  returns: Array<ISDQLClause>;
*/