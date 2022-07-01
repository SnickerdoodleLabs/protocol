import { ClientEvents } from "@interfaces/objects";
import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";
import { UserContext } from "@implementations/utilities/ContextProvider/UserContext";
import { IInternalState, IExternalState } from "@shared/objects/State";

export interface IContextProvider {
  getAccountContext(): AccountContext;
  getAppContext(): AppContext;
  getClientEvents(): ClientEvents;
  getUserContext(): UserContext;
  getInternalState(): IInternalState;
  getExterenalState(): IExternalState;
}
