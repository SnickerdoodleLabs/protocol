import { Runtime } from "webextension-polyfill";

export class ConnectionPort {
  constructor(public port: Runtime.Port) {}
}
