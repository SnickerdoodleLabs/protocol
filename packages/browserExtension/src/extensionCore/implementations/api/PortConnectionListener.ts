import { inject, injectable } from "inversify";
import { okAsync } from "neverthrow";
import Browser, { Runtime } from "webextension-polyfill";

import { PortConnectionUtils } from "@enviroment/manifest3/utils";
import { IPortConnectionListener } from "@interfaces/api";
import {
  IPortConnectionService,
  IPortConnectionServiceType,
} from "@interfaces/business";
import { VersionUtils } from "@shared/utils/VersionUtils";

@injectable()
export class PortConnectionListener implements IPortConnectionListener {
  constructor(
    @inject(IPortConnectionServiceType)
    protected portConnectionService: IPortConnectionService,
  ) {}

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
