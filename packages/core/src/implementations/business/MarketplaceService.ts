/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { IMarketplaceService } from "@core/interfaces/business/index.js";
import {
  IQueryParsingEngine,
  IQueryParsingEngineType,
} from "@core/interfaces/business/utilities/index.js";
import {
  IMarketplaceRepositoryType,
  IMarketplaceRepository,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
} from "@core/interfaces/data/index.js";
import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentFactoryContractError,
  EvaluationError,
  EVMContractAddress,
  IpfsCID,
  PossibleReward,
  RequestForData,
  UninitializedError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  ConsentContractError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

@injectable()
export class MarketplaceService implements IMarketplaceService {
  public constructor(
    @inject(IMarketplaceRepositoryType)
    protected marketplaceRepo: IMarketplaceRepository,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
    @inject(ISDQLQueryRepositoryType)
    protected sdqlQueryRepo: ISDQLQueryRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
  ) {}

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true,
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  > {
    return this.marketplaceRepo.getMarketplaceListingsByTag(
      pagingReq,
      tag,
      filterActive,
    );
  }

  public getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    UninitializedError | BlockchainProviderError | ConsentFactoryContractError
  > {
    return this.marketplaceRepo.getListingsTotalByTag(tag);
  }

  public getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    UninitializedError | BlockchainProviderError | ConsentContractError
  > {
    return this.marketplaceRepo.getRecommendationsByListing(listing);
  }

  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs: number,
  ): ResultAsync<Map<EVMContractAddress, PossibleReward[]>, EvaluationError> {
    if (!contractAddresses) {
      return okAsync(new Map());
    }
    return ResultUtils.combine(
      contractAddresses.map((address) => {
        return this._getPublishedQueries(address).andThen((queries) => {
          return this._getPossibleRewards(queries, timeoutMs).map(
            (rewards) =>
              [address, rewards] as [EVMContractAddress, PossibleReward[]],
          );
        });
      }),
    ).map(this._filterEmptyRewards);
  }

  private _filterEmptyRewards(
    contractToRewardsTuples: [EVMContractAddress, PossibleReward[]][],
  ): Map<EVMContractAddress, PossibleReward[]> {
    return new Map(
      contractToRewardsTuples.filter(
        (tuple) => tuple.length == 2 && tuple[1].length > 0,
      ),
    );
  }

  private _getPublishedQueries(
    contractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  > {
    return this._getConsentContract(contractAddress)
      .andThen((contract) => {
        return this._getPublishedQueriesPerContract(contract);
      })
      .orElse((e) => {
        this.logUtils.warning(
          `No contract could be retrieved with address ${contractAddress}. ` +
            `Returning [] as published queries. Error message: ${e.message}`,
        );
        return okAsync([]);
      });
  }

  private _getConsentContract(
    contractAddress: EVMContractAddress,
  ): ResultAsync<
    IConsentContract,
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  > {
    return this.consentContractRepository
      .getConsentContracts([contractAddress])
      .map((consentContractsMap) => consentContractsMap.get(contractAddress)!);
  }

  private _getPublishedQueriesPerContract(
    consentContract: IConsentContract,
  ): ResultAsync<IpfsCID[], ConsentContractError> {
    return this._getRequestForDataList(consentContract).map((r4dList) =>
      r4dList.map((r4d) => r4d.requestedCID),
    );
  }

  private _getRequestForDataList(
    consentContract: IConsentContract,
  ): ResultAsync<RequestForData[], ConsentContractError> {
    return consentContract.getConsentOwner().andThen((consentOwner) => {
      return consentContract.getRequestForDataListByRequesterAddress(
        consentOwner,
      );
    });
  }

  private _getPossibleRewards(
    queryCids: IpfsCID[],
    timeoutMs: number,
  ): ResultAsync<PossibleReward[], EvaluationError | AjaxError> {
    if (!queryCids || queryCids.length == 0) {
      return okAsync([]);
    }
    return ResultUtils.combine(
      queryCids.map((cid) => this._getPossibleRewardsPerQuery(cid, timeoutMs)),
    ).map((rewardsOfAllQueries) =>
      Array.from(new Set(rewardsOfAllQueries.flat())),
    );
  }

  private _getPossibleRewardsPerQuery(
    queryCid: IpfsCID,
    timeoutMs: number,
  ): ResultAsync<PossibleReward[], AjaxError | EvaluationError> {
    return this.sdqlQueryRepo
      .getSDQLQueryByCID(queryCid, timeoutMs)
      .andThen((sdqlQuery) => {
        if (sdqlQuery == null) {
          return okAsync([]);
        }
        return okAsync([])
      });
  }
}
