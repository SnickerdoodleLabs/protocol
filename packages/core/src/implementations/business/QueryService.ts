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
} from "@core/interfaces/utilities/index.js";

@injectable()
export class QueryService implements IQueryService {
  // queryContractMap: Map<IpfsCID, EVMContractAddress> = new Map();

  public constructor(
    @inject(IConsentTokenUtilsType)
    protected consentTokenUtils: IConsentTokenUtils,
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
          const queryRequest = new SDQLQueryRequest(
            consentContractAddress,
            query,
          );
          // context.publicEvents.onQueryPosted.next({
          //   consentContractAddress: consentContractAddress,
          //   query: query,
          // });
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
      this.consentTokenUtils.getCurrentConsentToken(consentContractAddress),
    ]).andThen(([context, config, consentToken]) => {
      return this.validateContextConfig(
        context as CoreContext,
        config,
        consentToken,
      ).andThen(() => {
        return this.queryParsingEngine
          .handleQuery(query, consentToken!.dataPermissions)
          .andThen((maps) => {
            // console.log("QueryParsingEngine HandleQuery");
            const maps2 = maps as [InsightString[], EligibleReward[]];
            const insights = maps2[0];
            const rewards = maps2[1];

            return this.insightPlatformRepo
              .deliverInsights(
                context.dataWalletAddress!,
                consentContractAddress,
                consentToken!.tokenId,
                query.cid,
                insights,
                context.dataWalletKey!,
                config.defaultInsightPlatformBaseUrl,
              )
              .map(() => {
                console.log("insight delivery api call done");
                // context.publicEvents.onQueryPosted.next({
                //   consentContractAddress,
                //   query,
                // });
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
