import { PortConnectionUtils } from "@enviroment/manifest3/utils";
import { IPortConnectionListener } from "@interfaces/api";
import { IPortConnectionService } from "@interfaces/business";
import { VersionUtils } from "@shared/utils/VersionUtils";
import { okAsync } from "neverthrow";
import Browser, { Runtime } from "webextension-polyfill";

export class PortConnectionListener implements IPortConnectionListener {
  constructor(protected portConnectionService: IPortConnectionService) {}

  public initialize() {
    Browser.runtime.onConnect.addListener((port) => {
      if (VersionUtils.isManifest3) {
        PortConnectionUtils.autoDisconnectWrapper(
          port,
          this.handlePortConnectionRequest.bind(this),
        );
      } else {
        this.handlePortConnectionRequest(port);
      }
    });
    return okAsync(undefined);
  }

  private handlePortConnectionRequest(port: Runtime.Port) {
    this.portConnectionService.connectRemote(port);
    return okAsync(undefined);
  }
}
