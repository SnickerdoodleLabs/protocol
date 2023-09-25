import { CoreListenerEvents } from "@core-iframe/implementations/objects/CoreListenerEvents";
import { ChildProxy } from "@snickerdoodlelabs/utils";

export interface ICoreListener extends ChildProxy {
  events: CoreListenerEvents;
}

export const ICoreListenerType = Symbol.for("ICoreListener");
