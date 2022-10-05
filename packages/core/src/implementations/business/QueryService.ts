/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TypedDataField } from "@ethersproject/abstract-signer";
import {
  ICryptoUtils,
  ICryptoUtilsType,
} from "@snickerdoodlelabs/common-utils";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EvaluationError,
  EVMAccountAddress,
  EVMContractAddress,
  IpfsCID,
  IPFSError,
  QueryFormatError,
  UninitializedError,
  EligibleReward,
  EVMPrivateKey,
  DataWalletAddress,
  SDQLQuery,
  SDQLQueryRequest,
  ConsentToken,
} from "@snickerdoodlelabs/objects";
import { insightDeliveryTypes } from "@snickerdoodlelabs/signature-verification";
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
  CoreConfig,
  CoreContext,
  InsightString,
} from "@core/interfaces/objects";
import {
  IConfigProvider,
  IConfigProviderType,
  IContextProvider,
  IContextProviderType,
} from "@core/interfaces/utilities";

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
  ) {}

  /* TODO: implementation
  public onQueryAccepted(): ResultAsync<void, IPFSError>{

  }
  */

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

    /* Extend onQueryPosted to include the preview */
    /* 
      "IF I pariticlate in query 1,3,5 I should get data 2 and 4 right?"
    */
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
          const queryRequest = new SDQLQueryRequest(
            consentContractAddress,
            query,
          );
          context.publicEvents.onQueryPosted.next(queryRequest);

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

        /* 
          ENGT-745 
          1. Create RewardsPreview - currently returning AST_Compensations instead of EligibleReward, will change the class later
          2. 
        */
        return this.queryParsingEngine.getRewardsPreview(query, consentToken!.dataPermissions).andThen( 
          (rewardsPreviews) => {
              /* 
                ENGT-745 
                2. Send out prompt for previews

                MUKTADIR! - THIS IS WHERE THE PROMPT IS SENT OUT
              */
             if (true){
              return okAsync(true);
             }
        }).andThen(() => {
          return this.queryParsingEngine
            .handleQuery(query, consentToken!.dataPermissions)
            .andThen((maps) => {
              // console.log("QueryParsingEngine HandleQuery");
              const maps2 = maps as [InsightString[], EligibleReward[]];
              const insights = maps2[0];
              const rewards = maps2[1];

              return this.deliverInsights(
                context,
                config,
                consentContractAddress,
                query.cid,
                insights,
              ).map(() => {
                console.log("insight delivery api call done");
                // context.publicEvents.onQueryPosted.next({
                //   consentContractAddress,
                //   query,
                // });
              });
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

  public deliverInsights(
    context: CoreContext,
    config: CoreConfig,
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
    insights: InsightString[],
  ): ResultAsync<
    void,
    AjaxError | UninitializedError | ConsentError | IPFSError | QueryFormatError
  > {
    const signableData = this.createSignable(
      context,
      consentContractAddress,
      queryId,
      JSON.stringify(insights),
    );

    return this.cryptoUtils
      .signTypedData(
        config.snickerdoodleProtocolDomain,
        insightDeliveryTypes,
        signableData,
        context.dataWalletKey!,
      )
      .andThen((signature) => {
        // console.log('signature', signature);

        const res = this.insightPlatformRepo.deliverInsights(
          context.dataWalletAddress as DataWalletAddress,
          consentContractAddress,
          queryId,
          signature,
          insights,
        );

        // console.log('res', res);
        return res;
      });
  }

  public createSignable(
    context: CoreContext,
    consentContractAddress: EVMContractAddress,
    queryId: IpfsCID,
    returns: string,
  ) {
    return {
      consentContractId: consentContractAddress,
      queryCid: queryId,
      dataWallet: context.dataWalletAddress,
      returns: returns,
    } as Record<string, unknown>;
  }
}
