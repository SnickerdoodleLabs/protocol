import {
  AccountIndexingError,
  AjaxError,
  BlockchainCommonErrors,
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentError,
  ConsentFactoryContractError,
  ConsentToken,
  DuplicateIdInSchema,
  EQueryProcessingStatus,
  EvalNotImplementedError,
  EvaluationError,
  EVMContractAddress,
  EVMPrivateKey,
  IDynamicRewardParameter,
  InvalidParametersError,
  InvalidStatusError,
  IpfsCID,
  IPFSError,
  MethodSupportError,
  MissingASTError,
  MissingTokenConstructorError,
  MissingWalletDataTypeError,
  ParserError,
  PersistenceError,
  PossibleReward,
  QueryExpiredError,
  QueryFormatError,
  QueryStatus,
  RequestForData,
  SDQLQuery,
  ServerRewardError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

import { CoreConfig } from "@core/interfaces/objects/index.js";

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
    parameters: IDynamicRewardParameter[],
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

  getPossibleRewards(
    consentToken: ConsentToken,
    optInKey: EVMPrivateKey,
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    config: CoreConfig,
  ): ResultAsync<
    PossibleReward[],
    | AjaxError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | PersistenceError
    | EvalNotImplementedError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
    | MissingASTError
  >;

  getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, PersistenceError>;

  getQueryStatuses(
    contractAddress?: EVMContractAddress,
    status?: EQueryProcessingStatus,
    blockNumber?: BlockNumber,
  ): ResultAsync<
    QueryStatus[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
  >;

  batchApprovePreProcessQueries(
    contractAddress: EVMContractAddress,
    queries: Map<IpfsCID, IDynamicRewardParameter>,
  ): ResultAsync<void, never>;

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
