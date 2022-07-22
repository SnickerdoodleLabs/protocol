import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";
import { UserContext } from "@implementations/utilities/ContextProvider/UserContext";
import { IInternalState, IExternalState } from "@shared/interfaces/states";
import { Subject } from "rxjs";

export interface IContextProvider {
  getAccountContext(): AccountContext;
  getAppContext(): AppContext;
  getUserContext(): UserContext;
  getErrorSubject(): Subject<Error>
  getInternalState(): IInternalState;
  getExterenalState(): IExternalState;
}
