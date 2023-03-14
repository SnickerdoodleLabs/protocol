import { AST_ReturnExpr } from "@query-parser/interfaces/objects/AST_ReturnExpr.js";
import { SDQL_Name, URLString } from "@snickerdoodlelabs/objects";

export class AST_Returns extends Map<SDQL_Name, any> {
  expressions: Map<SDQL_Name, AST_ReturnExpr> = new Map();

  constructor(readonly url: URLString) {
    super();
  }
}
