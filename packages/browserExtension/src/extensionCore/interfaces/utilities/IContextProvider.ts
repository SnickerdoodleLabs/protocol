import { AccountContext, ClientEvents, PortEvents } from "@interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IContextProvider {
  getAccountContext(): ResultAsync<AccountContext, never>;
  getClientEvents(): ResultAsync<ClientEvents, never>;
  getPortEvents(): ResultAsync<PortEvents, never>;
 
}
