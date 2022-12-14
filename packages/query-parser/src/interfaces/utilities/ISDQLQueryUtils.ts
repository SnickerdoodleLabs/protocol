import { SDQLParser } from "@query-parser/implementations";
import { ResultAsync } from "neverthrow";
import { 
    CompensationId, 
    DuplicateIdInSchema, 
    MissingTokenConstructorError, 
    ParserError, 
    QueryExpiredError, 
    QueryFormatError, 
    SDQLString, 
    DataPermissions,
    ISDQLCompensations
} from "@snickerdoodlelabs/objects";

export interface ISDQLQueryUtils {
    
    getEligibleCompensations(schemaString: SDQLString, queryIds: string[]): 
    ResultAsync<CompensationId[], 
    | ParserError 
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    >;

    getPermittedQueryIdsFromSchemaString(schemaString: SDQLString, givenPermissions: DataPermissions): ResultAsync<string[], 
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    >;

    getPermittedQueryIds(parser: SDQLParser, givenPermissions: DataPermissions): ResultAsync<string[], 
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    >;

    extractPermittedQueryIdsAndExpectedCompensationBlocks(
        schemaString: SDQLString, dataPermissions: DataPermissions
    ): ResultAsync<
        [string[], Map<string, ISDQLCompensations>], 
        QueryFormatError 
        | ParserError 
        | DuplicateIdInSchema 
        | MissingTokenConstructorError 
        | QueryExpiredError
    >;
}


export const ISDQLQueryUtilsType = Symbol.for(
    "ISDQLQueryUtils",
);
  