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

    extractPermittedQueryIdsByDataPermissions(
        parser: SDQLParser, dataPermissions: DataPermissions
    ): ResultAsync<
        string[], 
        QueryFormatError 
        | ParserError 
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

    getCompensationIdsByPermittedQueryIds(
        parser: SDQLParser,
        permittedQueryIds: string[]
    ): CompensationId[];
}


export const ISDQLQueryUtilsType = Symbol.for(
    "ISDQLQueryUtils",
);
  