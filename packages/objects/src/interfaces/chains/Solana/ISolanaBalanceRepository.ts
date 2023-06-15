import { ResultAsync } from "neverthrow";

import { TokenBalance } from "@objects/businessObjects/index.js";
import { AccountIndexingError, AjaxError } from "@objects/errors/index.js";
import { ChainId, SolanaAccountAddress } from "@objects/primitives/index.js";

export interface ISolanaBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
}
