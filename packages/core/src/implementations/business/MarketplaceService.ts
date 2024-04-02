/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { ILogUtils, ILogUtilsType } from "@snickerdoodlelabs/common-utils";
import { IConsentContract } from "@snickerdoodlelabs/contracts-sdk";
import {
  AjaxError,
  BlockchainProviderError,
  ConsentFactoryContractError,
  EvaluationError,
  EVMContractAddress,
  IpfsCID,
  RequestForData,
  UninitializedError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  ConsentContractError,
  DuplicateIdInSchema,
  EvalNotImplementedError,
  MissingTokenConstructorError,
  ParserError,
  PersistenceError,
  QueryExpiredError,
  QueryFormatError,
  ConsentError,
  MissingASTError,
  MissingWalletDataTypeError,
  BlockchainCommonErrors,
  EarnedReward,
  InvalidParametersError,
} from "@snickerdoodlelabs/objects";
import { inject, injectable } from "inversify";
import { okAsync, ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import {
  IMarketplaceService,
  IQueryService,
  IQueryServiceType,
} from "@core/interfaces/business/index.js";
import {
  IQueryParsingEngineType,
  IQueryParsingEngine,
} from "@core/interfaces/business/utilities/index.js";
import {
  IMarketplaceRepositoryType,
  IMarketplaceRepository,
  IConsentContractRepository,
  IConsentContractRepositoryType,
  ISDQLQueryRepository,
  ISDQLQueryRepositoryType,
  ILinkedAccountRepository,
  ILinkedAccountRepositoryType,
} from "@core/interfaces/data/index.js";
import {
  IConfigProviderType,
  IConfigProvider,
  IContextProvider,
  IContextProviderType,
  IDataWalletUtils,
  IDataWalletUtilsType,
} from "@core/interfaces/utilities/index.js";

@injectable()
export class MarketplaceService implements IMarketplaceService {
  public constructor(
    @inject(IMarketplaceRepositoryType)
    protected marketplaceRepo: IMarketplaceRepository,
    @inject(IConsentContractRepositoryType)
    protected consentContractRepository: IConsentContractRepository,
    @inject(IQueryServiceType)
    protected queryService: IQueryService,
    @inject(ISDQLQueryRepositoryType)
    protected sdqlQueryRepo: ISDQLQueryRepository,
    @inject(ILogUtilsType) protected logUtils: ILogUtils,
    @inject(IConfigProviderType)
    protected configProvider: IConfigProvider,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
    @inject(IDataWalletUtilsType)
    protected dataWalletUtils: IDataWalletUtils,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
    @inject(ILinkedAccountRepositoryType)
    protected accountRepo: ILinkedAccountRepository,
  ) {}

  public getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive = true,
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
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
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  > {
    return this.marketplaceRepo.getListingsTotalByTag(tag);
  }

  public getRecommendationsByListing(
    listing: MarketplaceListing,
    stakingToken: EVMContractAddress,
  ): ResultAsync<
    MarketplaceTag[],
    | UninitializedError
    | BlockchainProviderError
    | ConsentContractError
    | BlockchainCommonErrors
    | InvalidParametersError
  > {
    return this.marketplaceRepo.getRecommendationsByListing(
      listing,
      stakingToken,
    );
  }

  public getEarnedRewardsByContractAddress(
    contractAddresses: EVMContractAddress[],
  ): ResultAsync<
    Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>,
    | AjaxError
    | EvaluationError
    | QueryFormatError
    | ParserError
    | QueryExpiredError
    | DuplicateIdInSchema
    | MissingTokenConstructorError
    | MissingASTError
    | MissingWalletDataTypeError
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | ConsentContractError
    | BlockchainCommonErrors
    | PersistenceError
    | EvalNotImplementedError
    | ConsentError
  > {
    if (!contractAddresses) {
      return okAsync(new Map());
    }
    return this.accountRepo
      .getEarnedRewards()
      .andThen((earnedRewards) => {
        if (earnedRewards.length === 0) {
          return okAsync([]);
        }
        return ResultUtils.combine(
          contractAddresses.map((address) => {
            return this.getPublishedQueries(address).map((queries) => {
              return new Map([
                [
                  address,
                  this.matchEarnedRewardsToQueries(earnedRewards, queries),
                ],
              ]) as Map<EVMContractAddress, Map<IpfsCID, EarnedReward[]>>;
            });
          }),
        );
      })
      .map((arrayofMaps) => {
        if (arrayofMaps.length === 0) {
          return new Map();
        }
        return this.mergeArrayOfMapsOfMaps(arrayofMaps);
      });
  }

  private matchEarnedRewardsToQueries(
    earnedRewards: EarnedReward[],
    queries: IpfsCID[],
  ): Map<IpfsCID, EarnedReward[]> {
    return new Map<IpfsCID, EarnedReward[]>(
      queries.map((cid) => {
        const matchingRewards = earnedRewards.filter(
          (reward) => reward.queryCID === cid,
        );
        return [cid, matchingRewards];
      }),
    );
  }

  //Assumes Unique L
  private mergeArrayOfMapsOfMaps<K, L, M>(
    arrayofMaps: Map<K, Map<L, M>>[],
  ): Map<K, Map<L, M>> {
    const flattenedMap = new Map<K, Map<L, M>>();
    arrayofMaps.forEach((mapArray) => {
      for (const [key, value] of mapArray) {
        flattenedMap.set(key, value);
      }
    });
    return flattenedMap;
  }

  private getPublishedQueries(
    contractAddress: EVMContractAddress,
  ): ResultAsync<
    IpfsCID[],
    | BlockchainProviderError
    | UninitializedError
    | ConsentFactoryContractError
    | ConsentContractError
  > {
    return this.getConsentContract(contractAddress)
      .andThen((contract) => {
        return this.getPublishedQueriesPerContract(contract);
      })
      .orElse((e) => {
        this.logUtils.warning(
          `No contract could be retrieved with address ${contractAddress}. ` +
            `Returning [] as published queries. Error message: ${e.message}`,
        );
        return okAsync([]);
      });
  }

  private getConsentContract(
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

  private getPublishedQueriesPerContract(
    consentContract: IConsentContract,
  ): ResultAsync<IpfsCID[], ConsentContractError | BlockchainCommonErrors> {
    return this._getRequestForDataList(consentContract).map((r4dList) =>
      r4dList.map((r4d) => r4d.requestedCID),
    );
  }

  private _getRequestForDataList(
    consentContract: IConsentContract,
  ): ResultAsync<
    RequestForData[],
    ConsentContractError | BlockchainCommonErrors
  > {
    return consentContract.getConsentOwner().andThen((consentOwner) => {
      return consentContract.getRequestForDataListByRequesterAddress(
        consentOwner,
      );
    });
  }
}
