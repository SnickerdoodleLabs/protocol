import {
  AccountIndexingError,
  AjaxError,
  BlockchainCommonErrors,
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentError,
  ConsentFactoryContractError,
  DuplicateIdInSchema,
  EQueryProcessingStatus,
  EvalNotImplementedError,
  EvaluationError,
  EVMContractAddress,
  IDynamicRewardParameter,
  InvalidParametersError,
  InvalidStatusError,
  IpfsCID,
  IPFSError,
  IQueryPermissions,
  MethodSupportError,
  MissingASTError,
  MissingTokenConstructorError,
  MissingWalletDataTypeError,
  ParserError,
  PersistenceError,
  QueryExpiredError,
  QueryFormatError,
  QueryStatus,
  RequestForData,
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
    | ConsentContractError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | QueryFormatError
    | QueryExpiredError
    | ServerRewardError
    | ConsentContractError
    | ConsentError
    | IPFSError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
    | BlockchainCommonErrors
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  >;

  approveQuery(
    queryCID: IpfsCID,
    rewardParameters: IDynamicRewardParameter[],
    queryPermissions: IQueryPermissions | null,
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | PersistenceError
    | InvalidStatusError
    | InvalidParametersError
    | ConsentContractError
    | BlockchainCommonErrors
    | EvaluationError
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

  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, PersistenceError>;

  getQueryStatuses(
    contractAddress?: EVMContractAddress,
    statuses?: EQueryProcessingStatus[],
    blockNumber?: BlockNumber,
  ): ResultAsync<
    QueryStatus[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
  >;

  getQueryStatusesByContractAddress(
    contractAddress: EVMContractAddress,
  ): ResultAsync<
    QueryStatus[],
    | BlockchainProviderError
    | PersistenceError
    | UninitializedError
    | ConsentFactoryContractError
    | IPFSError
    | AjaxError
    | ConsentContractError
    | ConsentError
    | QueryFormatError
    | EvaluationError
    | QueryExpiredError
    | BlockchainCommonErrors
    | ServerRewardError
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
    | EvalNotImplementedError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
    | InvalidStatusError
  >;
}

export const IQueryServiceType = Symbol.for("IQueryService");
