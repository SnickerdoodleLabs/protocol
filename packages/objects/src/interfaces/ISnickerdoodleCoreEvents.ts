import { Observable } from "rxjs";

import {
  LinkedAccount,
  MetatransactionSignatureRequest,
  SDQLQueryRequest,
} from "@objects/businessObjects";
import { DataWalletAddress } from "@objects/primitives";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onQueryAccepted: Observable<SDQLQueryRequest>;
  onAccountAdded: Observable<LinkedAccount>;
  onAccountRemoved: Observable<LinkedAccount>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
}
