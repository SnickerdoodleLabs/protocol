import { IPortConnectionUtils, IContextProvider } from "@interfaces/utilities";
import { okAsync, ResultAsync } from "neverthrow";
import Browser, { Runtime } from "webextension-polyfill";
export class PortConnectionUtils implements IPortConnectionUtils {
  constructor(protected contextProvider: IContextProvider) {
    Browser.runtime.onConnect.addListener(this.onConnect.bind(this));
  }

  onConnect(port: Runtime.Port): ResultAsync<void, never> {
      this.contextProvider.getPortEvents().map((portEvents) => {
      portEvents.onPortConnectionRequested.next(port);
    });
    return okAsync(undefined)
  }
}
