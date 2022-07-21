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
    let _timer;
    const deleteTimer = () => {
      clearTimeout(_timer);
    };
    const forceReconnect = () => {
      deleteTimer();
      port.disconnect();
    };
    _timer = setTimeout(forceReconnect, 180000);
    connectionHandler(port);
  }
}
