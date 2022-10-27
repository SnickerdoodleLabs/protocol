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
  DataWalletAddress,
  SDQLQuery,
  SDQLQueryRequest,
  ConsentToken,
  ServerRewardError,
  IDataWalletPersistenceType,
  IDataWalletPersistence,
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
import { QueryExpiredError } from "@snickerdoodlelabs/objects";
import { DataPermissions } from "@snickerdoodlelabs/objects";

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
  ): ResultAsync<
    void, 
    ConsentContractError 
    | ConsentContractRepositoryError 
    | UninitializedError 
    | BlockchainProviderError 
    | AjaxError 
    | QueryFormatError 
    | EvaluationError 
    | QueryExpiredError
  > {

    // Get the IPFS data for the query. This is just "Get the query";
    // Cache
    // if (!this.safeUpdateQueryContractMap(queryId, consentContractAddress)) {
    //   return errAsync(new ConsentContractError(`Duplicate contract address for ${queryId}. new = ${consentContractAddress}, existing = ${this.queryContractMap.get(queryId)}`)); ))
    // }
    return ResultUtils.combine([
      this.sdqlQueryRepo.getByCID(queryId),
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ])
    .andThen(([query, context, config]) => {

      if (query == null) {
        // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
        // If the client does have the cid key, but no query data yet, then it is not resolved in IPFS yet.
        // Then we should store this CID and try again later
        // TODO: This is a temporary return
        return errAsync(
          new IPFSError(`CID ${queryId} is not yet visible on IPFS`),
        );
      }

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
          )          
        })
        .andThen((consentToken) => {
          return this.queryParsingEngine.getPreviews(query, consentToken!.dataPermissions)
        })
        .andThen(([queryIdentifiers, expectedRewards]) => { 

          return this.insightPlatformRepo.deliverPreview(
            context.dataWalletAddress!,
            consentContractAddress,
            query.cid,
            context.dataWalletKey!,
            config.defaultInsightPlatformBaseUrl,
            queryIdentifiers,
            expectedRewards
          )
          .andThen((eligibleRewards) => {
            
            /* Compare server's rewards with your list */
            if (!this.compareRewards(eligibleRewards, expectedRewards)) {
              // No consent given!
              return errAsync(
                new ServerRewardError(
                  `No consent token for address ${context.dataWalletAddress}!`,
                ),
              );
            }

            const queryRequest = new SDQLQueryRequest(
              consentContractAddress,
              query,
              eligibleRewards
            );

            context.publicEvents.onQueryPosted.next(queryRequest);
            return okAsync(undefined);
          })
        })
      })    
  }

  protected compareRewards(coreCreatedRewards: EligibleReward[], serverCreatedRewards: EligibleReward[]): boolean{
    if (coreCreatedRewards.length !== serverCreatedRewards.length){
      return false;
    }
    return serverCreatedRewards.every((element, index) => {
      if (element != coreCreatedRewards[index]){
        return false;
      }
      return true;
    })
  }

  public processQuery(
    consentContractAddress: EVMContractAddress,
    query: SDQLQuery,
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
            .handleQuery(query, consentToken!.dataPermissions)
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
                )
                .map((earnedRewards) => {
                  console.log("insight delivery api call done");

                  /* For Direct Rewards, add EarnedRewards to the wallet */
                  earnedRewards.map((reward) => {
                    this.persistenceRepo.addEarnedReward(reward);
                  })
                  
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
