import { SDQL_Return } from "@snickerdoodlelabs/objects";

import {
  AST_Ad,
  AST_Compensation,
  AST_CompensationExpr,
  AST_Expr,
  AST_Query,
  AST_ReturnExpr,
} from "@query-parser/interfaces/objects";

export type ParserContextDataTypes =
  | AST_Query
  | string
  | number
  | boolean
  | Map<string, Set<AST_Query>>
  | AST_ReturnExpr
  | AST_Compensation
  | AST_Ad
  | AST_Expr;

export type ConditionOperandTypes =
  | string
  | number
  | boolean
  | AST_Expr
  | SDQL_Return
  | Array<string | number>;

export type IfOperandTypes = AST_ReturnExpr | AST_CompensationExpr | null;
