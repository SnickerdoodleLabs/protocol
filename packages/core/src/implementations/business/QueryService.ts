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
  ConsentError,
  EvaluationError,
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
  IDynamicRewardParameter,
  LinkedAccount,
  QueryIdentifier,
  ExpectedReward,
  EVMPrivateKey,
} from "@snickerdoodlelabs/objects";
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
    @inject(IDataWalletPersistenceType)
    protected persistenceRepo: IDataWalletPersistence,
  ) {}

  public onQueryPosted(
    consentContractAddress: EVMContractAddress,
    queryCID: IpfsCID,
  ): ResultAsync<void, EvaluationError> {
    // Get the IPFS data for the query. This is just "Get the query";
    // Cache
    // if (!this.safeUpdateQueryContractMap(queryCID, consentContractAddress)) {
    //   return errAsync(new ConsentContractError(`Duplicate contract address for ${queryCID}. new = ${consentContractAddress}, existing = ${this.queryContractMap.get(queryCID)}`)); ))
    // }
    return ResultUtils.combine([
      this.getQueryByCID(queryCID),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
      this.persistenceRepo.getAccounts(),
    ]).andThen(([query, context, config, accounts]) => {

      return ResultUtils.combine([
        this.consentTokenUtils.getCurrentConsentToken(consentContractAddress),
        this.dataWalletUtils.deriveOptInPrivateKey(
          consentContractAddress,
          context.dataWalletKey!,
        ),
      ]).andThen(([consentToken, optInKey]) => {
        if (consentToken == null) {
          return errAsync(new EvaluationError(`Consent token not found!`));
        }
        return this.queryParsingEngine
          .getPermittedQueryIdsAndExpectedRewards(query, consentToken.dataPermissions)
          .andThen(([queryIdentifiers, expectedRewards]) => {

            return this.publishSDQLQueryRequestIfExpectedAndEligibleRewardsMatch(
              consentToken,
              optInKey,
              consentContractAddress,
              query,
              accounts,
              context,
              config,
              queryIdentifiers,
              expectedRewards,
            );
          });
      });
    });
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
    expectedRewards: ExpectedReward[]
  ): ResultAsync<void, EvaluationError | ServerRewardError> {

      return this.getEligibleRewardsFromInsightPlatform(
        consentToken,
        optInKey,
        consentContractAddress,
        query.cid,
        config,
        permittedQueryIds,
      )
      .andThen((eligibleRewards) => {

          if (!this.areExpectedAndEligibleRewardsEqual(eligibleRewards, expectedRewards)) 
            return errAsync( 
              new ServerRewardError("Insight Platform Rewards do not match Expected Rewards!")
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
  ): ResultAsync<SDQLQuery, AjaxError | IPFSError> {
    return this.sdqlQueryRepo.getByCID(queryId).andThen((query) => {
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

  // Will need refactoring when we include lazy rewards
  private areExpectedAndEligibleRewardsEqual(
    eligibleRewards: EligibleReward[],
    expectedRewards: ExpectedReward[],
  ): boolean {

    const expectedRewardKeysSet: Set<string> = new Set(
      expectedRewards.map((expectedReward) => expectedReward.compensationKey)
    );

    return ( // Only comparing the keys is enough.
      eligibleRewards.length == expectedRewards.length &&
      eligibleRewards.every(elem => expectedRewardKeysSet.has(elem.compensationKey))
    );
  }

  public processQuery(
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
    | EvaluationError
  > {
    console.log(
      `QueryService.processQuery: Processing query for consent contract ${consentContractAddress} with CID ${query.cid}`,
    );

    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
      this.consentTokenUtils.getCurrentConsentToken(consentContractAddress),
    ]).andThen(([context, config, consentToken]) => {
      return this.validateContextConfig(context, consentToken).andThen(() => {
        return ResultUtils.combine([
          this.queryParsingEngine.handleQuery(
            query,
            consentToken!.dataPermissions,
            rewardParameters,
          ),
          this.dataWalletUtils.deriveOptInPrivateKey(
            consentContractAddress,
            context.dataWalletKey!,
          ),
        ]).andThen(([maps, optInKey]) => {
          const maps2 = maps as [InsightString[], EligibleReward[]];
          const insights = maps2[0];
          const rewards = maps2[1];

          return this.insightPlatformRepo
            .deliverInsights(
              consentContractAddress,
              consentToken!.tokenId,
              query.cid,
              insights,
              rewardParameters,
              optInKey,
              config.defaultInsightPlatformBaseUrl,
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
}
