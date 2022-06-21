import { AccountContext, ClientEvents, PortEvents } from "@interfaces/objects";
import { ResultAsync } from "neverthrow";

export interface IContextProvider {
  getPortEvents(): ResultAsync<PortEvents, never>;
  getAccountContext(): ResultAsync<AccountContext, never>;
  getClientEvents(): ResultAsync<ClientEvents, never>;
}
