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
  getEVMBalanceRepository(): ResultAsync<IEVMAccountBalanceRepository, never>;
  getEthereumBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;
  getSolanaBalanceRepository(): ResultAsync<ISolanaBalanceRepository, never>;
  getSimulatorEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;
  getPolygonBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;
  getEtherscanBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;
  getAlchemyBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;
  getOklinkBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;
}

export const IAccountBalancesType = Symbol.for("IAccountBalances");
