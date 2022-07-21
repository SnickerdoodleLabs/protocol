import { Observable } from "rxjs";

import {
  MetatransactionSignatureRequest,
  SDQLQuery,
} from "@objects/businessObjects";
import { DataWalletAddress, EVMAccountAddress } from "@objects/primitives";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQuery>;
  onAccountAdded: Observable<EVMAccountAddress>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
}
