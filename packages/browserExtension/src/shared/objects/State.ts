import { EthereumAccountAddress } from "@snickerdoodlelabs/objects";

export interface IInternalState {
  walletAccount: EthereumAccountAddress | null;
  userConnectedAccounts: EthereumAccountAddress[];
  pendingActions: any[];
  name: string | null;
  email: string | null;
}

export interface IExternalState {
  scamList: string[];
  whiteList: string[];
}
