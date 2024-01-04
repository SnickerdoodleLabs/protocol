import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class WebIntegrationEvents {
  public onInitialized: Subject<ECoreProxyType>;
  constructor() {
    this.onInitialized = new Subject<ECoreProxyType>();
  }
}
