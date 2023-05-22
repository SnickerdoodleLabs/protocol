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
}

export const IAccountNFTsType = Symbol.for("IAccountNFTs");
