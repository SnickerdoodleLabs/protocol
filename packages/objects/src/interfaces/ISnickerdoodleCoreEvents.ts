import { Observable } from "rxjs";

import {
  LinkedAccount,
  MetatransactionSignatureRequest,
  PermissionsGrantedEvent,
  SDQLQueryRequest,
} from "@objects/businessObjects/index.js";
import { DataWalletAddress } from "@objects/primitives/index.js";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onAccountAdded: Observable<LinkedAccount>;
  onAccountRemoved: Observable<LinkedAccount>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
  onPermissionsGranted: Observable<PermissionsGrantedEvent>;
}
