import { ResultAsync } from "neverthrow";

import { IEVMAccountBalanceRepository } from "./chains/IEVMAccountBalanceRepository";

export interface IAccountBalances {
  getEVMBalanceRepository(): ResultAsync<IEVMAccountBalanceRepository, never>;
  getSimulatorEVMBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;
}

export const IAccountBalancesType = Symbol.for("IAccountBalances");
