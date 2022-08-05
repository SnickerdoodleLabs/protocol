import {
  Invitation,
  MetatransactionSignatureRequest,
  UUID,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";
import { UserContext } from "@implementations/utilities/ContextProvider/UserContext";
import { IInternalState, IExternalState } from "@shared/interfaces/states";

export interface IContextProvider {
  getAccountContext(): AccountContext;
  getAppContext(): AppContext;
  getUserContext(): UserContext;
  getErrorSubject(): Subject<Error>;
  getInternalState(): IInternalState;
  getExterenalState(): IExternalState;
  notifyPortsWithIncomingMetatransactionSignatureRequest(
    metatransactionSignatureRequest: MetatransactionSignatureRequest,
  ): void;
  getMetatransactionSignatureRequestById(
    id: UUID,
  ): MetatransactionSignatureRequest | undefined;
  getPendingMetatransactionSignatureRequestDetails(
    id: UUID,
  ): Partial<MetatransactionSignatureRequest> | undefined;
  removePendingMetatransactionSignatureRequest(id: UUID): void;
  addInvitation(invitation: Invitation): UUID;
  getInvitation(id: UUID): Invitation | undefined;
}

export const IContextProviderType = Symbol.for("IContextProvider");
