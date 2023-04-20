import { Observable, Subject } from "rxjs";

import {
  EarnedReward,
  LinkedAccount,
  MetatransactionSignatureRequest,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  SDQLQueryRequest,
  SocialProfile,
} from "@objects/businessObjects/index.js";
import {
  DataWalletAddress,
  DomainName,
  IpfsCID,
  SocialMediaID,
} from "@objects/primitives/index.js";
import { ESocialType } from "..";

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
  onSocialProfileLinked: Subject<SocialProfile>;
  onSocialProfileUnlinked: Subject<[ESocialType, SocialMediaID]>;
}
