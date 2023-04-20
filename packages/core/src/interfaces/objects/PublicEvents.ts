import {
  DataWalletAddress,
  DataWalletBackupID,
  DomainName,
  EarnedReward,
  ESocialType,
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
  SocialMediaID,
  SocialProfile,
  TokenBalance,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PublicEvents implements ISnickerdoodleCoreEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<SDQLQueryRequest>;
  public onQueryParametersRequired: Subject<IpfsCID>;
  public onAccountAdded: Subject<LinkedAccount>;
  public onAccountRemoved: Subject<LinkedAccount>;
  public onCohortJoined: Subject<EVMContractAddress>;
  public onCohortLeft: Subject<EVMContractAddress>;
  public onTransaction: Subject<EVMTransaction>;
  public onMetatransactionSignatureRequested: Subject<MetatransactionSignatureRequest>;
  public onTokenBalanceUpdate: Subject<PortfolioUpdate<TokenBalance[]>>;
  public onNftBalanceUpdate: Subject<PortfolioUpdate<WalletNFT[]>>;
  public onBackupRestored: Subject<DataWalletBackupID>;
  public onEarnedRewardsAdded: Subject<EarnedReward[]>;
  public onPermissionsGranted: Subject<PermissionsGrantedEvent>;
  public onPermissionsRequested: Subject<PermissionsRequestedEvent>;
  public onPermissionsRevoked: Subject<DomainName>;
  public onSocialProfileLinked: Subject<SocialProfile>;
  public onSocialProfileUnlinked: Subject<[ESocialType, SocialMediaID]>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onQueryParametersRequired = new Subject();
    this.onAccountAdded = new Subject();
    this.onAccountRemoved = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
    this.onTransaction = new Subject();
    this.onMetatransactionSignatureRequested = new Subject();
    this.onTokenBalanceUpdate = new Subject();
    this.onNftBalanceUpdate = new Subject();
    this.onBackupRestored = new Subject();
    this.onEarnedRewardsAdded = new Subject();
    this.onPermissionsGranted = new Subject();
    this.onPermissionsRequested = new Subject();
    this.onPermissionsRevoked = new Subject();
    this.onSocialProfileLinked = new Subject();
    this.onSocialProfileUnlinked = new Subject();
  }
}
