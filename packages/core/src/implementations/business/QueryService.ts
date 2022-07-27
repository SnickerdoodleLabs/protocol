import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EVMAccountAddress,
  EVMContractAddress,
  Insight,
  IpfsCID,
  IPFSError,
  ISDQLQueryObject,
  QueryFormatError,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { IQueryService } from "@core/interfaces/business";
import {
  IQueryParsingEngine,
  IQueryParsingEngineType,
} from "@core/interfaces/business/utilities";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
} from "@core/interfaces/data";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";
import { QueryReponse } from "@core/interfaces/objects/QueryResponse";
import { TypedDataField } from "@ethersproject/abstract-signer";
import { ICryptoUtils, ICryptoUtilsType } from "@snickerdoodlelabs/common-utils";
import { Reward } from "@snickerdoodlelabs/objects";
import { EligibleReward } from "@snickerdoodlelabs/objects";
import { InsightString } from "@core/interfaces/objects";
import { insightDeliveryTypes } from "@snickerdoodlelabs/signature-verification";

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
          context.publicEvents.onQueryPosted.next({consentContractAddress: consentContractAddress, query: query});

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
      
      if (context.dataWalletAddress == null || context.dataWalletKey == null) {
        return errAsync(
          new UninitializedError("Data wallet has not been unlocked yet!"),
        );
      }

      // Need to sign the request to deliverInsights
      // const value = {
      //   consentContractAddress: consentContractAddress,
      // } as Record<string, unknown>;

      // const types: Record<string, TypedDataField[]> = {
      //   InsightDelivery: [{ 
      //     name: "consentContractAddress", 
      //     type: "string" 
      //   }],
      // };
      const value = {
        consentContractId: consentContractAddress,
        queryId,
        dataWallet: context.dataWalletAddress,
        returns: "hello world",
      } as Record<string, unknown>;
      
      return this.cryptoUtils
        .signTypedData(
          config.snickerdoodleProtocolDomain,
          insightDeliveryTypes,
          value,
          context.dataWalletKey,
        )
        .andThen((signature) => {
          return this.sdqlQueryRepo
            .getByCID(queryId)
            .andThen((query) => {
              if (!query) {
                return errAsync(new IPFSError("Query not found " + queryId));
              }
    
              // TODO parse, evaluate, combine
    
              // Convert string to an object
              // const queryContent = JSON.parse(query.query) as ISDQLQueryObject;
    
              // Break down the actual parts of the query.
              return this.queryParsingEngine.handleQuery(query);
            }).andThen((maps) => {
              // return this.insightPlatformRepo.deliverInsights(insights);
              const insights = maps[0];
              const rewards = maps[1];

              console.log(insights, rewards);
              return errAsync(new UninitializedError("TODO"))
            });
        }).andThen((insights) => {
          // return this.insightPlatformRepo.deliverInsights(insights);
          return errAsync(new UninitializedError("TODO"))
        });

      // return this.sdqlQueryRepo
      //   .getByCID(queryId)
      //   .andThen((query) => {
      //     if (!query) {
      //       return errAsync(new IPFSError("Query not found " + queryId));
      //     }

      //     // TODO parse, evaluate, combine

      //     // Convert string to an object
      //     const queryContent = JSON.parse(query.query) as ISDQLQueryObject;

      //     // Break down the actual parts of the query.
      //     return this.queryParsingEngine.handleQuery(queryContent);
      //   }).andThen((insights) => {
      //     // return this.insightPlatformRepo.deliverInsights(insights);
      //     return errAsync(new UninitializedError("TODO"))
      //   });

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
}