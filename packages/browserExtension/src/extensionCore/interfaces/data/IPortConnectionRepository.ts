import { ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export interface IPortConnectionRepository {
    connectRemote(remotePort: Runtime.Port): ResultAsync<void, never>
}
