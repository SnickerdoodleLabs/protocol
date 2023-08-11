import { ISdlDataWallet } from "@snickerdoodlelabs/objects";

export interface ISdlDataWalletProxy extends ISdlDataWallet {
  providers?: ISdlDataWalletProxy[];
  detected?: number;
  extensionId?: string;
  name?: string;
}

export interface IWindowWithSdlDataWallet extends Window {
  sdlDataWallet: ISdlDataWalletProxy;
}
