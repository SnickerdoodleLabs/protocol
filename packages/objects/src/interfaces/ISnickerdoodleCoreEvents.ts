import { Observable } from "rxjs";

import {
  MetatransactionSignatureRequest,
  SDQLQuery,
} from "@objects/businessObjects";
import { DataWalletAddress, EVMAccountAddress, EVMContractAddress } from "@objects/primitives";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<{consentContractAddress:EVMContractAddress, query:SDQLQuery}>;
  onAccountAdded: Observable<EVMAccountAddress>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
}
