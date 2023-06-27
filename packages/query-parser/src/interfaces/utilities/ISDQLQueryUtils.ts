import { SDQLParser } from "@query-parser/implementations";
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
  QueryIdentifier,
  QueryTypes,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface ISDQLQueryUtils {
  getEligibleCompensations(
    schemaString: SDQLString,
    queryIds: QueryIdentifier[],
  ): ResultAsync<
    CompensationId[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  >;

  getPermittedQueryIdsFromSchemaString(
    schemaString: SDQLString,
    givenPermissions: DataPermissions,
  ): ResultAsync<
    QueryIdentifier[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  >;

  getPermittedQueryIds(
    parser: SDQLParser,
    givenPermissions: DataPermissions,
  ): ResultAsync<
    QueryIdentifier[],
    | ParserError
    | DuplicateIdInSchema
    | QueryFormatError
    | MissingTokenConstructorError
    | QueryExpiredError
  >;

  filterQueryByPermissions(
    schemaString: SDQLString,
    dataPermissions: DataPermissions,
  ): ResultAsync<
    QueryFilteredByPermissions,
    | QueryFormatError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | QueryExpiredError
  >;

  getQueryTypeDependencies(
    parser: SDQLParser,
    compId: CompensationId,
  ): QueryTypes[];
}

export const ISDQLQueryUtilsType = Symbol.for("ISDQLQueryUtils");
