import { DataWalletAddress } from "@snickerdoodlelabs/objects";

export interface IInternalState {
  dataWalletAddress: DataWalletAddress | null;
}

export interface IExternalState {
  dataWalletAddress: DataWalletAddress | null;
  scamList: string[];
  whiteList: string[];
}
