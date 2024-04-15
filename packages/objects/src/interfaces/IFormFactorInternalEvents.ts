import { Observable } from "rxjs";

export interface IFormFactorInternalEvents {
  onLinkAccountRequested: Observable<void>;
}
