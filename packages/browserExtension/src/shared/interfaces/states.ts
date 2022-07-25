import { EVMAccountAddress } from "@snickerdoodlelabs/objects";

export interface IInternalState {
  walletAccount: EVMAccountAddress | null;
  userConnectedAccounts: EVMAccountAddress[];
  pendingActions: any[];
  name: string | null;
  email: string | null;
}

export interface IExternalState {
  scamList: string[];
  whiteList: string[];
}
