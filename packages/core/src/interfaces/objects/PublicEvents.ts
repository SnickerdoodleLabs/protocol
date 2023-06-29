import {
  DataWalletAddress,
  DomainName,
  EarnedReward,
  EVMContractAddress,
  EVMTransaction,
  IpfsCID,
  ISnickerdoodleCoreEvents,
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
  DataPermissionsUpdatedEvent,
  BackupRestoreEvent,
  BackupCreatedEvent,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

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
  }
}
