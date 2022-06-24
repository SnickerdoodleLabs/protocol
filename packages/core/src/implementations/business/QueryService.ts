import {
  AjaxError,
  BlockchainProviderError,
  ConsentContractError,
  ConsentContractRepositoryError,
  ConsentError,
  EthereumAccountAddress,
  EthereumContractAddress,
  Insight,
  IpfsCID,
  ISDQLQueryObject,
  UninitializedError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IQueryParsingEngine,
  IQueryParsingEngineType,
} from "@browser-extension/interfaces/business/utilities";
import {
  IContextProvider,
  IContextProviderType,
} from "@browser-extension/interfaces/utilities";
import { IQueryService } from "@core/interfaces/business";
import {
  IConsentContractRepository,
  IConsentContractRepositoryType,
  IInsightPlatformRepository,
  IInsightPlatformRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
} from "@core/interfaces/data";

@injectable()
export class QueryService implements IQueryService {
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
  ) {}

  public onQueryPosted(
    consentContractAddress: EthereumContractAddress,
    queryId: IpfsCID,
  ): ResultAsync<
    void,
    | ConsentContractError
    | ConsentContractRepositoryError
    | UninitializedError
    | BlockchainProviderError
    | AjaxError
    | ConsentError
  > {
    // Get the IPFS data for the query. This is just "Get the query";
    return ResultUtils.combine([
      this.sdqlQueryRepo.getByCID([queryId]),
      this.contextProvider.getContext(),
    ]).andThen(([queries, context]) => {
      const query = queries.get(queryId);

      if (query == null) {
        // The query doesn't actually exist
        // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
        return okAsync(undefined);
      }

      if (context.dataWalletAddress != null) {
        // We have the query, next step is check if you actually have a consent token for this business
        return this.consentContractRepository
          .isAddressOptedIn(
            consentContractAddress,
            EthereumAccountAddress(context.dataWalletAddress),
          )
          .andThen((addressOptedIn) => {
            if (addressOptedIn == false) {
              // No consent given!
              return errAsync(
                new ConsentError(
                  `No consent token for address ${context.dataWalletAddress}!`,
                ),
              );
            }
            // We have a consent token!
            context.publicEvents.onQueryPosted.next(query);

            return okAsync(undefined);
          });
      }

      return okAsync(undefined);
    });
  }

  public processQuery(
    queryId: IpfsCID,
  ): ResultAsync<void, UninitializedError | ConsentError> {
    // 1. Parse the query
    // 2. Generate an insight(s)
    // 3. Redeem the reward
    // 4. Deliver the insight

    // Get the IPFS data for the query. This is just "Get the query";
    return this.sdqlQueryRepo
      .getByCID([queryId])
      .andThen((queries) => {
        const query = queries.get(queryId);

        if (query == null) {
          // The query doesn't actually exist
          // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
          // Andrew - commented out Error, Error and never do not correlate with entire system
          return errAsync(new ConsentError("No consent token!"));
        }

        // Convert string to an object
        const queryContent = JSON.parse(query.query) as ISDQLQueryObject;

        // Break down the actual parts of the query.
        return this.queryParsingEngine.handleQuery(queryContent);
      })
      .andThen((insights) => {
        // Get the reward
        const insightMap = insights.reduce((prev, cur) => {
          prev.set(cur.queryId, cur);
          return prev;
        }, new Map<IpfsCID, Insight>());

        // Looking for keys or values - Andrew
        // IpfsCID or Insight?
        return this.insightPlatformRepo
          .claimReward(Array.from(insightMap.values()))
          .andThen((rewardsMap) => {
            return this.insightPlatformRepo.deliverInsights(insights);
          });
      });
  }
}
