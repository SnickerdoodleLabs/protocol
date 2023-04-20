import { Observable, Subject } from "rxjs";

import {
  DiscordProfile,
  EarnedReward,
  LinkedAccount,
  MetatransactionSignatureRequest,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  SDQLQueryRequest,
  TwitterProfile,
} from "@objects/businessObjects/index.js";
import {
  DataWalletAddress,
  DiscordID,
  DomainName,
  IpfsCID,
  TwitterID,
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
  onDiscordProfileLinked: Subject<DiscordProfile>;
  onDiscordProfileUnlinked: Subject<DiscordID>;
  onTwitterProfileLinked: Subject<TwitterProfile>;
  onTwitterProfileUnlinked: Subject<TwitterID>;
}
