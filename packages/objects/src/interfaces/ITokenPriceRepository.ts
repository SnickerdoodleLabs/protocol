import { ResultAsync } from "neverthrow";

import {
  TokenAddress,
  TokenInfo,
  TokenMarketData,
} from "@objects/businessObjects";
import {
  AccountIndexingError,
  AjaxError,
  PersistenceError,
} from "@objects/errors";
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
    AccountIndexingError | AjaxError
  >;

  getTokenInfoFromList(
    contractAddress: TokenAddress,
  ): CoinGeckoTokenInfo | undefined;
}

export const ITokenPriceRepositoryType = Symbol.for("ITokenPriceRepository");

export interface CoinGeckoTokenInfo {
  id: string;
  symbol: string;
  name: string;
  protocols: string[];
}
