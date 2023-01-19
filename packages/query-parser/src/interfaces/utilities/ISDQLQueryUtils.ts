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
    QueryFilteredByPermissions,
    QueryIdentifier
} from "@snickerdoodlelabs/objects";

export interface ISDQLQueryUtils {
    
    getEligibleCompensations(
        schemaString: SDQLString, queryIds: QueryIdentifier[]
    ): ResultAsync<CompensationId[], 
        | ParserError 
        | DuplicateIdInSchema
        | QueryFormatError
        | MissingTokenConstructorError
        | QueryExpiredError
    >;

    getPermittedQueryIdsFromSchemaString(
        schemaString: SDQLString, 
        givenPermissions: DataPermissions
    ): ResultAsync<QueryIdentifier[], 
        | ParserError
        | DuplicateIdInSchema
        | QueryFormatError
        | MissingTokenConstructorError
        | QueryExpiredError
    >;

    getPermittedQueryIds(
        parser: SDQLParser, 
        givenPermissions: DataPermissions
    ): ResultAsync<QueryIdentifier[], 
        | ParserError
        | DuplicateIdInSchema
        | QueryFormatError
        | MissingTokenConstructorError
        | QueryExpiredError
    >;

    filterQueryByPermissions(
        schemaString: SDQLString, 
        dataPermissions: DataPermissions
    ): ResultAsync<
        QueryFilteredByPermissions, 
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
  