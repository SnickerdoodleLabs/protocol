import { IPortConnectionListener } from "@interfaces/api";
import { IPortConnectionService } from "@interfaces/business";
import { IContextProvider } from "@interfaces/utilities";
import { okAsync } from "neverthrow";
export class PortConnectionListener implements IPortConnectionListener {
  constructor(
    protected contextProvider: IContextProvider,
    protected portConnectionService: IPortConnectionService,
  ) {
    contextProvider.getPortEvents().map((portEvents) => {
      portEvents.onPortConnectionRequested.subscribe(
        this.handlePortConnectionRequest.bind(this),
      );
    });
  }

  public handlePortConnectionRequest(port) {
    this.portConnectionService.connectRemote(port);
    return okAsync(undefined);
  }
}
