import { ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export interface IPortConnectionService {
  connectRemote(port: Runtime.Port): ResultAsync<void, never>;
}

export const IPortConnectionServiceType = Symbol.for("IPortConnectionService");
