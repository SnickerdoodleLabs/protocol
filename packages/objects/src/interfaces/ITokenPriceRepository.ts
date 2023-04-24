import { ResultAsync } from "neverthrow";

import {
  TokenAddress,
  TokenInfo,
  TokenMarketData,
} from "@objects/businessObjects";
import { AccountIndexingError, PersistenceError } from "@objects/errors";
import { ChainId, UnixTimestamp } from "@objects/primitives";

export interface ITokenPriceRepository {
  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, AccountIndexingError>;

  addTokenInfo(info: TokenInfo): ResultAsync<void, PersistenceError>;

  // null implies native token
  getTokenPrice(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
    timestamp: UnixTimestamp,
  ): ResultAsync<number, AccountIndexingError>;

  getTokenMarketData(
    ids: string[],
  ): ResultAsync<TokenMarketData[], AccountIndexingError>;

  getMarketDataForTokens(
    tokens: { chain: ChainId; address: TokenAddress | null }[],
  ): ResultAsync<
    Map<`${ChainId}-${TokenAddress}`, TokenMarketData>,
    AccountIndexingError
  >;
}

export const ITokenPriceRepositoryType = Symbol.for("ITokenPriceRepository");
