import { EVMAccountAddress } from "@snickerdoodlelabs/objects";

export interface IInternalState {
  walletAccount: EVMAccountAddress | null;
  userConnectedAccounts: EVMAccountAddress[];
  pendingActions: any[];
  name: string | null;
  email: string | null;
  googleData: any;
}

export interface IScamList {
  safeURL: string;
  scamURL: string;
}
export interface IExternalState {
  scamList: IScamList[];
  whiteList: string[];
  yellowList: string[];
}
