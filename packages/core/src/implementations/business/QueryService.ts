import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EVMAccountAddress,
  EVMContractAddress, IpfsCID,
  IPFSError, QueryFormatError,
  UninitializedError
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IQueryService } from "@core/interfaces/business";
import {
  IQueryParsingEngine,
  IQueryParsingEngineType
} from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType
} from "@core/interfaces/data";
import { CoreConfig, CoreContext, InsightString } from "@core/interfaces/objects";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType
} from "@core/interfaces/utilities";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/common-utils";
import { EligibleReward } from "@snickerdoodlelabs/objects";
import { insightDeliveryTypes } from "@snickerdoodlelabs/signature-verification";
import { EVMPrivateKey } from "@snickerdoodlelabs/objects";
import { DataWalletAddress } from "@snickerdoodlelabs/objects";

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
    @inject(IContextProviderType) protected contextProvider: IContextProvider,
    @inject(IConfigProviderType) protected configProvider: IConfigProvider,
    @inject(ICryptoUtilsType) protected cryptoUtils: ICryptoUtils,
  ) {}

  public onQueryPosted(
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
  ): ResultAsync<
    void,
    | IPFSError
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  > {
    // Get the IPFS data for the query. This is just "Get the query";

    // Cache 
    // if (!this.safeUpdateQueryContractMap(queryId, consentContractAddress)) {
    //   return errAsync(new ConsentContractError(`Duplicate contract address for ${queryId}. new = ${consentContractAddress}, existing = ${this.queryContractMap.get(queryId)}`)); ))
    // }

    return ResultUtils.combine([
      this.sdqlQueryRepo.getByCID(queryId),
      this.contextProvider.getContext(),
    ]).andThen(([query, context]) => {
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
          context.publicEvents.onQueryPosted.next({consentContractAddress: consentContractAddress, queryId: queryId});

          return okAsync(undefined);
        });
    });
  }

  // safeUpdateQueryContractMap(queryId: IpfsCID, consentContractAddress: EVMContractAddress): boolean {

  //   const existingConsentAddress = this.queryContractMap.get(queryId)
  //   if (existingConsentAddress && (existingConsentAddress !== consentContractAddress)) {
  //     return false;
  //   }
  //   return true;
  // }

  public processQuery(
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID
  ): ResultAsync<
    void,
    | AjaxError 
    | UninitializedError 
    | ConsentError 
    | IPFSError
    | QueryFormatError
  
  > {
    // 1. Parse the query
    // 2. Generate an insight(s)
    // 3. Redeem the reward
    // 4. Deliver the insight
    
    return ResultUtils.combine([
      this.contextProvider.getContext(),
      this.configProvider.getConfig(),
    ]).andThen(([context, config]) => {
      

      const err = this.validateContextConfig(context, config);
      if (err) {
        return errAsync(err);
      }

      // if (context.dataWalletAddress == null || context.dataWalletKey == null) {
      //   return errAsync(
      //     new UninitializedError("Data wallet has not been unlocked yet!"),
      //   );
      // }

      return this.sdqlQueryRepo
        .getByCID(queryId)
        .andThen((query) => {
          if (!query) {
            return errAsync(new IPFSError("Query not found " + queryId));
          }

          return this.queryParsingEngine.handleQuery(query);

        }).andThen((maps) => {

          const maps2 = maps as  [InsightString[], EligibleReward[]];
          const insights = maps2[0];
          const rewards = maps2[1];

          console.log(insights, rewards);

          return this.deliverInsights(context, config, consentContractAddress, queryId, insights)
            .map(() => {
              // take it back to the caller?
              console.log("insight delivery api call done");
              context.publicEvents.onQueryPosted.next({consentContractAddress, queryId});
            });;
          
        });
        

    });

    // Get the IPFS data for the query. This is just "Get the query";
    // return this.sdqlQueryRepo
    //   .getByCID(queryId)
    //   .andThen((query) => {
    //     if (query == null) {
    //       // The query doesn't actually exist
    //       // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
    //       // Andrew - commented out Error, Error and never do not correlate with entire system
    //       return errAsync(new ConsentError("No consent token!"));
    //     }

    //     // Convert string to an object
    //     const queryContent = JSON.parse(query.query) as ISDQLQueryObject;

    //     // Break down the actual parts of the query.
    //     return this.queryParsingEngine.handleQuery(queryContent);
    //   }).andThen((insights) => {
    //     // return this.insightPlatformRepo.deliverInsights(insights);
    //     return errAsync(new UninitializedError("TODO"))
    //   });

      // .andThen((insights) => {
      //   // Get the reward
      //   const insightMap = insights.reduce((prev, cur) => { // TODO rename prev to map or prevMap
      //     prev.set(cur.queryId, cur);
      //     return prev;
      //   }, new Map<IpfsCID, Insight>());

      //   // Looking for keys or values - Andrew
      //   // IpfsCID or Insight?
      //   return this.insightPlatformRepo
      //     .claimReward(Array.from(insightMap.values()))
      //     .andThen((rewardsMap) => {
      //       return this.insightPlatformRepo.deliverInsights(insights);
      //     });
      // });
  }

  public validateContextConfig(context: CoreContext, config: CoreConfig): UninitializedError | null {
    
    if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return new UninitializedError("Data wallet has not been unlocked yet!");
    }
    return null;
  }

  public deliverInsights(context: CoreContext, config: CoreConfig, consentContractAddress: EVMContractAddress, queryId: IpfsCID, insights: InsightString[])
  : ResultAsync<
    void,
    | AjaxError 
    | UninitializedError 
    | ConsentError 
    | IPFSError
    | QueryFormatError> {
    
    const returns = JSON.stringify(insights);

    const signableData = this.createSignable(context, consentContractAddress, queryId, returns);
    
    return this.cryptoUtils
      .signTypedData(
        config.snickerdoodleProtocolDomain,
        insightDeliveryTypes,
        signableData,
        context.dataWalletKey as EVMPrivateKey,
      )
      .andThen((signature) => {

        console.log('signature', signature);

        const res = this.insightPlatformRepo.deliverInsights(
          context.dataWalletAddress as DataWalletAddress,
          consentContractAddress,
          queryId,
          signature,
          returns
        )

        console.log('res', res);
        return res
      })


  }

  public createSignable(context: CoreContext, consentContractAddress: EVMContractAddress, queryId: IpfsCID, returns: string) {
    return {
      consentContractId: consentContractAddress,
      queryId,
      dataWallet: context.dataWalletAddress,
      returns: JSON.stringify(returns),
    } as Record<string, unknown>;
  }
}