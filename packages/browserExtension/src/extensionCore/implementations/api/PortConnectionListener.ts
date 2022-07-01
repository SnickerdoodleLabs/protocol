import { IPortConnectionListener } from "@interfaces/api";
import { IPortConnectionService } from "@interfaces/business";
import { IContextProvider } from "@interfaces/utilities";
import { okAsync, ResultAsync } from "neverthrow";
export class PortConnectionListener implements IPortConnectionListener {
  constructor(
    protected contextProvider: IContextProvider,
    protected portConnectionService: IPortConnectionService,
  ) {}

  public initialize() {
    const portEvents = this.contextProvider.getPortEvents();
    portEvents.onPortConnectionRequested.subscribe(
      this.handlePortConnectionRequest.bind(this),
    );

    return okAsync(undefined);
  }

  private handlePortConnectionRequest(port) {
    this.portConnectionService.connectRemote(port);
    return okAsync(undefined);
  }
}
