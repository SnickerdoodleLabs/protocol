import {
  DataWalletAddress,
  DataWalletBackupID,
  DomainName,
  EVMContractAddress,
  EVMTransaction,
  ISnickerdoodleCoreEvents,
  LinkedAccount,
  MetatransactionSignatureRequest,
  PermissionsGrantedEvent,
  PermissionsRequestedEvent,
  PermissionsUpdatedEvent,
  PortfolioUpdate,
  SDQLQueryRequest,
  TokenBalance,
  WalletNFT,
} from "@snickerdoodlelabs/objects";
import { Subject } from "rxjs";

export class PublicEvents implements ISnickerdoodleCoreEvents {
  public onInitialized: Subject<DataWalletAddress>;
  public onQueryPosted: Subject<SDQLQueryRequest>;
  public onAccountAdded: Subject<LinkedAccount>;
  public onAccountRemoved: Subject<LinkedAccount>;
  public onCohortJoined: Subject<EVMContractAddress>;
  public onCohortLeft: Subject<EVMContractAddress>;
  public onTransaction: Subject<EVMTransaction>;
  public onMetatransactionSignatureRequested: Subject<MetatransactionSignatureRequest>;
  public onTokenBalanceUpdate: Subject<PortfolioUpdate<TokenBalance[]>>;
  public onNftBalanceUpdate: Subject<PortfolioUpdate<WalletNFT[]>>;
  public onBackupRestored: Subject<DataWalletBackupID>;
  public onPermissionsGranted: Subject<PermissionsGrantedEvent>;
  public onPermissionsRequested: Subject<PermissionsRequestedEvent>;
  public onPermissionsRevoked: Subject<DomainName>;
  public onPermissionsUpdated: Subject<PermissionsUpdatedEvent>;

  public constructor() {
    this.onInitialized = new Subject();
    this.onQueryPosted = new Subject();
    this.onAccountAdded = new Subject();
    this.onAccountRemoved = new Subject();
    this.onCohortJoined = new Subject();
    this.onCohortLeft = new Subject();
    this.onTransaction = new Subject();
    this.onMetatransactionSignatureRequested = new Subject();
    this.onTokenBalanceUpdate = new Subject();
    this.onNftBalanceUpdate = new Subject();
    this.onBackupRestored = new Subject();
    this.onPermissionsGranted = new Subject();
    this.onPermissionsRequested = new Subject();
    this.onPermissionsRevoked = new Subject();
    this.onPermissionsUpdated = new Subject();
  }
}
