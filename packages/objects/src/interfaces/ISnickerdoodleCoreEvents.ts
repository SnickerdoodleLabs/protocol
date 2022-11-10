import { Observable } from "rxjs";

import {
  EarnedReward,
  EVMTransaction,
  LinkedAccount,
  MetatransactionSignatureRequest,
  SDQLQueryRequest,
} from "@objects/businessObjects";
import { DataWalletAddress, EVMContractAddress } from "@objects/primitives";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onQueryProcessed: Observable<EarnedReward[]>;
  onAccountAdded: Observable<LinkedAccount>;
  onAccountRemoved: Observable<LinkedAccount>;
  onCohortJoined: Observable<EVMContractAddress>;
  onCohortLeft: Observable<EVMContractAddress>;
  onTransaction: Observable<EVMTransaction>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
}
