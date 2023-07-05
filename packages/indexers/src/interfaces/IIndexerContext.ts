// import { PrivateEvents } from "@core/objects/interfaces/PrivateEvents.js";

import { ComponentStatus, EExternalApi } from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export interface IIndexerContext {
  components: ComponentStatus;
  // setComponentStatus(comp: ComponentStatus): void;
  privateEvents: {
    onApiAccessed: Subject<EExternalApi>;
  };
}
