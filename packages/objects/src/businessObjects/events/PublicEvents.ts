import { Subject } from "rxjs";

import { BackupCreatedEvent } from "@objects/businessObjects/events/BackupCreatedEvent.js";
import { BackupRestoreEvent } from "@objects/businessObjects/events/BackupRestoreEvent.js";
import { DataPermissionsUpdatedEvent } from "@objects/businessObjects/events/DataPermissionsUpdatedEvent.js";
import { PermissionsGrantedEvent } from "@objects/businessObjects/events/PermissionsGrantedEvent.js";
import { PermissionsRequestedEvent } from "@objects/businessObjects/events/PermissionsRequestedEvent.js";
import {
  SocialProfileLinkedEvent,
  SocialProfileUnlinkedEvent,
} from "@objects/businessObjects/events/social/index.js";
import { MetatransactionSignatureRequest } from "@objects/businessObjects/MetatransactionSignatureRequest.js";
import { PortfolioUpdate } from "@objects/businessObjects/PortfolioUpdate.js";
import { EarnedReward } from "@objects/businessObjects/rewards/index.js";
import { SDQLQueryRequest } from "@objects/businessObjects/SDQLQueryRequest.js";
import { TokenBalance } from "@objects/businessObjects/TokenBalance.js";
import {
  EVMTransaction,
  LinkedAccount,
} from "@objects/businessObjects/versioned/index.js";
import { WalletNFT } from "@objects/businessObjects/WalletNFT.js";
import { ISnickerdoodleCoreEvents } from "@objects/interfaces/index.js";
import {
  CountryCode,
  DataWalletAddress,
  DomainName,
  EVMContractAddress,
  Gender,
  IpfsCID,
  UnixTimestamp,
} from "@objects/primitives/index.js";

export class PublicEvents implements ISnickerdoodleCoreEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<SDQLQueryRequest>;
  public onQueryParametersRequired: Subject<IpfsCID>;
  public onAccountAdded: Subject<LinkedAccount>;
  public onPasswordAdded: Subject<void>;
  public onAccountRemoved: Subject<LinkedAccount>;
  public onPasswordRemoved: Subject<void>;
  public onCohortJoined: Subject<EVMContractAddress>;
  public onCohortLeft: Subject<EVMContractAddress>;
  public onDataPermissionsUpdated: Subject<DataPermissionsUpdatedEvent>;
  public onTransaction: Subject<EVMTransaction>;
  public onMetatransactionSignatureRequested: Subject<MetatransactionSignatureRequest>;
  public onTokenBalanceUpdate: Subject<PortfolioUpdate<TokenBalance[]>>;
  public onNftBalanceUpdate: Subject<PortfolioUpdate<WalletNFT[]>>;
  public onBackupRestored: Subject<BackupRestoreEvent>;
  public onBackupCreated: Subject<BackupCreatedEvent>;
  public onEarnedRewardsAdded: Subject<EarnedReward[]>;
  public onPermissionsGranted: Subject<PermissionsGrantedEvent>;
  public onPermissionsRequested: Subject<PermissionsRequestedEvent>;
  public onPermissionsRevoked: Subject<DomainName>;
  public onSocialProfileLinked: Subject<SocialProfileLinkedEvent>;
  public onSocialProfileUnlinked: Subject<SocialProfileUnlinkedEvent>;
  public onBirthdayUpdated: Subject<UnixTimestamp>;
  public onGenderUpdated: Subject<Gender>;
  public onLocationUpdated: Subject<CountryCode>;

  public onCloudStorageActivated: Subject<CloudProviderSelectedEvent>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onQueryParametersRequired = new Subject();
    this.onAccountAdded = new Subject();
    this.onPasswordAdded = new Subject();
    this.onAccountRemoved = new Subject();
    this.onPasswordRemoved = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
    this.onDataPermissionsUpdated = new Subject();
    this.onTransaction = new Subject();
    this.onMetatransactionSignatureRequested = new Subject();
    this.onTokenBalanceUpdate = new Subject();
    this.onNftBalanceUpdate = new Subject();
    this.onBackupRestored = new Subject();
    this.onBackupCreated = new Subject();
    this.onEarnedRewardsAdded = new Subject();
    this.onPermissionsGranted = new Subject();
    this.onPermissionsRequested = new Subject();
    this.onPermissionsRevoked = new Subject();
    this.onSocialProfileLinked = new Subject();
    this.onSocialProfileUnlinked = new Subject();
    this.onCloudStorageActivated = new Subject();
    this.onBirthdayUpdated = new Subject();
    this.onGenderUpdated = new Subject();
    this.onLocationUpdated = new Subject();
  }
}
