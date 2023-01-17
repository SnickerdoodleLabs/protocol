import { AST_Ad, AST_Compensation, AST_Expr, AST_Query, AST_ReturnExpr } from "@query-parser/interfaces/objects";

export type ParserContextDataTypes = AST_Query 
                                    | string 
                                    | number 
                                    | boolean 
                                    | Map<string, Set<AST_Query>> 
                                    | AST_ReturnExpr 
                                    | AST_Compensation
                                    | AST_Ad
                                    | AST_Expr
