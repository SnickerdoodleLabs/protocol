import { ResultAsync } from "neverthrow";

import { WalletNFT } from "@objects/businessObjects";
import {
  AccountIndexingError,
  AjaxError,
  PersistenceError,
} from "@objects/errors";
import { IEVMNftRepository, ISolanaNFTRepository } from "@objects/interfaces";
import { AccountAddress, ChainId } from "@objects/primitives";

export interface IAccountNFTs {
  getLatestNFTs(
    chainId: ChainId,
    accountAddress: AccountAddress,
  ): ResultAsync<
    WalletNFT[],
    PersistenceError | AccountIndexingError | AjaxError
  >;
  getEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getEthereumNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getSolanaNFTRepository(): ResultAsync<ISolanaNFTRepository, never>;
  getSimulatorEVMNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getEtherscanNftRepository(): ResultAsync<IEVMNftRepository, never>;
  getNftScanRepository(): ResultAsync<IEVMNftRepository, never>;
  getPoapRepository(): ResultAsync<IEVMNftRepository, never>;
}

export const IAccountNFTsType = Symbol.for("IAccountNFTs");
