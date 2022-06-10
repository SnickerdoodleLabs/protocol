import { IQueryParsingEngine, IQueryParsingEngineType } from "@browser-extension/interfaces/business/utilities";
import { IContextProvider, IContextProviderType } from "@browser-extension/interfaces/utilities";
import { IQueryService } from "@query-engine/interfaces/business";
import { IConsentRepository, IConsentRepositoryType, IInsightPlatformRepository, IInsightPlatformRepositoryType, ISDQLQueryRepository, ISDQLQueryRepositoryType } from "@query-engine/interfaces/data";
import { inject, injectable } from "inversify";
import { combine, errAsync, okAsync, ResultAsync } from "neverthrow";
import { EthereumContractAddress, Insight, IpfsCID, ISDQLQueryObject } from "@snickerdoodlelabs/objects";
import { NoEmitOnErrorsPlugin } from "webpack";


@injectable()
export class QueryService implements IQueryService {
    public constructor(@inject(IQueryParsingEngineType) protected queryParsingEngine: IQueryParsingEngine,
        @inject(ISDQLQueryRepositoryType) protected sdqlQueryRepo: ISDQLQueryRepository,
        @inject(IInsightPlatformRepositoryType) protected insightPlatformRepo: IInsightPlatformRepository,
        @inject(IConsentRepositoryType) protected consentRepo: IConsentRepository,
        @inject(IContextProviderType) protected contextProvider: IContextProvider,) { }

    public onQueryPosted(contractAddress: EthereumContractAddress,
        queryId: IpfsCID): ResultAsync<void, never> {
        // Get the IPFS data for the query. This is just "Get the query";
        return this.sdqlQueryRepo.getByCID([queryId]).andThen((queries) => {
            const query = queries.get(queryId);

            if (query == null) {
                // The query doesn't actually exist
                // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
                return okAsync(undefined);
            }

            // We have the query, next step is check consent
            return this.consentRepo.getByContractAddress(contractAddress).andThen((consentTokens) => {
                // Still have query and now consentTokens
                // Check if you actually have a consent token for this business
                const consentToken = consentTokens.get(contractAddress);

                if (consentToken == null) {
                    // No consent given!
                    // Andrew - commented out Error, Error and never do not correlate with entire system
                    // return errAsync(new Error("No consent token!"));
                }

                // We have a consent token! 
                return this.contextProvider.getContext().map((context) => {
                    context.onQueryPosted.next(query);
                });
            })

        });
    }

    public processQuery(queryId: IpfsCID): ResultAsync<void, Error> {
        // 1. Parse the query
        // 2. Generate an insight(s)
        // 3. Redeem the reward
        // 4. Deliver the insight

        // Get the IPFS data for the query. This is just "Get the query";
        return this.sdqlQueryRepo.getByCID([queryId]).andThen((queries) => {
            const query = queries.get(queryId);

            if (query == null) {
                // The query doesn't actually exist
                // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
                // Andrew - commented out Error, Error and never do not correlate with entire system
                return errAsync(new Error("No consent token!"));
            }

            // Convert string to an object
            const queryContent = JSON.parse(query.query) as ISDQLQueryObject;

            // Break down the actual parts of the query. 
            return this.queryParsingEngine.handleQuery(queryContent)
        })
            .andThen((insights) => {
                // Get the reward
                const insightMap = insights.reduce((prev, cur) => {
                    prev.set(cur.queryId, cur);
                    return prev;
                },
                    new Map<IpfsCID, Insight>());

                // Looking for keys or values - Andrew
                // IpfsCID or Insight?
                return this.insightPlatformRepo.claimReward(Array.from(insightMap.values()))
                    .andThen((rewardsMap) => {
                        return this.insightPlatformRepo.deliverInsights(insights);
                    });
            })
    }
}