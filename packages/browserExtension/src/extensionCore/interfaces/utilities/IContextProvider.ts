import { ClientEvents, PortEvents } from "@interfaces/objects";
import { AccountContext } from "@implementations/utilities/ContextProvider/AccountContext";
import { AppContext } from "@implementations/utilities/ContextProvider/AppContext";

export interface IContextProvider {
  getAccountContext(): AccountContext;
  getAppContext(): AppContext;
  getClientEvents(): ClientEvents;
  getPortEvents(): PortEvents;
}
