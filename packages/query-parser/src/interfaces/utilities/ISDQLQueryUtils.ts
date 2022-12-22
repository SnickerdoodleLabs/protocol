import { SDQLParser } from "@query-parser/implementations";
import { ResultAsync } from "neverthrow";
import { 
    CompensationIdentifier, 
    DuplicateIdInSchema, 
    MissingTokenConstructorError, 
    ParserError, 
    QueryExpiredError, 
    QueryFormatError, 
    SDQLString, 
    DataPermissions,
    ISDQLCompensations,
    QueryIdentifier
} from "@snickerdoodlelabs/objects";

export interface ISDQLQueryUtils {
    
    getEligibleCompensations(schemaString: SDQLString, queryIds: QueryIdentifier[]): 
    ResultAsync<CompensationIdentifier[], 
    | ParserError 
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    >;

    extractPermittedQueryIdsFromParser(
        parser: SDQLParser, dataPermissions: DataPermissions
    ): ResultAsync<
    QueryIdentifier[], 
        QueryFormatError 
        | ParserError 
        | MissingTokenConstructorError 
        | QueryExpiredError
    >;

    getPermittedQueryIdsFromSchemaString(schemaString: SDQLString, givenPermissions: DataPermissions): ResultAsync<QueryIdentifier[], 
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    >;

    getPermittedQueryIds(parser: SDQLParser, givenPermissions: DataPermissions): ResultAsync<QueryIdentifier[], 
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
    >;

    getCompensationIdsByPermittedQueryIds(
        parser: SDQLParser,
        permittedQueryIds: QueryIdentifier[]
    ): CompensationIdentifier[];
}


export const ISDQLQueryUtilsType = Symbol.for(
    "ISDQLQueryUtils",
);
  