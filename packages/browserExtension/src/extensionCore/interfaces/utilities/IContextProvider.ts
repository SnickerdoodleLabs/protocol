import {
  DataWalletAddress,
  Invitation,
  LinkedAccount,
  UUID,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";
import { IInternalState, IExternalState } from "@shared/interfaces/states";

export interface IContextProvider {
  getAccountContext(): AccountContext;
  getAppContext(): AppContext;
  getErrorSubject(): Subject<Error>;
  getInternalState(): IInternalState;
  getExterenalState(): IExternalState;
  addInvitation(invitation: Invitation): UUID;
  getInvitation(id: UUID): Invitation | undefined;
  setAccountContext(dataWalletAddress: DataWalletAddress): void;
  onAccountAdded(accountAddress: LinkedAccount): void;
  onAccountRemoved(accountAddress: LinkedAccount): void;
}

export const IContextProviderType = Symbol.for("IContextProvider");
