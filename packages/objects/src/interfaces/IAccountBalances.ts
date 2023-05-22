import { ResultAsync } from "neverthrow";

import { TokenBalance } from "@objects/businessObjects";
import {
  AccountIndexingError,
  AjaxError,
  PersistenceError,
} from "@objects/errors";
import {
  ISolanaBalanceRepository,
  IEVMAccountBalanceRepository,
} from "@objects/interfaces";
import { AccountAddress, ChainId } from "@objects/primitives";

export interface IAccountBalances {
  getLatestBalances(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    TokenBalance[],
    PersistenceError | AccountIndexingError | AjaxError
  >;
}

export const IAccountBalancesType = Symbol.for("IAccountBalances");
