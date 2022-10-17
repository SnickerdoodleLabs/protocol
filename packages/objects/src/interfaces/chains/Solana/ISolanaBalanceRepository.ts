import { ResultAsync } from "neverthrow";

import { SolanaBalance } from "@objects/businessObjects";
import { AccountBalanceError, AjaxError } from "@objects/errors";
import { ChainId, SolanaAccountAddress } from "@objects/primitives";

export interface ISolanaBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: SolanaAccountAddress,
  ): ResultAsync<SolanaBalance[], AccountBalanceError | AjaxError>;
}
