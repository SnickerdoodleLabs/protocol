import { Observable } from "rxjs";

import {
  EarnedReward,
  LinkedAccount,
  MetatransactionSignatureRequest,
  SDQLQueryRequest,
} from "@objects/businessObjects";
import { DataWalletAddress } from "@objects/primitives";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onAccountAdded: Observable<LinkedAccount>;
  onAccountRemoved: Observable<LinkedAccount>;
  onEarnedRewardsAdded: Observable<EarnedReward[]>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
}
