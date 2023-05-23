import { EExternalApi } from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export interface IIndexerContext {
  components: number; // Obviously this is something else
  privateEvents: {
    onApiAccessed: Subject<EExternalApi>;
  };
}
