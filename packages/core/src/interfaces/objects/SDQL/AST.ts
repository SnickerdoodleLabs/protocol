import { SDQL_Name, Version } from "@snickerdoodlelabs/objects";

import { AST_Compensation } from "./AST_Compensation";
import { AST_Logic } from "./AST_Logic";
import { AST_Query } from "./AST_Query";
import { AST_Returns } from "./AST_Returns";

export class AST {
  // version: Version;
  // description: string; //TODO
  // business: string; //TODO
  // queries: Record<SDQL_Name, AST_Query>;
  // TODO replace names with more specific brands
  // queries: Map<SDQL_Name, AST_Query>;
  // returns: AST_Returns | null;
  // compensations: Map<SDQL_Name, AST_Compensation>;
  // logic: AST_Logic;

  constructor(
    readonly version: Version,
    readonly description: string, //TODO
    readonly business: string, //TODO
    readonly queries: Map<SDQL_Name, AST_Query>,
    readonly returns: AST_Returns | null,
    readonly compensations: Map<SDQL_Name, AST_Compensation>,
    readonly logic: AST_Logic,
  ) {
    // this.queries = new Map<SDQL_Name, AST_Query>();
    // this.returns = null;
    // this.compensations = new Map<SDQL_Name, AST_Compensation>();
    // this.logic = new AST_Logic();
  }

  // addQuery(q: AST_Query): void {
  //     this.queries.set(q.name, q);
  // }

  // addReturns(returns: AST_Returns): void {
  //     this.returns = returns;
  // }

  // addCompensation(c: AST_Compensation): void {
  //     this.compensations.set(c.name, c);
  // }

  // addReturn(r: AST_Return): void {
  //     this.returns.set(r.name, r)
  // }
}
