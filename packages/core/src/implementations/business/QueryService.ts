/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
} from "@snickerdoodlelabs/insight-platform-api";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EvaluationError,
  EVMAccountAddress,
  EVMContractAddress,
  InsightString,
  IpfsCID,
  IPFSError,
  QueryFormatError,
  UninitializedError,
  EligibleReward,
  SDQLQuery,
  SDQLQueryRequest,
  ConsentToken,
  ServerRewardError,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
  QueryExpiredError,
  IDynamicRewardParameter,
  LinkedAccount,
  DataWalletAddress,
  QueryIdentifier,
  ExpectedReward,
  EVMPrivateKey,
  URLString
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IQueryService } from "@core/interfaces/business/index.js";
import {
  IQueryParsingEngine,
  IQueryParsingEngineType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
} from "@core/interfaces/data/index.js";
import { CoreConfig, CoreContext } from "@core/interfaces/objects/index.js";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities/index.js";


@injectable()
export class QueryService implements IQueryService {
  // queryContractMap: Map<IpfsCID, EVMContractAddress> = new Map();
  public constructor(
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
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
  ) {}

  public onQueryPosted(
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
  ): ResultAsync<void, EvaluationError> {
    // Get the IPFS data for the query. This is just "Get the query";
    // Cache
    // if (!this.safeUpdateQueryContractMap(queryId, consentContractAddress)) {
    //   return errAsync(new ConsentContractError(`Duplicate contract address for ${queryId}. new = ${consentContractAddress}, existing = ${this.queryContractMap.get(queryId)}`)); ))
    // }
    return ResultUtils.combine([
      this.getQueryByCID(queryId),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
      this.persistenceRepo.getAccounts()
    ]).andThen(([query, context, config, accounts]) => {

      return this.getCurrentConsentToken(context, consentContractAddress)
        .andThen((consentToken) => {

          return this.queryParsingEngine.getExpectedRewards(
            query, consentToken!.dataPermissions
          );
        })
        .andThen(([queryIdentifiers, expectedRewards]) => {
          return this.publishSDQLQueryRequestIfExpectedAndEligibleRewardsMatch(
            consentContractAddress,
            query, accounts, context,
            config, queryIdentifiers,
            expectedRewards
          );
        });
    });
  }

  protected publishSDQLQueryRequestIfExpectedAndEligibleRewardsMatch(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    accounts: LinkedAccount[],
    context: CoreContext,
    config: CoreConfig,
    queryIdentifiers: QueryIdentifier[],
    expectedRewards: ExpectedReward[]
  ): ResultAsync<void, EvaluationError> {

      return this.getEligibleRewardsFromInsightPlatform(
        context, consentContractAddress,
        query.cid, config,
        queryIdentifiers,
        expectedRewards
      )
      .andThen((eligibleRewards) => {

        return this.compareRewards(eligibleRewards, expectedRewards)
        .andThen(() => {

          return this.publishSDQLQueryRequest(
            consentContractAddress,
            query, eligibleRewards,
            accounts, context
          );
        });
      });
  }

  protected getEligibleRewardsFromInsightPlatform(
    context: CoreContext,
    consentContractAddress: EVMContractAddress,
    queryCid: IpfsCID,
    config: CoreConfig,
    answeredQueries: QueryIdentifier[],
    expectedRewards: ExpectedReward[],
  ): ResultAsync<EligibleReward[], AjaxError> {

    return this.insightPlatformRepo.receivePreviews(
      context.dataWalletAddress!,
      consentContractAddress,
      queryCid,
      context.dataWalletKey!,
      config.defaultInsightPlatformBaseUrl,
      answeredQueries,
      expectedRewards,
    );
  }

  protected publishSDQLQueryRequest(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    eligibleRewards: EligibleReward[],
    accounts: LinkedAccount[],
    context: CoreContext
  ): ResultAsync<void, Error> {

    // Wrap the query & send to core
    const queryRequest = new SDQLQueryRequest(
      consentContractAddress,
      query,
      eligibleRewards,
      accounts,
      context.dataWalletAddress!
    );

    context.publicEvents.onQueryPosted.next(queryRequest);

    return okAsync(undefined);
  }

  protected getQueryByCID(
    queryId: IpfsCID
  ): ResultAsync<SDQLQuery, AjaxError | IPFSError> {
    return this.sdqlQueryRepo.getByCID(queryId)
      .andThen((query) => {

        if (query == null) {
          // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
          // If the client does have the cid key, but no query data yet, then it is not resolved in IPFS yet.
          // Then we should store this CID and try again later
          // TODO: This is a temporary return
          return errAsync(
            new IPFSError(`CID ${queryId} is not yet visible on IPFS`),
          );
        }

        return okAsync(query);
      });
  }

  protected getCurrentConsentToken(
    context: CoreContext,
    consentContractAddress: EVMContractAddress
  ): ResultAsync<
    ConsentToken 
    | null 
    | undefined,
    ConsentError 
    | AjaxError 
    | ConsentContractError
    | ConsentContractRepositoryError 
    | UninitializedError 
    | BlockchainProviderError> {
      if (context.dataWalletAddress == null) {
        // Need to wait for the wallet to unlock
        return okAsync(undefined);
      }

      // We have the query, next step is check if you actually have a consent token for this business
      return this.consentContractRepository
        .isAddressOptedIn(
          consentContractAddress,
          EVMAccountAddress(context.dataWalletAddress),
        )
        .andThen((addressOptedIn) => {
          if (!addressOptedIn) {
            // No consent given!
            return errAsync(
              new ConsentError(
                `No consent token for address ${context.dataWalletAddress}!`,
              ),
            );
          }

          // We have a consent token!
          return this.consentContractRepository.getCurrentConsentToken(
            consentContractAddress,
          );
        });
  }
  
  // Will need refactoring when we include lazy rewards
  protected compareRewards(
    eligibleRewards: EligibleReward[],
    expectedRewards: ExpectedReward[],
  ): ResultAsync<void, ServerRewardError> {

    const expectedRewardKeysSet: Set<string> = new Set(
      expectedRewards.map((expectedReward) => expectedReward.compensationKey)
    );
    if ( // Only comparing the keys is enough.
      eligibleRewards.length != expectedRewards.length ||
      !eligibleRewards.every(
        elem => expectedRewardKeysSet.has(elem.compensationKey)
      )
    )
      return errAsync(
        new ServerRewardError(
          "Insight Platform Rewards do not match Expected Rewards!",
        ),
      );

    return okAsync(undefined);
  }

  public processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
    rewardParameters?: IDynamicRewardParameter[],
  ): ResultAsync<
    void,
    | AjaxError
    | UninitializedError
    | ConsentError
    | IPFSError
    | QueryFormatError
    | EvaluationError
  > {
    console.log(
      `QueryService.processQuery: Processing query for consent contract ${consentContractAddress} with CID ${query.cid}`,
    );
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
      this.consentContractRepository.getCurrentConsentToken(
        consentContractAddress,
      ),
    ]).andThen(([context, config, consentToken]) => {
      return this.validateContextConfig(
        context as CoreContext,
        config,
        consentToken,
      ).andThen(() => {
        return this.queryParsingEngine
          .handleQuery(query, consentToken!.dataPermissions, rewardParameters)
          .andThen((maps) => {
            const maps2 = maps as [InsightString[], EligibleReward[]];
            const insights = maps2[0];
            const rewards = maps2[1];

            return this.insightPlatformRepo
              .deliverInsights(
                context.dataWalletAddress!,
                consentContractAddress,
                query.cid,
                insights,
                context.dataWalletKey!,
                config.defaultInsightPlatformBaseUrl,
                rewardParameters,
              )
              .map((earnedRewards) => {
                console.log("insight delivery api call done");
                console.log("Earned Rewards: ", earnedRewards);
                /* For Direct Rewards, add EarnedRewards to the wallet */
                this.persistenceRepo.addEarnedRewards(earnedRewards);
                /* TODO: Currenlty just adding direct rewards and will ignore the others for now */
                /* Show Lazy Rewards in rewards tab? */
                /* Web2 rewards are also EarnedRewards, TBD */
              });
          });
      });
    });
  }

  public validateContextConfig(
    context: CoreContext,
    config: CoreConfig,
    consentToken: ConsentToken | null,
  ): ResultAsync<void, UninitializedError | ConsentError> {
    // console.log(context);
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
}
