// TODO: This is where Zara's definition will come in. This file should contain all the relevant
// interfaces from the JSON schema of the query

import { URLString } from "..";

export interface ISDQLQueryObject {
  "version": string;
  "description": string;
  "business": string;
  "queries": SDQL_Queries;
  "returns": SDQL_Returns;
  "compensations": SDQL_Compensations;
  "logic": SDQL_Logic;
}

interface SDQL_Queries {
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
interface SDQL_Compensations {
}
interface SDQL_Returns {
  "url": URLString;
}
interface SDQL_Compensations {
}
interface SDQL_Logic {
  "returns": Array<string>
  "compensations": Array<string>
}

export interface ISDQLClause {
  "q1": Object;
  "q2": Object;
  "q3": Object;
  "r1": Object;
  "r2": Object;
  "r3": Object;
  "c1": Object;
  "c2": Object;
  "c3": Object;
  "returns": Array<string>;
  "compensations": Array<string>;

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