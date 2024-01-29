import { PublicEvents, EExternalApi } from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export interface IPersistenceContext {
  publicEvents: PublicEvents;
  privateEvents: {
    onApiAccessed: Subject<EExternalApi>;
  };
}
