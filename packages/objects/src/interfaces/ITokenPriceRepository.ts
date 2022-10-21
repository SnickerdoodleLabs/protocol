import { ResultAsync } from "neverthrow";

import { TokenAddress } from "@objects/businessObjects";
import { AccountIndexingError } from "@objects/errors";
import { ChainId } from "@objects/primitives";

export interface ITokenPriceRepository {
  initialize(): ResultAsync<void, AccountIndexingError>;
  getTokenPrice(
    chainId: ChainId,
    contractAddress: TokenAddress | null,
    date: Date,
  ): ResultAsync<number, AccountIndexingError>;
}

export const ITokenPriceRepositoryType = Symbol.for("ITokenPriceRepository");
