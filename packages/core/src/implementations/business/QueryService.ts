/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
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
import {
  AjaxError,
  BlockchainProviderError,
  BlockNumber,
  ConsentContractError,
  ConsentError,
  ConsentToken,
  EligibleReward,
  EQueryProcessingStatus,
  EvaluationError,
  EVMContractAddress,
  EVMPrivateKey,
  ExpectedReward,
  IDynamicRewardParameter,
  IpfsCID,
  IPFSError,
  LinkedAccount,
  PersistenceError,
  QueryFormatError,
  QueryIdentifier,
  QueryStatus,
  RequestForData,
  SDQLQuery,
  SDQLQueryRequest,
  ServerRewardError,
  UninitializedError,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  ISDQLQueryWrapperFactory,
  ISDQLQueryWrapperFactoryType,
  SDQLQueryWrapper,
} from "@snickerdoodlelabs/query-parser";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

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
  ) {}

  public initialize(): ResultAsync<void, never> {
    return this.contextProvider.getContext().map((context) => {
      context.heartbeat.subscribe(() => {
        // For every heartbeat, we'll see if there are queries to return
        this.returnQueries().mapErr((e) => {
          this.logUtils.error(e);
        });
      });
    });
  }

  public onQueryPosted(
    requestForData: RequestForData,
  ): ResultAsync<void, EvaluationError | PersistenceError> {
    /**
     * TODO
     * This method, for Ads Flow, will no longer process insights immediately. It will process the
     * query to do Demographic Targetting for any included ads, and add those ads to the list
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
      this.consentTokenUtils.getCurrentConsentToken(
        requestForData.consentContractAddress,
      ),
    ]).andThen(([queryWrapper, context, config, accounts, consentToken]) => {
      // Check and make sure a consent token exists
      if (consentToken == null) {
        // Record the query as having been received, but ignore it
        return this.createQueryStatusWithNoConsent(
          requestForData,
          queryWrapper,
        );
      }

      // Now we will record the query as having been recieved; it is now at the start of the processing pipeline
      // This is just a prototype, we probably need to do the parsing before this becuase QueryStatus
      // should grow significantly
      return this.createQueryStatusWithConsent(
        requestForData,
        queryWrapper,
      ).andThen(() => {
        return ResultUtils.combine([
          this.queryParsingEngine.getPermittedQueryIdsAndExpectedRewards(
            queryWrapper.sdqlQuery,
            consentToken.dataPermissions,
            requestForData.consentContractAddress,
          ),
          this.dataWalletUtils.deriveOptInPrivateKey(
            requestForData.consentContractAddress,
            context.dataWalletKey!,
          ),
        ]).andThen(([[permittedQueryIds, expectedRewards], optInKey]) => {
          return this.publishSDQLQueryRequestIfExpectedAndEligibleRewardsMatch(
            consentToken,
            optInKey,
            requestForData.consentContractAddress,
            queryWrapper.sdqlQuery,
            accounts,
            context,
            config,
            permittedQueryIds,
            expectedRewards,
          );
        });
      });
    });
  }

  public createQueryStatusWithNoConsent(
    requestForData: RequestForData,
    queryWrapper: SDQLQueryWrapper,
  ): ResultAsync<void, EvaluationError> {
    return this.sdqlQueryRepo
      .upsertQueryStatus([
        new QueryStatus(
          requestForData.consentContractAddress,
          requestForData.requestedCID,
          requestForData.blockNumber,
          EQueryProcessingStatus.NoConsentToken,
          queryWrapper.expiry,
          null,
        ),
      ])
      .andThen(() => {
        return errAsync(new EvaluationError(`Consent token not found!`));
      });
  }

  public createQueryStatusWithConsent(
    requestForData: RequestForData,
    queryWrapper: SDQLQueryWrapper,
  ): ResultAsync<void, PersistenceError> {
    return this.sdqlQueryRepo.upsertQueryStatus([
      new QueryStatus(
        requestForData.consentContractAddress,
        requestForData.requestedCID,
        requestForData.blockNumber,
        EQueryProcessingStatus.Received,
        queryWrapper.expiry,
        null,
      ),
    ]);
  }

  /**
   * THis method assums that the ads are completed if there is any.
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
            `No record of having recieved query ${query.cid}, but processing it anyway`,
          );
          return this.sdqlQueryRepo.upsertQueryStatus([
            new QueryStatus(
              consentContractAddress,
              query.cid,
              BlockNumber(1),
              EQueryProcessingStatus.AdsCompleted,
              this.timeUtils.getUnixNow(),
              ObjectUtils.serialize(rewardParameters),
            ),
          ]);
        }

        // Update the query status and store the reward parameters
        // TODO: We're skipping over the WaitingForAds status because we need to process
        // the query for ads here.
        queryStatus.status = EQueryProcessingStatus.AdsCompleted;
        queryStatus.rewardsParameters = ObjectUtils.serialize(rewardParameters);
        return this.sdqlQueryRepo.upsertQueryStatus([queryStatus]);
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
  > {
    // Step 1, get all queries that are ready to return insights
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
      this.sdqlQueryRepo.getQueryStatusByStatus(
        EQueryProcessingStatus.AdsCompleted,
      ),
    ])
      .andThen(([context, config, queryStatii]) => {
        // For each query, we'll do some basic checks- make sure consent is still
        // valid, that the context is sane, etc.
        return ResultUtils.combine(
          queryStatii.map((queryStatus) => {
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
            >(queryStatus.rewardsParameters);
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
                  return ResultUtils.combine([
                    this.queryParsingEngine.handleQuery(
                      query,
                      consentToken!.dataPermissions,
                    ),
                    this.dataWalletUtils.deriveOptInPrivateKey(
                      queryStatus.consentContractAddress,
                      context.dataWalletKey!,
                    ),
                  ]);
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
                    if (err.statusCode == 403) {
                      // 403 means a response has already been submitted, and we should stop asking
                      queryStatus.status =
                        EQueryProcessingStatus.RewardsReceived;
                      return this.sdqlQueryRepo
                        .upsertQueryStatus([queryStatus])
                        .map(() => {
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
                  /* TODO: Currenlty just adding direct rewards and will ignore the others for now */
                  /* Show Lazy Rewards in rewards tab? */
                  /* Web2 rewards are also EarnedRewards, TBD */
                })
                .map(() => {})
                .orElse((err) => {
                  // We are going to consume errors from adding earned rewards or updating the
                  // query status, or a continuing error from posting, and just say it's successful
                  this.logUtils.warning(err);
                  return okAsync(undefined);
                });
            });
          }),
        );
      })
      .map(() => {});
  }

  protected validateContextConfig(
    context: CoreContext,
    consentToken: ConsentToken | null,
  ): ResultAsync<void, UninitializedError | ConsentError> {
    if (context.dataWalletAddress == null || context.dataWalletKey == null) {
      return errAsync(
        new UninitializedError("Data wallet has not been unlocked yet!"),
      );
    }

    if (consentToken == null) {
      return errAsync(
        new ConsentError(`Data wallet is not opted in to the contract!`),
      );
    }
    return okAsync(undefined);
  }

  protected publishSDQLQueryRequestIfExpectedAndEligibleRewardsMatch(
    consentToken: ConsentToken,
    optInKey: EVMPrivateKey,
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    accounts: LinkedAccount[],
    context: CoreContext,
    config: CoreConfig,
    permittedQueryIds: QueryIdentifier[],
    expectedRewards: ExpectedReward[],
  ): ResultAsync<void, EvaluationError | ServerRewardError> {
    return this.getEligibleRewardsFromInsightPlatform(
      consentToken,
      optInKey,
      consentContractAddress,
      query.cid,
      config,
      permittedQueryIds,
    ).andThen((eligibleRewards) => {
      if (
        !this.areExpectedAndEligibleRewardsEqual(
          eligibleRewards,
          expectedRewards,
        )
      )
        return errAsync(
          new ServerRewardError(
            "Insight Platform Rewards do not match Expected Rewards!",
          ),
        );

      return this.publishSDQLQueryRequest(
        consentContractAddress,
        query,
        eligibleRewards,
        accounts,
        context,
      );
    });
  }

  protected getEligibleRewardsFromInsightPlatform(
    consentToken: ConsentToken,
    optInKey: EVMPrivateKey,
    consentContractAddress: EVMContractAddress,
    queryCID: IpfsCID,
    config: CoreConfig,
    answeredQueries: QueryIdentifier[],
  ): ResultAsync<EligibleReward[], AjaxError> {
    return this.insightPlatformRepo.receivePreviews(
      consentContractAddress,
      consentToken.tokenId,
      queryCID,
      optInKey,
      config.defaultInsightPlatformBaseUrl,
      answeredQueries,
    );
  }

  protected publishSDQLQueryRequest(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    eligibleRewards: EligibleReward[],
    accounts: LinkedAccount[],
    context: CoreContext,
  ): ResultAsync<void, Error> {
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

  // Will need refactoring when we include lazy rewards
  private areExpectedAndEligibleRewardsEqual(
    eligibleRewards: EligibleReward[],
    expectedRewards: ExpectedReward[],
  ): boolean {
    const expectedRewardKeysSet: Set<string> = new Set(
      expectedRewards.map((expectedReward) => expectedReward.compensationKey),
    );

    return (
      // Only comparing the keys is enough.
      eligibleRewards.length == expectedRewards.length &&
      eligibleRewards.every((elem) =>
        expectedRewardKeysSet.has(elem.compensationKey),
      )
    );
  }
}
