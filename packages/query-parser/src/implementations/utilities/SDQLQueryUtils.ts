import { ISDQLParserFactory, ISDQLParserFactoryType, ISDQLQueryWrapperFactory, ISDQLQueryWrapperFactoryType } from "@query-parser/interfaces";
import { CompensationId, DuplicateIdInSchema, IpfsCID, MissingTokenConstructorError, ParserError, QueryExpiredError, QueryFormatError, SDQLString } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";

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

                        const queryPermissions = parser.queryIdsToDataPermissions(queryIds);

                        // now queryPermissions must contain the permission for each compensation expr for eligibility

                        const eligibleComIds: CompensationId[] = [];

                        for (const compExpr in parser.compensationPermissions) {
                            const comPermissions = parser.compensationPermissions[compExpr];
                            if (queryPermissions.contains(comPermissions)) {
                                const comAst = parser.logicCompensations[compExpr];
                                eligibleComIds.push(CompensationId(comAst.name as string));
                            }
                        }
                        return okAsync(eligibleComIds);
                    })
            });

    }
    // public getEligibleCompensations(schemaString: SDQLString, queryIds: string[]): 
    // ResultAsync<CompensationId[], 
    // | ParserError
    // | DuplicateIdInSchema
    // | QueryFormatError
    // | MissingTokenConstructorError
    // | QueryExpiredError
    // > {
        
    //   const schema = this.queryWrapperFactory.makeWrapper(schemaString);
    //   const compensationExpressions = schema.logic["compensations"]

    // }
}