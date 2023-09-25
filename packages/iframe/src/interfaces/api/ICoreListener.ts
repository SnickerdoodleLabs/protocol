import {
  CoreListenerEvents,
  IFrameControlConfig,
} from "@core-iframe/interfaces/objects";
import { ChildProxy } from "@snickerdoodlelabs/utils";

export interface ICoreListener extends ChildProxy {
  // TODO: obviously both of these are not belong here
  events: CoreListenerEvents;
  iframeControlConfig: IFrameControlConfig;
}

export const ICoreListenerType = Symbol.for("ICoreListener");
