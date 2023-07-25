import { ISdlDataWallet } from "@snickerdoodlelabs/objects";

interface ISdlDataWalletProxy extends ISdlDataWallet {
  providers?: ISdlDataWalletProxy[];
  detected?: number;
}
export interface IWindowWithSdlDataWallet extends Window {
  sdlDataWallet: ISdlDataWalletProxy;
}
