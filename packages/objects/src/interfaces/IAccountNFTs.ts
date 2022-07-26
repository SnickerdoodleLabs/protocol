import { ResultAsync } from "neverthrow";

import { IEVMNftRepository } from "@objects/interfaces";

export interface IAccountNFTs {
  getEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getSimulatorEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
}

export const IAccountNFTsType = Symbol.for("IAccountNFTs");
