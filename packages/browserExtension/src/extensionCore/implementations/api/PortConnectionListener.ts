import { IPortConnectionListener } from "@interfaces/api";
import { IPortConnectionService } from "@interfaces/business";
import { okAsync } from "neverthrow";
import Browser, { Runtime } from "webextension-polyfill";
export class PortConnectionListener implements IPortConnectionListener {
  constructor(protected portConnectionService: IPortConnectionService) {}

  public initialize() {
    Browser.runtime.onConnect.addListener(
      this.handlePortConnectionRequest.bind(this),
    );
    return okAsync(undefined);
  }

  private handlePortConnectionRequest(port: Runtime.Port) {
    this.portConnectionService.connectRemote(port);
    return okAsync(undefined);
  }
}
