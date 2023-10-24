import { Observable } from "rxjs";

import {
  CloudStorageActivatedEvent,
  BackupCreatedEvent,
  BackupRestoreEvent,
  DataPermissionsUpdatedEvent,
  EVMTransaction,
  EarnedReward,
  LinkedAccount,
  MetatransactionSignatureRequest,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  PortfolioUpdate,
  SDQLQueryRequest,
  SocialProfileLinkedEvent,
  SocialProfileUnlinkedEvent,
  TokenBalance,
  WalletNFT,
} from "@objects/businessObjects/index.js";
import {
  CountryCode,
  DataWalletAddress,
  DomainName,
  EVMContractAddress,
  Gender,
  IpfsCID,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export interface ISnickerdoodleCoreEvents {
  onInitialized: Observable<DataWalletAddress>;
  onQueryPosted: Observable<SDQLQueryRequest>;
  onQueryParametersRequired: Observable<IpfsCID>;
  onAccountAdded: Observable<LinkedAccount>;
  onPasswordAdded: Observable<void>;
  onAccountRemoved: Observable<LinkedAccount>;
  onPasswordRemoved: Observable<void>;
  onCohortJoined: Observable<EVMContractAddress>;
  onCohortLeft: Observable<EVMContractAddress>;
  onDataPermissionsUpdated: Observable<DataPermissionsUpdatedEvent>;
  onTransaction: Observable<EVMTransaction>;
  onEarnedRewardsAdded: Observable<EarnedReward[]>;
  onMetatransactionSignatureRequested: Observable<MetatransactionSignatureRequest>;
  onTokenBalanceUpdate: Observable<PortfolioUpdate<TokenBalance[]>>;
  onNftBalanceUpdate: Observable<PortfolioUpdate<WalletNFT[]>>;
  onBackupRestored: Observable<BackupRestoreEvent>;
  onBackupCreated: Observable<BackupCreatedEvent>;
  onPermissionsGranted: Observable<PermissionsGrantedEvent>;
  onPermissionsRequested: Observable<PermissionsRequestedEvent>;
  onPermissionsRevoked: Observable<DomainName>;
  onSocialProfileLinked: Observable<SocialProfileLinkedEvent>;
  onSocialProfileUnlinked: Observable<SocialProfileUnlinkedEvent>;
  onCloudStorageActivated: Observable<CloudStorageActivatedEvent>;
  onCloudStorageDeactivated: Observable<CloudStorageActivatedEvent>;

  onBirthdayUpdated: Observable<UnixTimestamp>;
  onGenderUpdated: Observable<Gender>;
  onLocationUpdated: Observable<CountryCode>;
}
