import { ResultAsync } from "neverthrow";

import { IEVMNftRepository, ISolanaNFTRepository } from "@objects/interfaces";

export interface IAccountNFTs {
  getEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getEthereumNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getSolanaNFTRepository(): ResultAsync<ISolanaNFTRepository, never>;
  getSimulatorEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getEtherscanNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getNftScanRepository(): ResultAsync<IEVMNftRepository, never>;
  getPoapRepository(): ResultAsync<IEVMNftRepository, never>;
}

export const IAccountNFTsType = Symbol.for("IAccountNFTs");