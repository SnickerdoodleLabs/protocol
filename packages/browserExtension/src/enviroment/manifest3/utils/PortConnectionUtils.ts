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
  ) {
    // @ts-ignore
    const deleteTimer = () => {
      // @ts-ignore
      if (port._timer) {
        // @ts-ignore
        clearTimeout(port._timer);
        // @ts-ignore
        delete port._timer;
      }
    };
    const forceReconnect = () => {
      deleteTimer();
      port.disconnect();
    };
    // @ts-ignore
    port._timer = setTimeout(forceReconnect, 10000);

    connectionHandler(port);
  }
}
