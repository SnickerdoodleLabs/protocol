import { ResultAsync } from "neverthrow";
import { Runtime } from "webextension-polyfill";

export class PortConnectionUtils {
  /**
   * This function auto disconnects the ports in every 3 minutes
   * The port creater should listen onDisconnect event of this port and should recreate it to keep service worker alive.
   */
  static autoDisconnectWrapper(
    port: Runtime.Port,
    connectionHandler: (port: Runtime.Port) => ResultAsync<void, never>,
  ): void {
    const _timer = setTimeout(() => {
      clearTimeout(_timer);
      port.disconnect();
    }, 180000);
    connectionHandler(port);
  }
}
