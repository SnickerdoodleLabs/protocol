import { ResultAsync } from "neverthrow";

import { IEVMAccountBalanceRepository } from "./chains/IEVMAccountBalanceRepository";

export interface IAccountBalances {
  getETHBalanceRepository(): ResultAsync<IEVMAccountBalanceRepository, never>;
  getAVAXBalanceRepository(): ResultAsync<IEVMAccountBalanceRepository, never>;
}

export const IAccountBalancesType = Symbol.for("IAccountBalances");
