import { IContextProvider, IContextProviderType } from "@browser-extension/interfaces/utilities";
import { IQueryService } from "@query-engine/interfaces/business";
import { IConsentRepository, IConsentRepositoryType, ISDQLQueryRepository, ISDQLQueryRepositoryType } from "@query-engine/interfaces/data";
import { EthereumContractAddress, IpfsCID } from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { errAsync, okAsync, ResultAsync } from "neverthrow";

@injectable()
export class QueryService implements IQueryService {
    public constructor(@inject(ISDQLQueryRepositoryType) protected sdqlQueryRepo: ISDQLQueryRepository,
    @inject(IConsentRepositoryType) protected consentRepo: IConsentRepository,
    @inject(IContextProviderType) protected contextProvider: IContextProvider, ) {}
    
    public onQueryPosted(contractAddress: EthereumContractAddress, 
        queryId: IpfsCID): ResultAsync<void, Error> {
        // Get the IPFS data for the query. This is just "Get the query";
        return this.sdqlQueryRepo.getByCID([queryId]).andThen((queries) => {
            const query = queries.get(queryId);

            if (query == null) {
                // The query doesn't actually exist
                // Maybe it's not resolved in IPFS yet, we should store this CID and try again later.
                return okAsync(undefined);
            }

            // We have the query, next step is check consent
            return this.consentRepo.getByContractAddresses(contractAddress).andThen((consentTokens) => {
                // Still have query and now consentTokens
                // Check if you actually have a consent token for this business
                const consentToken = consentTokens.get(contractAddress);

                if (consentToken == null) {
                    // No consent given!
                    return errAsync(new Error("No consent token!"));
                }

                // We have a consent token! 
                return this.contextProvider.getContext().map((context) => {
                    context.onQueryPosted.next(query);
                });
            })

        })
        
    }
    
}