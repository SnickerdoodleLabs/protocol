import {
  IFrameEvents,
  IFrameControlConfig,
} from "@core-iframe/interfaces/objects";
import { IIFrameConfigOverrides } from "@snickerdoodlelabs/objects";
import { ResultAsync } from "neverthrow";

export interface IIFrameContextProvider {
  getEvents(): IFrameEvents;
  getConfig(): IFrameControlConfig;
  setConfigOverrides(
    configOverrides: IIFrameConfigOverrides,
  ): ResultAsync<void, never>;
}

export const IIFrameContextProviderType = Symbol.for("IIFrameContextProvider");
