import { SDQLParser } from "@query-parser/implementations/business/SDQLParser";
import { AST_Compensation, AST_Expr, AST_Query, Command, Command_IF, ISDQLParserFactory, ISDQLParserFactoryType, ISDQLQueryWrapperFactory, ISDQLQueryWrapperFactoryType } from "@query-parser/interfaces";
import { SDQL_Name } from "@snickerdoodlelabs/objects";
import { CompensationId, DuplicateIdInSchema, IpfsCID, MissingTokenConstructorError, ParserError, QueryExpiredError, QueryFormatError, SDQLString, DataPermissions } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class SDQLQueryUtils{
    public constructor(
        
        @inject(ISDQLParserFactoryType)
        protected parserFactory: ISDQLParserFactory,
        @inject(ISDQLQueryWrapperFactoryType)
        readonly queryWrapperFactory: ISDQLQueryWrapperFactory,

    ) {}
    public getEligibleCompensations(schemaString: SDQLString, queryIds: string[]): 
    ResultAsync<CompensationId[], 
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    > {
        
        return this.parserFactory.makeParser(IpfsCID(""), schemaString)
            .andThen((parser) => {
                return parser.buildAST()
                    .andThen(() => {

                        try {

                            const queryPermissions = parser.queryIdsToDataPermissions(queryIds);

                            // console.log("queryPermissions", queryPermissions.getFlags());
    
                            // now queryPermissions must contain the permission for each compensation expr for eligibility
    
                            const eligibleComIds = new Set<CompensationId>();
    
                            // console.log("logicPermissions", parser.returnPermissions);
                            // console.log("compensationPermissions", parser.compensationPermissions);
                            const expressions = Array.from(parser.compensationPermissions.keys());
    
                            for (const compExpr of expressions) {
                                // console.log(`compExpr`, compExpr);
                                const comPermissions = parser.compensationPermissions.get(compExpr);
                                // console.log(`${compExpr} comPermissions`, comPermissions!.getFlags());
                                if (queryPermissions.contains(comPermissions!)) {
                                    const comAst = parser.logicCompensations.get(compExpr);
                                    // const compensationId = this.extractCompensationIdFromAst(comAst!)
                                    // eligibleComIds.add(compensationId);
                                    const comIds = this.extractCompensationIdFromAstWithAlternatives(comAst!);
                                    comIds.forEach((comId) => {
                                        eligibleComIds.add(comId);
                                    })
                                }
                            }
                            return okAsync(Array.from(eligibleComIds.values()));

                        } catch (e) {
                            return errAsync(e as QueryFormatError);
                        }
                    })
            });

    }

    public extractCompensationIdFromAst(ast: AST_Expr | Command): CompensationId  {

        // console.log("extractCompensationIdFromAst: ast", ast);
        const compensationAst = this.getCompensationAstFromAst(ast);
        return CompensationId(compensationAst.name as string);
    }

    public extractCompensationIdFromAstWithAlternatives(ast: AST_Expr | Command): Set<CompensationId>  {

        // console.log("extractCompensationIdFromAst: ast", ast);
        const comIds = new Set<CompensationId>();
        const compensationAst = this.getCompensationAstFromAst(ast);
        comIds.add(CompensationId(compensationAst.name as string));
        for (const altId of compensationAst.alternatives) {
            comIds.add(altId);
        }

        return comIds;
    }

    public getCompensationAstFromAst(ast: AST_Expr | Command): AST_Compensation {

        switch (ast.constructor) {
            case Command_IF:
                return this.getCompensationAstFromAst((ast as Command_IF).trueExpr);
            case AST_Compensation:
                return ast as AST_Compensation;
            default:
                console.error("getCompensationAstFromAst: Unknown expression to extract compensation from.", ast);
                throw new QueryFormatError("Unknown expression to extract compensation from.");

        }

    }


    public getPermittedQueryIdsFromSchemaString(schemaString: SDQLString, givenPermissions: DataPermissions): ResultAsync<string[], 
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    > {

        return this.parserFactory.makeParser(IpfsCID(""), schemaString)
            .andThen((parser) => {
                return parser.buildAST()
                    .andThen(() => {
                        return this.getPermittedQueryIds(parser, givenPermissions);
                    })
            });
    }

    public getPermittedQueryIds(parser: SDQLParser, givenPermissions: DataPermissions): ResultAsync<string[], 
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    > {

        // for each query, check if permission is given
        const checks: ResultAsync<SDQL_Name | null, never> [] = [];
        for (const [queryId, query] of parser.queries) {
            checks.push(this.queryIdIfPermitted(query, givenPermissions));
        }

        return ResultUtils.combine(checks)
            .andThen((resultIds) => {
                return okAsync(
                    resultIds.reduce<string[]>((acc, next)=>{
                        if (next != null) {
                            acc.push(next);
                        }
                        return acc;
                    }, [])
                );
            })
        
    }

    public queryIdIfPermitted(query:AST_Query, givenPermissions: DataPermissions): ResultAsync<SDQL_Name | null, never> {
        return okAsync(null);
    }
}