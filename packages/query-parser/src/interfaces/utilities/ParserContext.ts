import { SDQL_Return } from "@snickerdoodlelabs/objects";

import {
  AST_Ad,
  AST_Compensation,
  AST_Expr,
  AST_Insight,
  AST_SubQuery,
} from "@query-parser/interfaces/objects";

export type ParserContextDataTypes =
  | AST_SubQuery
  | string
  | number
  | boolean
  | Map<string, Set<AST_SubQuery>>
  | AST_Compensation
  | AST_Ad
  | AST_Expr
  | AST_Insight;

export type ConditionOperandTypes =
  | string
  | number
  | boolean
  | AST_Expr
  | SDQL_Return
  | Array<string | number>
  | AST_Insight
  | AST_SubQuery;

export type IfOperandTypes = AST_Expr | null;
