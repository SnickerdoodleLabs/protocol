import { ResultAsync } from "neverthrow";

import {
  TokenAddress,
  TokenInfo,
  TokenMarketData,
} from "@objects/businessObjects/index.js";
import { EChain } from "@objects/enum/index.js";
import {
  AccountIndexingError,
  AjaxError,
  PersistenceError,
} from "@objects/errors";
import { ChainId, UnixTimestamp } from "@objects/primitives/index.js";

export interface ITokenPriceRepository {
  getTokenInfo(
    chain: EChain,
    contractAddress: TokenAddress,
  ): ResultAsync<TokenInfo | null, AccountIndexingError>;

  addTokenInfo(info: TokenInfo): ResultAsync<void, PersistenceError>;

  getTokenPrice(
    chain: EChain,
    contractAddress: TokenAddress,
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
