import {
  AccountIndexingError,
  AjaxError,
  BlockchainCommonErrors,
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentError,
  ConsentToken,
  DuplicateIdInSchema,
  EQueryProcessingStatus,
  EvalNotImplementedError,
  EvaluationError,
  EVMContractAddress,
  EVMPrivateKey,
  IDynamicRewardParameter,
  InvalidParametersError,
  InvalidQueryStatusError,
  IpfsCID,
  IPFSError,
  MethodSupportError,
  MissingASTError,
  MissingTokenConstructorError,
  Offer,
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

  approveOffer(
    queryCID: IpfsCID,
  ): ResultAsync<void, InvalidQueryStatusError | PersistenceError>;

  getOffers(
    contractAddress?: EVMContractAddress,
    status?: EQueryProcessingStatus,
  ): ResultAsync<
    Offer[],
    | AjaxError
    | PersistenceError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | MissingASTError
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
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<
    QueryStatus[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
  >;
}

export const IQueryServiceType = Symbol.for("IQueryService");
