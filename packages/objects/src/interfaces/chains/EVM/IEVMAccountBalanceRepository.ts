import { ResultAsync } from "neverthrow";

import { TokenBalance } from "@objects/businessObjects";
import { EChain } from "@objects/enum";
import { AccountIndexingError, AjaxError } from "@objects/errors";
import { ChainId, EVMAccountAddress } from "@objects/primitives";

export interface IEVMAccountBalanceRepository {
  getBalancesForAccount(
    chain: EChain,
    accountAddress: EVMAccountAddress,
  ): ResultAsync<TokenBalance[], AccountIndexingError | AjaxError>;
}
