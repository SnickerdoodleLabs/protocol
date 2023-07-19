import {
  AjaxError,
  BlockchainCommonErrors,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  DuplicateIdInSchema,
  EvaluationError,
  EVMContractAddress,
  IDynamicRewardParameter,
  IPFSError,
  MissingASTError,
  MissingTokenConstructorError,
  MissingWalletDataTypeError,
  ParserError,
  PersistenceError,
  QueryExpiredError,
  QueryFormatError,
  RequestForData,
  SDQLQuery,
  ServerRewardError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IQueryService {
  initialize(): ResultAsync<void, never>;
  onQueryPosted(
    requestForData: RequestForData,
  ): ResultAsync<
    void,
    | EvaluationError
    | PersistenceError
    | AjaxError
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ServerRewardError
    | ConsentError
    | IPFSError
    | BlockchainCommonErrors
    | QueryFormatError
    | ParserError
    | QueryExpiredError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
  >;

  approveQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    parameters: IDynamicRewardParameter[],
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | PersistenceError
  >;

  returnQueries(): ResultAsync<
    void,
    | PersistenceError
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | ConsentError
    | EvaluationError
    | QueryFormatError
    | AjaxError
    | BlockchainCommonErrors
  >;
}

export const IQueryServiceType = Symbol.for("IQueryService");
