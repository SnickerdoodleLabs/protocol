import { ResultAsync } from "neverthrow";

import { TokenBalance } from "@objects/businessObjects";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import { ChainId, EVMAccountAddress } from "@objects/primitives";

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
}
