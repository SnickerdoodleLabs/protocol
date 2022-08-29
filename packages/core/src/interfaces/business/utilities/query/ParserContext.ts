import { AST_Compensation, AST_Expr, AST_Query, AST_ReturnExpr } from "@core/interfaces/objects";

export type ParserContextDataTypes = AST_Query 
                                    | string 
                                    | number 
                                    | boolean 
                                    | Map<string, Set<AST_Query>> 
                                    | AST_ReturnExpr 
                                    | AST_Compensation
                                    | AST_Expr