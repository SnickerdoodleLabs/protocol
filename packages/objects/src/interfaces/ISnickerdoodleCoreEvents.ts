import { Observable, Subject } from "rxjs";

import {
  EarnedReward,
  LinkedAccount,
  MetatransactionSignatureRequest,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  SDQLQueryRequest,
  SocialProfileLinkedEvent,
  SocialProfileUnlinkedEvent,
} from "@objects/businessObjects/index.js";
import {
  DataWalletAddress,
  DomainName,
  IpfsCID,
} from "@objects/primitives/index.js";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onQueryParametersRequired: Subject<IpfsCID>;
  onAccountAdded: Observable<LinkedAccount>;
  onAccountRemoved: Observable<LinkedAccount>;
  onEarnedRewardsAdded: Observable<EarnedReward[]>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
  onPermissionsGranted: Observable<PermissionsGrantedEvent>;
  onPermissionsRequested: Observable<PermissionsRequestedEvent>;
  onPermissionsRevoked: Observable<DomainName>;
  onSocialProfileLinked: Subject<SocialProfileLinkedEvent>;
  onSocialProfileUnlinked: Subject<SocialProfileUnlinkedEvent>;
}
