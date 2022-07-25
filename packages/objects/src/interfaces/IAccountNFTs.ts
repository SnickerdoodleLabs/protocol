import { ResultAsync } from "neverthrow";

import {} from "./chains/IEVMAccountBalanceRepository";
import { IEVMNftRepository } from "./chains/IEVMNftRepository";

export interface IAccountNFTs {
  getEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getSimulatorEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
}

export const IAccountNFTsType = Symbol.for("IAccountNFTs");
