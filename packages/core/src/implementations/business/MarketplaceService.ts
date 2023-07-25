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
  PossibleReward,
  RequestForData,
  UninitializedError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  ConsentContractError,
  ConsentToken,
  EVMPrivateKey,
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
  IConsentTokenUtilsType,
  IConsentTokenUtils,
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
} from "@core/interfaces/data/index.js";
import { CoreConfig } from "@core/interfaces/objects/index.js";
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
    @inject(IConsentTokenUtilsType)
    protected consentTokenUtils: IConsentTokenUtils,
    @inject(IContextProviderType)
    protected contextProvider: IContextProvider,
    @inject(IDataWalletUtilsType)
    protected dataWalletUtils: IDataWalletUtils,
    @inject(IQueryParsingEngineType)
    protected queryParsingEngine: IQueryParsingEngine,
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
  ): ResultAsync<
    MarketplaceTag[],
    | UninitializedError
    | BlockchainProviderError
    | ConsentContractError
    | BlockchainCommonErrors
  > {
    return this.marketplaceRepo.getRecommendationsByListing(listing);
  }

  public getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs: number,
  ): ResultAsync<
    Map<EVMContractAddress, PossibleReward[]>,
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

  private _getPossibleRewards(
    queryCids: IpfsCID[],
    timeoutMs: number,
  ): ResultAsync<
    PossibleReward[],
    | AjaxError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | PersistenceError
    | EvalNotImplementedError
    | UninitializedError
    | BlockchainProviderError
    | ConsentContractError
    | ConsentError
    | MissingASTError
    | BlockchainCommonErrors
  > {
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
  ): ResultAsync<
    PossibleReward[],
    | AjaxError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | ParserError
    | EvaluationError
    | QueryFormatError
    | QueryExpiredError
    | MissingTokenConstructorError
    | DuplicateIdInSchema
    | PersistenceError
    | EvalNotImplementedError
    | MissingASTError
  > {
    return this.sdqlQueryRepo
      .getSDQLQueryByCID(queryCid, timeoutMs)
      .andThen((sdqlQuery) => {
        if (sdqlQuery == null) {
          return okAsync([]);
        }
        return this.queryParsingEngine.constructPossibleRewardsFronQuery(
          sdqlQuery,
        );
      });
  }
}
