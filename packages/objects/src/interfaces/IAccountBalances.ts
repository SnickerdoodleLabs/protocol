import { ResultAsync } from "neverthrow";

import {
  ISolanaBalanceRepository,
  IEVMAccountBalanceRepository,
} from "@objects/interfaces";

export interface IAccountBalances {
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
  // getArbitrumBalanceRepository(): ResultAsync<
  //   IEVMAccountBalanceRepository,
  //   never
  // >;
  getOptimismBalanceRepository(): ResultAsync<
    IEVMAccountBalanceRepository,
    never
  >;

  // getSpaceandTimeBalanceRepository(): ResultAsync<
  //   IEVMAccountBalanceRepository,
  //   never
  // >;
}

export const IAccountBalancesType = Symbol.for("IAccountBalances");
