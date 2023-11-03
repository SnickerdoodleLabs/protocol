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
  EarnedReward,
  IpfsCID,
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

  getEarnedRewardsByContractAddress(
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
  >;
}

export const IMarketplaceServiceType = Symbol.for("IMarketplaceService");
