import { ResultAsync } from "neverthrow";

import { EVMBalance } from "@objects/businessObjects";
import { AccountBalanceError, AjaxError } from "@objects/errors";
import { ChainId, EVMAccountAddress } from "@objects/primitives";

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<EVMBalance[], AccountBalanceError | AjaxError>;
}
