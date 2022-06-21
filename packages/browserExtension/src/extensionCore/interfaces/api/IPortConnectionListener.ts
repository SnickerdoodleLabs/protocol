import { ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export interface IPortConnectionListener {
    handlePortConnectionRequest(port: Runtime.Port): ResultAsync<void, never>;
}