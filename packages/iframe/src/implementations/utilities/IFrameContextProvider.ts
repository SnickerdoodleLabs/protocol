import {
  IFrameEvents,
  IFrameControlConfig,
} from "@core-iframe/interfaces/objects";
import { IIFrameContextProvider } from "@core-iframe/interfaces/utilities";
import { IIFrameConfigOverrides } from "@snickerdoodlelabs/objects";
import { injectable } from "inversify";
import { ResultAsync, okAsync } from "neverthrow";

@injectable()
export class IFrameContextProvider implements IIFrameContextProvider {
  private events: IFrameEvents;
  private config: IFrameControlConfig;
  public constructor() {
    this.events = new IFrameEvents();
    this.config = new IFrameControlConfig();
  }
  public getEvents(): IFrameEvents {
    return this.events;
  }
  public setConfigOverrides(
    configOverrides: IIFrameConfigOverrides,
  ): ResultAsync<void, never> {
    if (configOverrides.consentAddress) {
      this.config.consentAddress = configOverrides.consentAddress;
      this.events.onConsentAddressFound.next(configOverrides.consentAddress);
    }
    this.config.showDeeplinkInvitations =
      configOverrides.showDeeplinkInvitations ??
      this.config.showDeeplinkInvitations;
    this.config.checkDomainInvitations =
      configOverrides.checkDomainInvitations ??
      this.config.checkDomainInvitations;
    this.config.palette = configOverrides.palette ?? this.config.palette;
    return okAsync(undefined);
  }
  public getConfig(): IFrameControlConfig {
    return this.config;
  }
}
