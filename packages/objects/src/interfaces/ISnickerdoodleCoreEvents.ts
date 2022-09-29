import { Observable } from "rxjs";

import {
  MetatransactionSignatureRequest,
  SDQLQueryRequest,
} from "@objects/businessObjects";
import { DataWalletAddress, EVMAccountAddress } from "@objects/primitives";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onQueryAccepted: Observable<SDQLQueryRequest>;
  onAccountAdded: Observable<EVMAccountAddress>;
  onAccountRemoved: Observable<EVMAccountAddress>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
}
