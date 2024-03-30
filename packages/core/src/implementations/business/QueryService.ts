/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ILogUtils,
  ILogUtilsType,
  ITimeUtils,
  ITimeUtilsType,
  ObjectUtils,
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
  OptInInfo,
  Commitment,
} from "@snickerdoodlelabs/objects";
import {
  SDQLQueryWrapper,
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { ResultAsync, errAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IQueryService } from "@core/interfaces/business/index.js";
import {
  IQueryParsingEngine,
  IQueryParsingEngineType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
  IPermissionRepository,
  IPermissionRepositoryType,
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
    @inject(IDataWalletUtilsType)
    protected dataWalletUtils: IDataWalletUtils,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
    @inject(ISDQLQueryRepositoryType)
    protected sdqlQueryRepo: ISDQLQueryRepository,
    @inject(IInsightPlatformRepositoryType)
    protected insightPlatformRepo: IInsightPlatformRepository,
    @inject(IPermissionRepositoryType)
    protected permisionRepo: IPermissionRepository,
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
  ) {}

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
    // Create a new QueryStatus for tracking the query.
    return ResultUtils.combine([
      this.getQueryByCID(requestForData.requestedCID),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
      this.accountRepo.getAccounts(),
      this.consentContractRepository.getCommitmentIndex(
        requestForData.consentContractAddress,
      ),
    ]).andThen(([queryWrapper, context, config, accounts, commitmentIndex]) => {
      // Check and make sure a commitment has been added for the consent contract
      if (commitmentIndex == -1) {
        // Record the query as having been received, but ignore it
        return this.createQueryStatusWithNoConsent(
          requestForData,
          queryWrapper,
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
      return this.createQueryStatusWithConsent(requestForData, queryWrapper)
        .andThen(() => {
          return this.dataWalletUtils
            .deriveOptInInfo(
              requestForData.consentContractAddress,
              context.dataWalletKey!,
            )
            .andThen((optInInfo) => {
              return this.constructAndPublishSDQLQueryRequest(
                optInInfo,
                requestForData.consentContractAddress,
                queryWrapper.sdqlQuery,
                accounts,
                context,
                config,
              );
            })
            .map(() => {
              context.publicEvents.queryPerformance.next(
                new QueryPerformanceEvent(
                  EQueryEvents.OnQueryPostedEvaluationProcesses,
                  EStatus.End,
                  requestForData.requestedCID,
                ),
              );
            });
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
  }

  public getQueryStatusByQueryCID(
    queryCID: IpfsCID,
  ): ResultAsync<QueryStatus | null, PersistenceError> {
    return this.sdqlQueryRepo.getQueryStatusByQueryCID(queryCID);
  }

  public getQueryStatuses(
    contractAddress: EVMContractAddress,
    blockNumber?: BlockNumber,
  ): ResultAsync<
    QueryStatus[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
  > {
    if (blockNumber) {
      return this.sdqlQueryRepo.getQueryStatusByConsentContract(
        contractAddress,
        blockNumber,
      );
    }
    return this.consentContractRepository
      .getQueryHorizon(contractAddress)
      .andThen((queryHorizon) => {
        return this.sdqlQueryRepo.getQueryStatusByConsentContract(
          contractAddress,
          queryHorizon,
        );
      });
  }

  /**
   * This method assumes that the ads are completed if there is any.
   * @param consentContractAddress
   * @param query
   * @param rewardParameters
   * @returns
   */
  public approveQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    rewardParameters: IDynamicRewardParameter[],
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | PersistenceError
  > {
    this.logUtils.log(
      `QueryService.approveQuery: Approving processing query for consent contract ${consentContractAddress} with CID ${query.cid}`,
    );
    return this.sdqlQueryRepo
      .getQueryStatusByQueryCID(query.cid)
      .andThen((queryStatus) => {
        // Make sure the query is actually one we have a record of
        if (queryStatus == null) {
          this.logUtils.warning(
            `No record of having received query ${query.cid}, but processing it anyway`,
          );
          const newQueryStatus = new QueryStatus(
            consentContractAddress,
            query.cid,
            BlockNumber(1),
            EQueryProcessingStatus.AdsCompleted,
            this.timeUtils.getUnixNow(),
            ObjectUtils.serialize(rewardParameters),
          );
          return this.sdqlQueryRepo
            .upsertQueryStatus([newQueryStatus])
            .map(() => {
              return newQueryStatus;
            });
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
      this.sdqlQueryRepo.getQueryStatusByStatus(
        EQueryProcessingStatus.AdsCompleted,
      ),
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

            // The rewards parameters need to be deserialized, or at least the basics provided.
            if (queryStatus.rewardsParameters == null) {
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
            const rewardsParameters = ObjectUtils.deserialize<
              IDynamicRewardParameter[]
            >(queryStatus.rewardsParameters as JSONString);
            return ResultUtils.combine([
              this.consentContractRepository.getCommitmentIndex(
                queryStatus.consentContractAddress,
              ),
              this.sdqlQueryRepo.getSDQLQueryByCID(queryStatus.queryCID),
            ]).andThen(([commitmentIndex, query]) => {
              if (query == null) {
                // Don't break everything if we can't get the query from IPFS, just skip it
                return errAsync(
                  new PersistenceError(
                    `Cannot retrieve SDQL Query with CID ${queryStatus.queryCID}`,
                  ),
                );
              }
              return this.validateContextConfig(context, commitmentIndex)
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

                  // Need to determine the start and size of the anonymity set.
                  return this.permisionRepo
                    .getContentContractPermissions(
                      queryStatus.consentContractAddress,
                    )
                    .andThen((permissions) => {
                      return ResultUtils.combine([
                        this.queryParsingEngine
                          .handleQuery(query, permissions)
                          .map((insights) => {
                            this.logUtils.debug(
                              `Query ${query.cid} processed into insights`,
                            );
                            return insights;
                          }),
                        this.dataWalletUtils.deriveOptInInfo(
                          queryStatus.consentContractAddress,
                          context.dataWalletKey!,
                        ),
                        this.getAnonymitySet(
                          queryStatus.consentContractAddress,
                          commitmentIndex,
                        ),
                      ]);
                    });
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
                  return err;
                })
                .andThen(([insights, optInInfo, anonymitySet]) => {
                  // Deliver the insights to the backend
                  return this.insightPlatformRepo.deliverInsights(
                    queryStatus.consentContractAddress,
                    optInInfo.identityTrapdoor,
                    optInInfo.identityNullifier,
                    query.cid,
                    insights,
                    rewardsParameters,
                    anonymitySet,
                    0,
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

  protected getAnonymitySet(
    consentContractAddress: EVMContractAddress,
    commitmentIndex: number,
  ): ResultAsync<
    Commitment[],
    | ConsentContractError
    | UninitializedError
    | BlockchainCommonErrors
    | InvalidParametersError
  > {
    // The commitment set needs to include our commitment and be as big as possible, but not start at our
    // commitment. For right now, we'll use a set of size 1000 if we can.
    return this.consentContractRepository
      .getCommitmentCount(consentContractAddress)
      .andThen((commitmentCount) => {
        if (commitmentCount > 1000) {
          commitmentCount = 1000;
        }

        // Now generate a random number less than commitment count and less than commitmentIndex
        const randomMax = Math.min(commitmentCount, commitmentIndex);

        // Will return between 0 and randomMax - 1
        const offset = this.getRandomInteger(0, randomMax);

        // Get the anonymity set
        return this.consentContractRepository.getAnonymitySet(
          consentContractAddress,
          offset,
          commitmentCount,
        );
      })
      .map((anonymitySet) => {
        return anonymitySet;
      });
  }

  // Returns an integer between mine (inclusive) and max (exclusive)
  protected getRandomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  protected createQueryStatusWithConsent(
    requestForData: RequestForData,
    queryWrapper: SDQLQueryWrapper,
  ): ResultAsync<void, PersistenceError> {
    const queryStatus = new QueryStatus(
      requestForData.consentContractAddress,
      requestForData.requestedCID,
      requestForData.blockNumber,
      EQueryProcessingStatus.Received,
      queryWrapper.expiry,
      null,
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
  ): ResultAsync<void, EvaluationError | PersistenceError> {
    const queryStatus = new QueryStatus(
      requestForData.consentContractAddress,
      requestForData.requestedCID,
      requestForData.blockNumber,
      EQueryProcessingStatus.NoConsentToken,
      queryWrapper.expiry,
      null,
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

  protected constructAndPublishSDQLQueryRequest(
    optInInfo: OptInInfo,
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    accounts: LinkedAccount[],
    context: CoreContext,
    config: CoreConfig,
  ): ResultAsync<
    void,
    | EvaluationError
    | ServerRewardError
    | AjaxError
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
    | MissingASTError
    | AccountIndexingError
    | MethodSupportError
    | InvalidParametersError
  > {
    return this.publishSDQLQueryRequest(
      consentContractAddress,
      query,
      [],
      accounts,
      context,
    );
  }
  // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
  protected publishSDQLQueryRequest(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    eligibleRewards: PossibleReward[],
    accounts: LinkedAccount[],
    context: CoreContext,
  ): ResultAsync<void, never> {
    // Wrap the query & send to core
    const queryRequest = new SDQLQueryRequest(
      consentContractAddress,
      query,
      eligibleRewards,
      accounts,
      context.dataWalletAddress!,
    );

    context.publicEvents.onQueryPosted.next(queryRequest);

    return okAsync(undefined);
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
    commitmentIndex: number,
  ): ResultAsync<void, UninitializedError | ConsentError> {
    if (context.dataWalletAddress == null || context.dataWalletKey == null) {
      return errAsync(
        new UninitializedError("Data wallet has not been initialized yet!"),
      );
    }

    if (commitmentIndex == -1) {
      return errAsync(
        new ConsentError(`Data wallet is not opted in to the contract!`),
      );
    }
    return okAsync(undefined);
  }
}
