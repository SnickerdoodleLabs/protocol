import { Observable } from "rxjs";

import {
  LinkedAccount,
  MetatransactionSignatureRequest,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  PermissionsUpdatedEvent,
  SDQLQueryRequest,
} from "@objects/businessObjects/index.js";
import { DataWalletAddress, DomainName } from "@objects/primitives/index.js";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onAccountAdded: Observable<LinkedAccount>;
  onAccountRemoved: Observable<LinkedAccount>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
  onPermissionsGranted: Observable<PermissionsGrantedEvent>;
  onPermissionsRequested: Observable<PermissionsRequestedEvent>;
  onPermissionsRevoked: Observable<DomainName>;
  onPermissionsUpdated: Observable<PermissionsUpdatedEvent>;
}
