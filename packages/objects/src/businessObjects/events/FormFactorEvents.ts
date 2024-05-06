import { IFormFactorInternalEvents } from "@objects/interfaces/index.js";
import { EVMContractAddress } from "@objects/primitives/index.js";
import { Subject } from "rxjs";

export class FormFactorEvents implements IFormFactorInternalEvents {
  public onLinkAccountRequested: Subject<void>;
  public onConsentModalDismissed: Subject<EVMContractAddress>;

  public constructor() {
    this.onLinkAccountRequested = new Subject();
    this.onConsentModalDismissed = new Subject();
  }
}
