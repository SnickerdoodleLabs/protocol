import {
  BlockchainProviderError,
  UninitializedError,
  ConsentFactoryContractError,
  MarketplaceListing,
  MarketplaceTag,
  PagedResponse,
  PagingRequest,
  ConsentContractError,
  EvaluationError,
  EVMContractAddress,
  PossibleReward,
  AjaxError,
  ConsentError,
  DuplicateIdInSchema,
  EvalNotImplementedError,
  MissingTokenConstructorError,
  ParserError,
  PersistenceError,
  QueryExpiredError,
  QueryFormatError,
  MissingASTError,
  MissingWalletDataTypeError,
  BlockchainCommonErrors,
} from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IMarketplaceService {
  getMarketplaceListingsByTag(
    pagingReq: PagingRequest,
    tag: MarketplaceTag,
    filterActive?: boolean,
  ): ResultAsync<
    PagedResponse<MarketplaceListing>,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;

  getListingsTotalByTag(
    tag: MarketplaceTag,
  ): ResultAsync<
    number,
    | UninitializedError
    | BlockchainProviderError
    | ConsentFactoryContractError
    | BlockchainCommonErrors
  >;

  getRecommendationsByListing(
    listing: MarketplaceListing,
  ): ResultAsync<
    MarketplaceTag[],
    | UninitializedError
    | BlockchainProviderError
    | ConsentContractError
    | BlockchainCommonErrors
  >;

  getPossibleRewards(
    contractAddresses: EVMContractAddress[],
    timeoutMs: number,
  ): ResultAsync<
    Map<EVMContractAddress, PossibleReward[]>,
    | AjaxError
    | MissingWalletDataTypeError
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
    | ConsentFactoryContractError
    | MissingASTError
  >;
}

export const IMarketplaceServiceType = Symbol.for("IMarketplaceService");
