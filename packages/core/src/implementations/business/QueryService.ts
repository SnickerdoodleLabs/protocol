/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  ObjectUtils,
  ValidationUtils,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/node-utils";
import {
  AjaxError,
  BlockNumber,
  BlockchainProviderError,
  ConsentContractError,
  ConsentError,
  ConsentToken,
  EQueryProcessingStatus,
  EVMContractAddress,
  EVMPrivateKey,
  EvaluationError,
  IDynamicRewardParameter,
  IPFSError,
  IpfsCID,
  LinkedAccount,
  PersistenceError,
  QueryFormatError,
  QueryStatus,
  RequestForData,
  SDQLQuery,
  SDQLQueryRequest,
  ServerRewardError,
  UninitializedError,
  PossibleReward,
  IQueryDeliveryItems,
  QueryExpiredError,
  ParserError,
  MissingTokenConstructorError,
  DuplicateIdInSchema,
  EvalNotImplementedError,
  MissingASTError,
  BlockchainCommonErrors,
  JSONString,
  EQueryEvents,
  QueryPerformanceEvent,
  EStatus,
  AccountIndexingError,
  InvalidParametersError,
  MethodSupportError,
  DataPermissions,
  SDQL_Name,
  URLString,
  InvalidStatusError,
  EWalletDataType,
  ESolidityAbiParameterType,
  QueryMetadata,
  AccountAddress,
  ConsentFactoryContractError,
  MissingWalletDataTypeError,
} from "@snickerdoodlelabs/objects";
import {
  SDQLQueryWrapper,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
  AST_SubQuery,
  AST_QuestionnaireQuery,
  AST_Compensation,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { urlJoin } from "url-join-ts";

import { IQueryService } from "@core/interfaces/business/index.js";
import {
  IConsentTokenUtils,
  IConsentTokenUtilsType,
  IQueryParsingEngine,
  IQueryParsingEngineType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInvitationRepository,
  IInvitationRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
} from "@core/interfaces/data/index.js";
import { CoreConfig, CoreContext } from "@core/interfaces/objects/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class QueryService implements IQueryService {
  public constructor(
    @inject(IConsentTokenUtilsType)
    protected consentTokenUtils: IConsentTokenUtils,
    @inject(IDataWalletUtilsType)
    protected dataWalletUtils: IDataWalletUtils,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
    @inject(ISDQLQueryRepositoryType)
    protected sdqlQueryRepo: ISDQLQueryRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
    @inject(ICryptoUtilsType)
    protected cryptoUtils: ICryptoUtils,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
    @inject(ISDQLQueryWrapperFactoryType)
    protected sdqlQueryWrapperFactory: ISDQLQueryWrapperFactory,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(ITimeUtilsType) protected timeUtils: ITimeUtils,
    @inject(IInvitationRepositoryType)
    protected invitationRepo: IInvitationRepository,
  ) {}

  protected preProcessCache: Map<
    EVMContractAddress,
    Map<IpfsCID, QueryStatus>
  > = new Map();

  public initialize(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.privateEvents.heartbeat.subscribe(() => {
        // For every heartbeat, we'll see if there are queries to return
        this.returnQueries().mapErr((e) => {
          this.logUtils.error(e);
        });
      });

      // If the query status is updated to AdsCompleted, we'll immediately returnQueries()
      context.publicEvents.onQueryStatusUpdated.subscribe((queryStatus) => {
        if (queryStatus.status == EQueryProcessingStatus.AdsCompleted) {
          this.returnQueries().mapErr((e) => {
            this.logUtils.error(e);
          });
        }
      });
    });
  }

  public onQueryPosted(
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
  > {
    /**
     * TODO
     * This method, for Ads Flow, will no longer process insights immediately. It will process the
     * query to do Demographic Targeting for any included ads, and add those ads to the list
     * of EligibleAds. It will create a QueryStatus object and persist that as well, to track the
     * progress of the query.
     *
     * Insights will be processed after 3 main triggers: 1. core.reportAdShown(), which will check
     * if there are any remaining EligibleAds for the query. If none exist, process insights.
     * 2. core.completeShowingAds(), which will immediately mark the query as ready for insights,
     * returning any ads that have been watches already.
     * 3. Via a timer, which will watch for SDQLQueries that are about to expire. Expiring queries
     * should be processed and returned as is, as long as at least a single reward is eligible.
     */
    const preProcessQuery = this.preProcessCache
      .get(requestForData.consentContractAddress)
      ?.get(requestForData.requestedCID);

    if (preProcessQuery != null) {
      return this.processPreApprovedQuery(preProcessQuery, requestForData);
    }
    return ResultUtils.combine([
      this.getQueryByCID(requestForData.requestedCID),
      this.contextProvider.getContext(),
      this.consentTokenUtils.getCurrentConsentToken(
        requestForData.consentContractAddress,
      ),
    ]).andThen(([queryWrapper, context, consentToken]) => {
      // Check and make sure a consent token exists
      return this.getQueryMetadata(
        queryWrapper.sdqlQuery,
        requestForData.consentContractAddress,
      ).andThen((queryMetadata) => {
        if (consentToken == null) {
          // Record the query as having been received, but ignore it
          return this.createQueryStatusWithNoConsent(
            requestForData,
            queryWrapper,
            queryMetadata,
          );
        }
        context.publicEvents.queryPerformance.next(
          new QueryPerformanceEvent(
            EQueryEvents.OnQueryPostedEvaluationProcesses,
            EStatus.Start,
            requestForData.requestedCID,
          ),
        );
        // Now we will record the query as having been received; it is now at the start of the processing pipeline
        // This is just a prototype, we probably need to do the parsing before this because QueryStatus
        // should grow significantly
        return this.createQueryStatusWithConsent(
          requestForData,
          queryWrapper,
          queryMetadata,
        )
          .map(() => {
            const queryRequest = new SDQLQueryRequest(
              requestForData.consentContractAddress,
              requestForData.requestedCID,
            );

            context.publicEvents.onQueryPosted.next(queryRequest);

            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.OnQueryPostedEvaluationProcesses,
                EStatus.End,
                requestForData.requestedCID,
              ),
            );
          })
          .mapErr((err) => {
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.OnQueryPostedEvaluationProcesses,
                EStatus.End,
                requestForData.requestedCID,
                undefined,
                err,
              ),
            );
            return err;
          });
      });
    });
  }

  public getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, PersistenceError> {
    return this.sdqlQueryRepo.getQueryStatusByQueryCID(queryCID);
  }

  public getQueryStatusesByContractAddress(
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
  > {
    return this.isContractOptedIn(contractAddress).andThen((optedIn) => {
      if (optedIn) {
        return this.getQueryStatuses(contractAddress);
      }

      return this.getNonOptedQueryStatuses(contractAddress);
    });
  }

  // this function should be called before opt-in
  public batchApprovePreProcessQueries(
    contractAddress: EVMContractAddress,
    queries: Map<IpfsCID, IDynamicRewardParameter>,
  ): ResultAsync<void, never> {
    const cache = this.preProcessCache.get(contractAddress);
    if (cache == null) {
      return okAsync(undefined);
    }
    const traverseMap = new Map([...cache]);
    traverseMap.forEach((queryStatus, queryCID) => {
      const param = queries.get(queryCID);
      if (param == null) {
        cache.delete(queryCID);
        return;
      }
      queryStatus.rewardsParameters = ObjectUtils.serialize(param);
      cache.set(queryCID, queryStatus);
    });
    return okAsync(undefined);
  }

  public getQueryStatuses(
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
  > {
    if (contractAddress != null && blockNumber != null) {
      return this.sdqlQueryRepo
        .getQueryStatusByConsentContract(contractAddress, blockNumber)
        .map((queryStatii) => {
          if (status != null) {
            return queryStatii.filter((queryStatus) => {
              return queryStatus.status === status;
            });
          }
          return queryStatii;
        });
    }
    return this.sdqlQueryRepo.getQueryStatus(status, contractAddress);
  }

  /**
   * This method assumes that the ads are completed if there is any.
   * @param consentContractAddress
   * @param query
   * @param rewardParameters
   * @returns
   */
  public approveQuery(
    queryCID: IpfsCID,
    rewardParameters: IDynamicRewardParameter[],
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
  > {
    this.logUtils.log(
      `QueryService.approveQuery: Approving processing query with CID ${queryCID}`,
    );

    if (
      !rewardParameters.every(({ recipientAddress }) =>
        ValidationUtils.isValidEthereumAddress(recipientAddress.value),
      )
    ) {
      this.logUtils.warning(
        `approveQuery called for Query CID ${queryCID}, with invalid addresses, params ${rewardParameters}`,
      );
      return errAsync(
        new InvalidParametersError(
          `approveQuery called for Query CID ${queryCID}, with invalid addresses, params ${rewardParameters}`,
        ),
      );
    }

    return this.sdqlQueryRepo
      .getQueryStatusByQueryCID(queryCID)
      .andThen((queryStatus) => {
        // Make sure the query is actually one we have a record of
        if (queryStatus == null) {
          this.logUtils.warning(
            `No record of having received query ${queryCID}`,
          );
          return errAsync(
            new UninitializedError(
              `No record found for query with CID:${queryCID}`,
            ),
          );
        }
        if (queryStatus.status !== EQueryProcessingStatus.Received) {
          this.logUtils.warning(
            `Query status for CID ${queryCID} is not in an approval state, query has ${queryStatus.status} status`,
          );
          return errAsync(
            new InvalidStatusError(
              `Query status for CID ${queryCID} is not in an approval state, query has ${queryStatus.status} status`,
            ),
          );
        }

        // Update the query status and store the reward parameters
        // TODO: We're skipping over the WaitingForAds status because we need to process
        // the query for ads here.
        queryStatus.status = EQueryProcessingStatus.AdsCompleted;
        queryStatus.rewardsParameters = ObjectUtils.serialize(rewardParameters);
        return this.sdqlQueryRepo.upsertQueryStatus([queryStatus]).map(() => {
          return queryStatus;
        });
      })
      .andThen((queryStatus) => {
        return this.contextProvider.getContext().map((context) => {
          context.publicEvents.onQueryStatusUpdated.next(queryStatus);
        });
      });
  }

  /**
   * This method looks for queries that are ready to return- in the AdsCompleted status.
   * It does a final process on the queries and delivers the insights. If the insight delivery
   * fails, it will keep the query in AdsCompleted and it will try to redeliver the next time
   * this returnQueries() is called. If the insight delivery fails with a 403 (response already
   * submitted), then the query is marked as RewardsReceived and no further delivery attempts are
   * made
   * @returns
   */
  public returnQueries(): ResultAsync<
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
  > {
    // Step 1, get all queries that are ready to return insights
    this.logUtils.debug(
      "Checking for queries to process and return (in AdsCompleted status)",
    );
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
      this.sdqlQueryRepo.getQueryStatus(EQueryProcessingStatus.AdsCompleted),
    ])
      .andThen(([context, config, queryStatii]) => {
        if (queryStatii.length == 0) {
          this.logUtils.debug("No queries to process and return");
          return okAsync(undefined);
        }
        // For each query, we'll do some basic checks- make sure consent is still
        // valid, that the context is sane, etc.
        return ResultUtils.combine(
          queryStatii.map((queryStatus) => {
            this.logUtils.debug(
              `Attempting to process and return query ${queryStatus.queryCID}`,
            );
            context.publicEvents.queryPerformance.next(
              new QueryPerformanceEvent(
                EQueryEvents.ProcessesBeforeReturningQueryEvaluation,
                EStatus.Start,
                queryStatus.queryCID,
              ),
            );

            const rewardsParameters = this.parseDynamicRewardParameter(
              queryStatus.rewardsParameters,
            );
            // The rewards parameters needs to include recepient address
            if (rewardsParameters == null) {
              // We can't really do much here right now, so I'll just mark the query as waiting
              // for parameters the generate an event
              queryStatus.status = EQueryProcessingStatus.NoRewardsParams;
              return this.sdqlQueryRepo
                .upsertQueryStatus([queryStatus])
                .map(() => {
                  context.publicEvents.onQueryParametersRequired.next(
                    queryStatus.queryCID,
                  );
                  context.publicEvents.queryPerformance.next(
                    new QueryPerformanceEvent(
                      EQueryEvents.ProcessesBeforeReturningQueryEvaluation,
                      EStatus.End,
                      queryStatus.queryCID,
                      undefined,
                      new Error(
                        `Cannot return data for query ${queryStatus.queryCID} because it lacks defined rewards parameters.`,
                      ),
                    ),
                  );
                  context.publicEvents.onQueryStatusUpdated.next(queryStatus);
                  this.logUtils.warning(
                    `Cannot return data for query ${queryStatus.queryCID} because it lacks defined rewards parameters.`,
                  );
                });
              // queryStatus.rewardsParameters = ObjectUtils.serialize({
              //   recipientAddress: "",
              // } as IDynamicRewardParameter);
            }

            return ResultUtils.combine([
              this.consentTokenUtils.getCurrentConsentToken(
                queryStatus.consentContractAddress,
              ),
              this.sdqlQueryRepo.getSDQLQueryByCID(queryStatus.queryCID),
            ]).andThen(([consentToken, query]) => {
              if (query == null) {
                // Don't break everything if we can't get the query from IPFS, just skip it
                return errAsync(
                  new PersistenceError(
                    `Cannot retrieve SDQL Query with CID ${queryStatus.queryCID}`,
                  ),
                );
              }
              return this.validateContextConfig(context, consentToken)
                .andThen(() => {
                  // After sanity checking, we process the query into insights for a
                  // (hopefully) final time, and get our opt-in key
                  context.publicEvents.queryPerformance.next(
                    new QueryPerformanceEvent(
                      EQueryEvents.ProcessesBeforeReturningQueryEvaluation,
                      EStatus.End,
                      query.cid,
                    ),
                  );
                  this.logUtils.debug(
                    `Starting queryParsingEngine for query ${query.cid}`,
                  );
                  return ResultUtils.combine([
                    this.queryParsingEngine
                      .handleQuery(
                        query,
                        DataPermissions.createWithAllPermissions(), // We're enabling all permissions for now instead of using consentToken!.dataPermissions till the permissions are properly refactored.
                      )
                      .map((insights) => {
                        this.logUtils.debug(
                          `Query ${query.cid} processed into insights`,
                        );
                        return insights;
                      }),
                    this.dataWalletUtils.deriveOptInPrivateKey(
                      queryStatus.consentContractAddress,
                      context.dataWalletKey!,
                    ),
                  ]);
                })
                .mapErr((err) => {
                  context.publicEvents.queryPerformance.next(
                    new QueryPerformanceEvent(
                      EQueryEvents.ProcessesBeforeReturningQueryEvaluation,
                      EStatus.End,
                      query.cid,
                      undefined,
                      err,
                    ),
                  );
                })
                .andThen(([insights, optInKey]) => {
                  // Deliver the insights to the backend
                  return this.insightPlatformRepo.deliverInsights(
                    queryStatus.consentContractAddress,
                    consentToken!.tokenId,
                    query.cid,
                    insights,
                    rewardsParameters,
                    optInKey,
                    config.defaultInsightPlatformBaseUrl,
                  );
                })
                .orElse((err) => {
                  if (err instanceof AjaxError) {
                    if (err.code == 403) {
                      // 403 means a response has already been submitted, and we should stop asking
                      queryStatus.status =
                        EQueryProcessingStatus.RewardsReceived;
                      return this.sdqlQueryRepo
                        .upsertQueryStatus([queryStatus])
                        .map(() => {
                          context.publicEvents.onQueryStatusUpdated.next(
                            queryStatus,
                          );
                          return [];
                        });
                    }
                  }

                  // All other errors are just reported
                  this.logUtils.error(
                    `Problem while returning insights for query ${queryStatus.queryCID}`,
                    err,
                  );
                  return errAsync(err);
                })
                .andThen((earnedRewards) => {
                  // Successful posting
                  this.logUtils.log("insight delivery api call done");
                  this.logUtils.log("Earned Rewards: ", earnedRewards);
                  // add EarnedRewards to the wallet, and update the QueryStatus
                  queryStatus.status = EQueryProcessingStatus.RewardsReceived;
                  return ResultUtils.combine([
                    this.accountRepo.addEarnedRewards(earnedRewards),
                    this.sdqlQueryRepo.upsertQueryStatus([queryStatus]),
                  ]);
                  /* TODO: Currently just adding direct rewards and will ignore the others for now */
                  /* Show Lazy Rewards in rewards tab? */
                  /* Web2 rewards are also EarnedRewards, TBD */
                })
                .map(() => {
                  context.publicEvents.onQueryStatusUpdated.next(queryStatus);
                })
                .orElse((err) => {
                  // We are going to consume errors from adding earned rewards or updating the
                  // query status, or a continuing error from posting, and just say it's successful
                  this.logUtils.warning(
                    `Problem while processing and returning insights for query ${query.cid}`,
                    err,
                  );
                  return okAsync(undefined);
                });
            });
          }),
        );
      })
      .map(() => {});
  }

  public getPossibleRewards(
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
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
  > {
    return this.queryParsingEngine
      .getPossibleQueryDeliveryItems(query)
      .andThen((queryDeliveryItems) => {
        return this.getPossibleRewardsFromIP(
          consentToken,
          optInKey,
          consentContractAddress,
          query.cid,
          config,
          queryDeliveryItems,
        );
      });
  }

  protected createQueryStatusWithConsent(
    requestForData: RequestForData,
    queryWrapper: SDQLQueryWrapper,
    queryMetadata: QueryMetadata,
  ): ResultAsync<void, PersistenceError> {
    const queryStatus = new QueryStatus(
      requestForData.consentContractAddress,
      requestForData.requestedCID,
      requestForData.blockNumber,
      EQueryProcessingStatus.Received,
      queryWrapper.expiry,
      queryMetadata.dynamicRewardParameter,
      queryMetadata.name,
      queryMetadata.description,
      queryMetadata.points,
      queryMetadata.questionnaires,
      queryMetadata.virtualQuestionnaires,
      queryMetadata.image ?? null,
    );
    return this.sdqlQueryRepo
      .upsertQueryStatus([queryStatus])
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .map((context) => {
        context.publicEvents.onQueryStatusUpdated.next(queryStatus);
      });
  }

  protected createQueryStatusWithNoConsent(
    requestForData: RequestForData,
    queryWrapper: SDQLQueryWrapper,
    queryMetadata: QueryMetadata,
  ): ResultAsync<void, EvaluationError | PersistenceError> {
    const queryStatus = new QueryStatus(
      requestForData.consentContractAddress,
      requestForData.requestedCID,
      requestForData.blockNumber,
      EQueryProcessingStatus.NoConsentToken,
      queryWrapper.expiry,
      queryMetadata.dynamicRewardParameter,
      queryMetadata.name,
      queryMetadata.description,
      queryMetadata.points,
      queryMetadata.questionnaires,
      queryMetadata.virtualQuestionnaires,
      queryMetadata.image ?? null,
    );
    return this.sdqlQueryRepo
      .upsertQueryStatus([queryStatus])
      .andThen(() => {
        return this.contextProvider.getContext();
      })
      .andThen((context) => {
        context.publicEvents.onQueryStatusUpdated.next(queryStatus);
        return errAsync(new EvaluationError(`Consent token not found!`));
      });
  }

  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures

  protected getPossibleRewardsFromIP(
    consentToken: ConsentToken,
    optInKey: EVMPrivateKey,
    consentContractAddress: EVMContractAddress,
    queryCID: IpfsCID,
    config: CoreConfig,
    queryDeliveryItems: IQueryDeliveryItems,
  ): ResultAsync<PossibleReward[], AjaxError> {
    return this.insightPlatformRepo.receivePreviews(
      consentContractAddress,
      consentToken.tokenId,
      queryCID,
      optInKey,
      config.defaultInsightPlatformBaseUrl,
      queryDeliveryItems,
    );
  }

  protected getQueryByCID(
    queryId: IpfsCID,
  ): ResultAsync<SDQLQueryWrapper, AjaxError | IPFSError> {
    return this.sdqlQueryRepo.getSDQLQueryByCID(queryId).andThen((query) => {
      if (query == null) {
        // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
        // If the client does have the cid key, but no query data yet, then it is not resolved in IPFS yet.
        // Then we should store this CID and try again later
        // TODO: This is a temporary return
        return errAsync(
          new IPFSError(`CID ${queryId} is not yet visible on IPFS`),
        );
      }

      return okAsync(this.sdqlQueryWrapperFactory.makeWrapper(query));
    });
  }

  protected validateContextConfig(
    context: CoreContext,
    consentToken: ConsentToken | null,
  ): ResultAsync<void, UninitializedError | ConsentError> {
    if (context.dataWalletAddress == null || context.dataWalletKey == null) {
      return errAsync(
        new UninitializedError("Data wallet has not been initialized yet!"),
      );
    }

    if (consentToken == null) {
      return errAsync(
        new ConsentError(`Data wallet is not opted in to the contract!`),
      );
    }
    return okAsync(undefined);
  }

  protected parseDynamicRewardParameter(
    rewardParams: JSONString,
  ): IDynamicRewardParameter[] | null {
    try {
      const rewardsParameters =
        ObjectUtils.deserialize<IDynamicRewardParameter[]>(rewardParams);

      if (
        rewardsParameters.every(({ recipientAddress }) =>
          ValidationUtils.isValidEthereumAddress(recipientAddress.value),
        )
      ) {
        return rewardsParameters;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  protected getQueryMetadata(
    query: SDQLQuery,
    consentContractAddress: EVMContractAddress,
  ): ResultAsync<
    QueryMetadata,
    | AjaxError
    | PersistenceError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | MissingASTError
  > {
    return ResultUtils.combine([
      this.getReceivingAddress(consentContractAddress),
      this.queryParsingEngine.parseQuery(query),
    ]).map(([receivingAddress, ast]) => {
      const { subqueries, image, name, points, description, compensations } =
        ast;

      const rewardParams = this.getRewardParams(
        compensations,
        receivingAddress,
      );
      const [questionnaireIds, virtualQuestionnaires] =
        this.getQuestionnaireIds(subqueries);
      return new QueryMetadata(
        query.cid,
        name,
        points,
        description,
        questionnaireIds,
        virtualQuestionnaires,
        //TODO can be removen if not used by IP
        ObjectUtils.serialize(rewardParams),
        image,
      );
    });
  }
  protected getReceivingAddress(
    contractAddress: EVMContractAddress,
  ): ResultAsync<AccountAddress | null, PersistenceError> {
    return this.accountRepo
      .getReceivingAddress(contractAddress)
      .andThen((receivingAddress) => {
        if (receivingAddress != null) {
          return this.accountRepo.getAccounts().andThen((linkedAccounts) => {
            const linkedAccount = linkedAccounts.find(
              (ac) =>
                ac.sourceAccountAddress == receivingAddress ||
                ac.sourceAccountAddress == receivingAddress.toLowerCase(),
            );
            if (linkedAccount != null) {
              return okAsync(receivingAddress);
            }
            return this.accountRepo
              .setReceivingAddress(contractAddress, null)
              .andThen(() => this.getDefaultReceivingAddress());
          });
        }
        return this.getDefaultReceivingAddress();
      });
  }

  protected getDefaultReceivingAddress(): ResultAsync<
    AccountAddress | null,
    PersistenceError
  > {
    return ResultUtils.combine([
      this.accountRepo.getAccounts(),
      this.accountRepo.getDefaultReceivingAddress(),
    ]).andThen(([linkedAccounts, defaultReceivingAddress]) => {
      if (linkedAccounts.length === 0) {
        return okAsync(null);
      }
      const linkedAccount = linkedAccounts.find(
        (ac) => ac.sourceAccountAddress == defaultReceivingAddress,
      );
      if (defaultReceivingAddress == null || linkedAccount == null) {
        return this.accountRepo
          .setDefaultReceivingAddress(linkedAccounts[0].sourceAccountAddress)
          .map(() => linkedAccounts[0].sourceAccountAddress);
      }
      return okAsync(defaultReceivingAddress);
    });
  }

  //TODO can be removen if not used by IP
  protected getRewardParams(
    compensations: Map<SDQL_Name, AST_Compensation>,
    receivingAddress: AccountAddress | null,
  ): IDynamicRewardParameter[] {
    const parameters: IDynamicRewardParameter[] = [];
    compensations.forEach((_value, key) => {
      parameters.push({
        recipientAddress: {
          type: ESolidityAbiParameterType.address,
          value: receivingAddress ?? "",
        },
        compensationKey: {
          type: ESolidityAbiParameterType.string,
          value: key,
        },
      });
    });
    return parameters;
  }

  protected getQuestionnaireIds(
    subqueries: Map<SDQL_Name, AST_SubQuery>,
  ): [IpfsCID[], EWalletDataType[]] {
    const questionnaireIds: IpfsCID[] = [];
    const virtualQuestionnairesSet = new Set<EWalletDataType>();

    subqueries.forEach((subQuery) => {
      if (subQuery instanceof AST_QuestionnaireQuery) {
        const cid: IpfsCID = subQuery.questionnaireIndex!;
        questionnaireIds.push(cid);
      } else {
        const virtualQuestionnaire = subQuery.getPermission();
        if (virtualQuestionnaire.isOk()) {
          virtualQuestionnairesSet.add(virtualQuestionnaire.value);
        }
      }
    });

    const virtualQuestionnaires: EWalletDataType[] = Array.from(
      virtualQuestionnairesSet,
    );
    return [questionnaireIds, virtualQuestionnaires];
  }

  protected processPreApprovedQuery(
    preProcessQuery: QueryStatus,
    requestForData: RequestForData,
  ): ResultAsync<
    void,
    | PersistenceError
    | ConsentContractError
    | UninitializedError
    | ConsentError
    | BlockchainCommonErrors
  > {
    return this.consentTokenUtils
      .getCurrentConsentToken(requestForData.consentContractAddress)
      .andThen((consentToken) => {
        if (consentToken != null) {
          preProcessQuery.status = EQueryProcessingStatus.Received;
          return this.sdqlQueryRepo
            .upsertQueryStatus([preProcessQuery])
            .map(() => {
              this.approveQuery(
                preProcessQuery.queryCID,
                ObjectUtils.deserialize(preProcessQuery.rewardsParameters),
              );
            });
        }
        return this.sdqlQueryRepo.upsertQueryStatus([preProcessQuery]);
      })
      .map(() => {
        this.preProcessCache
          .get(requestForData.consentContractAddress)
          ?.delete(requestForData.requestedCID);
      });
  }

  protected isContractOptedIn(
    contractAddress: EVMContractAddress,
  ): ResultAsync<boolean, PersistenceError> {
    return this.invitationRepo.getAcceptedInvitations().map((optIns) => {
      return !!optIns.find(
        (opt) => opt.consentContractAddress === contractAddress,
      );
    });
  }

  protected getNonOptedQueryStatuses(
    consentContractAddress: EVMContractAddress,
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
    | ParserError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
    | EvalNotImplementedError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.consentContractRepository
      .getConsentContracts([consentContractAddress])
      .andThen((consentContractMap) => {
        const consentContract = consentContractMap.get(consentContractAddress)!;
        // Only consent owners can request data
        return ResultUtils.combine([
          consentContract.getConsentOwner(),
          this.consentContractRepository.getQueryHorizon(
            consentContract.getContractAddress(),
          ),
        ])
          .andThen(([consentOwner, queryHorizon]) => {
            return ResultUtils.combine([
              consentContract.getRequestForDataListByRequesterAddress(
                consentOwner,
                queryHorizon,
              ),
              this.sdqlQueryRepo.getQueryStatusByConsentContract(
                consentContract.getContractAddress(),
                queryHorizon,
              ),
            ]);
          })
          .andThen(([requestForDataObjects, queryStatus]) => {
            const newRequests = requestForDataObjects.filter((r4d) => {
              const existingQueryStatus = queryStatus.find((qs) => {
                return qs.queryCID == r4d.requestedCID;
              });
              return existingQueryStatus == null;
            });

            return ResultUtils.combine(
              newRequests.map((newRequest) => {
                return this.getQueryByCID(newRequest.requestedCID).andThen(
                  (queryWrapper) => {
                    return this.getQueryMetadata(
                      queryWrapper.sdqlQuery,
                      consentContractAddress,
                    ).map((queryMetadata) => {
                      const queryStatus = new QueryStatus(
                        newRequest.consentContractAddress,
                        newRequest.requestedCID,
                        newRequest.blockNumber,
                        EQueryProcessingStatus.NoConsentToken,
                        queryWrapper.expiry,
                        queryMetadata.dynamicRewardParameter,
                        queryMetadata.name,
                        queryMetadata.description,
                        queryMetadata.points,
                        queryMetadata.questionnaires,
                        queryMetadata.virtualQuestionnaires,
                        queryMetadata.image ?? null,
                      );
                      const cache = this.preProcessCache.get(
                        consentContractAddress,
                      );
                      if (cache == null) {
                        this.preProcessCache.set(
                          consentContractAddress,
                          new Map([[queryStatus.queryCID, queryStatus]]),
                        );
                      } else {
                        cache.set(queryStatus.queryCID, queryStatus);
                      }
                      return queryStatus;
                    });
                  },
                );
              }),
            );
          });
      });
  }
}
