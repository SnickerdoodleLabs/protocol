import { ResultAsync } from "neverthrow";

import { AccountBalanceError, AjaxError } from "@objects/errors";
import { IEVMBalance } from "@objects/interfaces/IEVMBalance";
import { ChainId, EVMAccountAddress } from "@objects/primitives";

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chainId: ChainId,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<IEVMBalance[], AccountBalanceError | AjaxError>;
}
