import { ResultAsync } from "neverthrow";

import { TokenBalance } from "@objects/businessObjects";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import { ChainId, SolanaAccountAddress } from "@objects/primitives";

export interface ISolanaBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
}
