import { EExternalApi } from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PrivateEvents {
  public heartbeat: Subject<void>;
  public onApiAccessed: Subject<EExternalApi>;
  public postBackupsRequested: Subject<void>;

  public constructor() {
    this.heartbeat = new Subject();
    this.onApiAccessed = new Subject();
    this.postBackupsRequested = new Subject();
  }
}
