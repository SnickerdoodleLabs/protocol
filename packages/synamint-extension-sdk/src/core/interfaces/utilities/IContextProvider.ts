import {
  DataWalletAddress,
  Invitation,
  LinkedAccount,
  UUID,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

import { AccountContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@synamint-extension-sdk/core/implementations/utilities/ContextProvider/AppContext";
import { IInternalState, IExternalState } from "@synamint-extension-sdk/shared/interfaces/states";

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
