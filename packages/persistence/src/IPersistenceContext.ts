// import { PrivateEvents } from "@core/objects/interfaces/PrivateEvents.js";

import {
  ComponentStatus,
  EExternalApi,
  PublicEvents,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export interface IPersistenceContext {
  publicEvents: PublicEvents;
}
