import { ResultAsync } from "neverthrow";

import { TokenAddress, TokenInfo } from "@objects/businessObjects";
import { AccountIndexingError } from "@objects/errors";
import { ChainId } from "@objects/primitives";

export interface ITokenPriceRepository {
  getTokenInfo(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
  ): ResultAsync<TokenInfo | null, AccountIndexingError>;

  // null implies native token
  getTokenPrice(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
    date: Date,
  ): ResultAsync<number, AccountIndexingError>;
}

export const ITokenPriceRepositoryType = Symbol.for("ITokenPriceRepository");
