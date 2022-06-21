import { Runtime } from "webextension-polyfill";
export interface IPortConnectionUtils {
  onConnect(port: Runtime.Port): void;
}
