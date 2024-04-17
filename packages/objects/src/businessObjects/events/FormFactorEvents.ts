import { Subject } from "rxjs";

import { IFormFactorInternalEvents } from "@objects/interfaces/index.js";

export class FormFactorEvents implements IFormFactorInternalEvents {
  public onLinkAccountRequested: Subject<void>;

  public constructor() {
    this.onLinkAccountRequested = new Subject();
  }
}
